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
  try {
    const response = await fetch(
      `/weather?location=${location}`
    );
    const forecast = await response.json();
    renderForecast(forecast);
  } catch (error) {
    showResult("Something went wrong. Check developer console.", true);
    console.error(error);
  }
}

// console.log(process.env.NODE_ENV || 'development');

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
