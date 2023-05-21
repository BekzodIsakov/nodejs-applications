const form = document.querySelector("form");
const search = document.querySelector("input");
const resultContainer = document.querySelector("#result");

form.onsubmit = function (e) {
  e.preventDefault();
  const location = search.value.trim();

  if (!location) {
    showResult("Invalid input", true);
  } else {
    showResult("searching...");
    getForecast(location);
  }
};

async function getForecast(location) {
  const BASE_URL = "http://localhost:3000";
  try {
    const response = await fetch(
      `${BASE_URL}/weather?location=${location}`
    );
    const forecast = await response.json();
    renderForecast(forecast);
  } catch (error) {
    showResult("Something went wrong. Check developer console.", true);
    console.error(error);
  }
}

function renderForecast({ location, forecastData, error }) {
  if (error) return showResult(error, true);

  const docFragment = document.createDocumentFragment();
  const h3 = document.createElement("h3");
  h3.textContent = location;
  docFragment.append(h3);

  const p = document.createElement("p");
  p.textContent = forecastData;
  docFragment.append(p);
  showResult(docFragment);
}

function showResult(result, error) {
  resultContainer.innerHTML = null;
  resultContainer.style.color = error ? "tomato" : "initial";
  resultContainer.append(result);
}
