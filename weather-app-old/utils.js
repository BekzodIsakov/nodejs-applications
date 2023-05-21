const request = require("request");

function forecast(lat, long, callback) {
  const url = `http://api.weatherstack.com/current?access_key=e416bc52c2535b275b33681132e10f05&query=${lat},${long})}`;
  request({ url, json: true }, (error, response, body) => {
    if (error) {
      callback("Unable to connect to weather service!");
    } else if (body.error) {
      callback("Not found!");
    } else {
      callback(
        null,
        `${body.current.weather_descriptions[0]}. It's currently ${body.current.temperature} degrees out. There's a ${body.current.precip}% chance of rain.`
      );
    }
  });
}

function geocode(location, callback) {
  const access_token =
    "pk.eyJ1IjoiYmVrem9kNTE3IiwiYSI6ImNsaHMwbGF1ZjA0YmkzZXFwMmJvbWpkbXgifQ.ZHpxTPAC9Kr9l64PrnyOwA";
  const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${location}.json?access_token=${access_token}`;
  request({ url, json: true }, (error, response, body) => {
    if (error) {
      callback("Unable to connect to geocoding service!");
    } else if (body.error) {
      callback("Not found!");
    } else {
      callback(null, {
        latitude: body.features[0].center[1],
        longitude: body.features[0].center[0],
        location: body.features[0].place_name,
      });
    }
  });
}

module.exports = { forecast, geocode };
