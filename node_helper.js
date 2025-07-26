const NodeHelper = require("node_helper");
const fetch = require("node-fetch");
const { parseStringPromise } = require("xml2js");

module.exports = NodeHelper.create({
  start() {
    console.log("MMM-KVV-Trias helper started...");
  },

  async socketNotificationReceived(notification, config) {
    if (notification === "FETCH_KVV_DATA") {
      try {
        const body = this.buildRequestXML(config.stationID, config.requestorRef, config.stopsToShow);
        const res = await fetch(config.apiURL, {
          method: "POST",
          headers: {
            "Content-Type": "text/xml"
          },
          body
        });

        const xml = await res.text();
        //console.log(xml);
        //console.log(new Date().toISOString());
        //console.log(config.stationID);
        const json = await parseStringPromise(xml);
        
        const trains = this.parseDepartures(json);
        //console.log(trains);
        this.sendSocketNotification("KVV_DATA", trains);
      } catch (err) {
        console.error("KVV fetch error:", err);
        this.sendSocketNotification("KVV_DATA", []);
      }
    }
  },

  buildRequestXML(stationID, requestorRef, NumberOfResults) {
    const now = new Date().toISOString();

    return `<?xml version="1.0" encoding="UTF-8"?>
<Trias version="1.1" xmlns="http://www.vdv.de/trias" xmlns:siri="http://www.siri.org.uk/siri" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <ServiceRequest>
    <siri:RequestTimestamp>${now}</siri:RequestTimestamp>
    <siri:RequestorRef>${requestorRef}</siri:RequestorRef>
    <RequestPayload>
      <StopEventRequest>
        <Location>
          <LocationRef>
            <StopPointRef>${stationID}</StopPointRef>
          </LocationRef>
          <DepArrTime>${now}</DepArrTime>
        </Location>
        <Params>
          <NumberOfResults>${NumberOfResults}</NumberOfResults>
          <StopEventType>departure</StopEventType>
          <IncludePreviousCalls>false</IncludePreviousCalls>
          <IncludeOnwardCalls>false</IncludeOnwardCalls>
          <IncludeRealtimeData>true</IncludeRealtimeData>
        </Params>
      </StopEventRequest>
    </RequestPayload>
  </ServiceRequest>
</Trias>
`;
  },

  parseDepartures(json) {
    try {
      const delivery = json?.Trias?.ServiceDelivery?.[0];
      const payload = delivery?.DeliveryPayload?.[0];
      const stopEventResponse = payload?.StopEventResponse?.[0];
      const stopEvents = stopEventResponse?.StopEventResult;
  
      if (!stopEvents || !Array.isArray(stopEvents)) {
        console.warn("No StopEventResult found in response.");
        return [];
      }
  
      return stopEvents.map((e) => {
        const event = e?.StopEvent?.[0];
        const thisCall = event?.ThisCall?.[0];
        const callAtStop = thisCall?.CallAtStop?.[0];
        const service = event?.Service?.[0];
  
        const plannedTime = callAtStop?.ServiceDeparture?.[0]?.TimetabledTime?.[0];
        const realTime = callAtStop?.ServiceDeparture?.[0]?.EstimatedTime?.[0] || null;
  
        const fullLine = service?.PublishedLineName?.[0]?.Text?.[0] || "–";
        const lineParts = fullLine.trim().split(" ");
        const lineShort = lineParts.length > 1 ? lineParts.slice(1).join(" ") : fullLine;

        return {
          line: lineShort,
          direction: service?.DestinationText?.[0]?.Text?.[0] || "–",
          plannedTime: plannedTime ? plannedTime.substring(11, 16) : "–",
          realTime: realTime ? realTime.substring(11, 16) : "N/A"
        };

      });
    } catch (e) {
      console.error("Failed to parse TRIAS response:", e);
      return [];
    }
  }
});
