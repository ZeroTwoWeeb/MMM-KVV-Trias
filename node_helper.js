const NodeHelper = require("node_helper");
const fetch = require("node-fetch");
const { parseStringPromise } = require("xml2js");

module.exports = NodeHelper.create({
  start: function () {
    console.log("Starting node helper for MMM-KVV-Trias");
  },

  socketNotificationReceived: async function (notification, config) {
    if (notification === "GET_CONNECTIONS") {
      try {
        const data = await this.fetchConnections(config);
        this.sendSocketNotification("CONNECTIONS", data);
      } catch (error) {
        console.error("MMM-KVV-Trias error:", error);
        this.sendSocketNotification("CONNECTIONS", []);
      }
    }
  },

  async fetchConnections(config) {
    const body = `
      <Trias version="1.1" xmlns="http://www.vdv.de/trias">
        <ServiceRequest>
          <s:RequestTimestamp xmlns:s="http://www.vdv.de/trias">${new Date().toISOString()}</s:RequestTimestamp>
          <s:RequestorRef xmlns:s="http://www.vdv.de/trias">${config.requestorRef}</s:RequestorRef>
          <RequestPayload>
            <StopEventRequest>
              <Location>
                <LocationRef>
                  <StopPointRef>${config.station}</StopPointRef>
                </LocationRef>
                <DepArrTime>${new Date().toISOString()}</DepArrTime>
              </Location>
              <Params>
                <NumberOfResults>${config.maxConnections}</NumberOfResults>
                <StopEventType>departure</StopEventType>
                <IncludeRealtimeData>true</IncludeRealtimeData>
              </Params>
            </StopEventRequest>
          </RequestPayload>
        </ServiceRequest>
      </Trias>
    `;

    const response = await fetch("https://projekte.kvv-efa.de/dammtrias/trias", {
      method: "POST",
      headers: {
        "Content-Type": "application/xml"
      },
      body: body
    });

    const xml = await response.text();
    const result = await parseStringPromise(xml);
    const events = result?.Trias?.ServiceDelivery?.[0]?.StopEventResponse?.[0]?.StopEventResult || [];

    return events.map(event => {
      const depTime = event?.StopEvent?.[0]?.ThisCall?.[0]?.CallAtStop?.[0]?.ServiceDeparture?.[0]?.TimetabledTime?.[0];
      const line = event?.StopEvent?.[0]?.Service?.[0]?.PublishedLineName?.[0]?._;
      const dest = event?.StopEvent?.[0]?.Service?.[0]?.DestinationText?.[0];
      return {
        time: new Date(depTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        line: line,
        destination: dest
      };
    });
  }
});
