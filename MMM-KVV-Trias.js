Module.register("MMM-KVV-Trias", {
  defaults: {
    stationID: "", // e.g. "de:8212:1:1"
    updateInterval: 60000, // in ms
    stopsToShow: 5,
    apiURL: "",
    requestorRef: "",
  },

  start() {
    this.trains = [];
    this.loaded = false;
    this.getData();
    this.scheduleUpdate();
  },

  scheduleUpdate() {
    setInterval(() => {
      this.getData();
    }, this.config.updateInterval);
  },

  getData() {
    this.sendSocketNotification("FETCH_KVV_DATA", this.config);
  },

  socketNotificationReceived(notification, payload) {
    if (notification === "KVV_DATA") {
      this.trains = payload;
      this.loaded = true;
      this.updateDom();
    }
  },

  getHeader() {
    return "Departures from Station";
  },

  getDom() {
    const wrapper = document.createElement("div");

    if (!this.loaded) {
      wrapper.innerHTML = "Loading...";
      return wrapper;
    }

    const table = document.createElement("table");
    table.className = "small";

    this.trains.slice(0, this.config.stopsToShow).forEach((train) => {
      const row = document.createElement("tr");

      const lineCell = document.createElement("td");
      const lineBadge = document.createElement("span");
      lineBadge.innerText = train.line;
            
      // Style it as a badge
      lineBadge.style.padding = "2px 6px";
      lineBadge.style.borderRadius = "12px";
      lineBadge.style.color = "white";
            
      // Set color based on type
      if (train.line.startsWith("S")) {
        lineBadge.style.backgroundColor = "#0c9655"; // green for S-Bahn
      } else if (train.line.startsWith("RB")) {
        lineBadge.style.backgroundColor = "#3498db"; // blue for RB
      } else if (train.line.startsWith("RE")) {
        lineBadge.style.backgroundColor = "#f01b1b"; // red for RE
      } else {
        lineBadge.style.backgroundColor = "#7f8c8d"; // grey fallback
      }
      
      lineCell.appendChild(lineBadge);
      row.appendChild(lineCell);

      const directionCell = document.createElement("td");
      directionCell.innerHTML = train.direction;
      row.appendChild(directionCell);

      const plannedCell = document.createElement("td");
      plannedCell.innerHTML = train.plannedTime;
      row.appendChild(plannedCell);

      const realCell = document.createElement("td");
      realCell.innerHTML = train.realTime || "-";
      row.appendChild(realCell);

      table.appendChild(row);
    });

    wrapper.appendChild(table);
    return wrapper;
  }
});
