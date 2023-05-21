const { forecast, geocode } = require("./utils");

const location = process.argv[2];

if (location) {
  geocode(location, (error, { latitude, longitude, location } = {}) => {
    if (error) {
      return console.log("Error: " + error);
    }

    forecast(latitude, longitude, (error, foreCastData) => {
      if (error) return console.log("Error:", error);

      console.log(location);
      console.log(foreCastData);
    });
  });
} else {
  console.log("Please, provide an address!");
}
