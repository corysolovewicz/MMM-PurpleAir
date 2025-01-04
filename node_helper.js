/* Magic Mirror
 * Module: MMM-PurpleAir
 *
 * author: Cory Solovewicz
 * MIT Licensed.
 */
const NodeHelper = require('node_helper');
const axios = require('axios');

const NotificationType = {
  Request: "request",
  Response: "response",
};

module.exports = NodeHelper.create({
  start: function () {
    console.log(`${this.name} helper starting...`);
  },

  socketNotificationReceived: async function (notificationName, data) {
    const { responseKey, req } = data;

    if (notificationName === `${this.name}.${NotificationType.Request}`) {
      try {
        // Perform the HTTP request using axios
        const response = await axios({
          method: req.method || 'get',
          url: req.url,
          headers: req.headers,
          data: req.body, // Add this if the request includes a body for POST/PUT
        });

        console.log(`${this.name} ${responseKey} response code: ${response.status}`);
        this.sendSocketNotification(responseKey, {
          error: null,
          request: req,
          response: {
            statusCode: response.status,
            body: response.data,
          },
        });
      } catch (error) {
        console.error(`${this.name} ${responseKey} error: ${error.message}`);
        this.sendSocketNotification(responseKey, {
          error: error.message,
          request: req,
          response: null,
        });
      }
    }
  },
});
