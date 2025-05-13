Module.register("MMM-KVV-Trias", {
  defaults: {
    station: "Karlsruhe Hauptbahnhof", // default station
    maxConnections: 5,
    updateInterval: 60000, // 1 minute
    requestorRef: "password"
  },

  start: function () {
    this.connections = [];
    this.loaded = false;
    this.getData();
    this.scheduleUpdate();
  },

  scheduleUpdate: function () {
    setInterval(() => {
      this.getData();
    }, this.config.updateInterval);
  },

  getData: function () {
    this.sendSocketNotification("GET_CONNECTIONS", this.config);
  },

  socketNotificationReceived: function (notification, payload) {
    if (notification === "CONNECTIONS") {
      this.connections = payload;
      this.loaded = true;
      this.updateDom();
    }
  },

  getDom: function () {
    const wrapper = document.createElement("div");
    if (!this.loaded) {
      wrapper.innerHTML = "Loading KVV data...";
      return wrapper;
    }

    if (this.connections.length === 0) {
      wrapper.innerHTML = "No connections found.";
      return wrapper;
    }

    const table = document.createElement("table");
    this.connections.forEach((conn) => {
      const row = document.createElement("tr");
      row.innerHTML = `<td>${conn.time}</td><td>${conn.line}</td><td>${conn.destination}</td>`;
      table.appendChild(row);
    });
    wrapper.appendChild(table);
    return wrapper;
  }
});
