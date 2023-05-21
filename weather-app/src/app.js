const express = require("express");
const path = require("path");
const hbs = require("hbs");

const { forecast, geocode } = require("./utils");

const app = express();

const pubDirPath = path.join(__dirname, "../public");
const viewsDirPath = path.join(__dirname, "../templates/views");
const partialsDirPath = path.join(__dirname, "../templates/partials");

app.set("view engine", "hbs");
app.set("views", viewsDirPath);

hbs.registerPartials(partialsDirPath);

app.get("", (req, res) => {
  res.render("index", {
    title: "Home",
    author: "Bekzod Isakov",
  });
});

app.get("/about", (req, res) => {
  res.render("about", {
    title: "About",
    author: "Bekzod Isakov",
  });
});

app.get("/help", (req, res) => {
  res.render("help", {
    title: "Help",
    author: "Bekzod Isakov",
  });
});

app.use(express.static(pubDirPath));
app.use(
  "/resume",
  express.static(path.join(__dirname, "../public", "/resume.pdf"))
);

app.get("/weather", (req, res) => {
  const { location } = req.query;
  console.log(location);

  if (!location)
    return res.send({ error: "Location undefined! Provide a location." });
  geocode(location, (error, { latitude, longitude, location } = {}) => {
    if (error) {
      return res.send({ error });
    }

    forecast(latitude, longitude, (error, forecastData) => {
      if (error) return res.send({ error });

      res.send({
        location,
        forecastData,
      });
    });
  });
});

app.use((req, res, next) => {
  res.status(404).render("404", {
    author: "Bekzod Isakov",
  });
});


const PORT = 3000;
app.listen(PORT, () => {
  console.log("Server is live");
  console.log(process.env.NODE_ENV || 'development');
});
