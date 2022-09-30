// drop down menu
const dropdown_btn = document.querySelector(".dropdownBtn");
const dropdown_content = document.getElementById("mydropdown");

dropdown_btn.addEventListener("click", function () {
  dropdown_content.classList.toggle("hide");
  if (!dropdown_content.classList.contains("hide")) {
    dropdown_btn.style.backgroundImage =
      "url(https://img.icons8.com/material-sharp/18/4D4D4D/collapse-arrow.png)";
  } else {
    dropdown_btn.style.backgroundImage =
      "url(https://img.icons8.com/material-outlined/19/4D4D4D/expand-arrow--v1.png)";
  }
});

// Close the dropdown if the user clicks outside of it
window.onclick = function (event) {
  if (!event.target.matches(".dropdownBtn")) {
    let dropdowns = document.getElementsByClassName("dropdown-Content");
    let i;
    for (i = 0; i < dropdowns.length; i++) {
      let openDropdown = dropdowns[i];
      if (!openDropdown.classList.contains("hide")) {
        openDropdown.classList.add("hide");
      }
    }
  }
};

// get countries
let countries = [];
const countryCardTemplate = document.querySelector("[data-user-template]");
const userCardContainer = document.querySelector("[data-countries-container]"); 

//filter items
const regions = document.querySelectorAll(".c-Region");
const regionName = document.getElementsByClassName("region");

regions.forEach((btn) => {
  btn.addEventListener("click", () => {
    Array.from(regionName).forEach((elem) => {
      if (elem.innerText.includes(btn.innerText) || btn.innerText == "All") {
        elem.parentElement.parentElement.parentElement.parentElement.style.display =
          "grid";
      } else {
        elem.parentElement.parentElement.parentElement.parentElement.style.display =
          "none";
      }
    });
  });
});

//Search bar
const search = document.getElementById("search");

search.addEventListener("input", (e) => {
  const value = e.target.value.toLowerCase();

  countries.forEach((country) => {
    const isVisible = country.name.toLowerCase().includes(value);

    country.element.classList.toggle("hide", !isVisible);
  });
});

document.addEventListener("DOMContentLoaded", function () {
  // loader
  const loader = document.getElementById("preloader");

  function showLoader() {
    loader.classList.add("showloader");
  }
  function hideLoader() {
    loader.classList.remove("showloader");
  }

  showLoader();
  fetch("https://restcountries.com/v3.1/all")
    .then((res) => res.json())
    .then((data) => {
      hideLoader();
      delete data[181];

      countries = data.map((card) => {
        const country = countryCardTemplate.content.cloneNode(true).children[0];

        const flag = country.querySelector(".country-flag");
        const name = country.querySelector(".country-name");
        const population = country.querySelector(".population");
        const region = country.querySelector(".region");
        const capital = country.querySelector(".capital");

        flag.setAttribute("src", card.flags.png);
        name.textContent = card.name.common;
        population.textContent = card.population.toLocaleString();
        region.textContent = card.region;
        capital.textContent = card.capital;

        userCardContainer.appendChild(country);
        // show country details on click
        country.addEventListener("click", () => {
          userCardContainer.style.display = "none";
          showCountryDetails(card);
        });

        return {
          name: card.name.common,
          region: card.region,
          element: country,
        };
      });

      //load more
      let loadBtn = document.getElementById("loadMore");
      let allCountries = document.querySelectorAll(".country");
      let currentCountries = 52;
      for (let i = 52; i < allCountries.length; i++) {
        allCountries[i].classList.add("hide");
      }

      loadBtn.addEventListener("click", (e) => {
        for (let i = 52; i < currentCountries + 52; i++) {
          if (allCountries[i]) {
            allCountries[i].style.display = "block";
          }
        }
        currentCountries += 52;

        // Load more button will be hidden after list fully loaded
        if (currentCountries >= allCountries.length) {
          e.target.style.display = "none";
        }
      });
    });

  // country info
  function showCountryDetails(data) {
    const countryResName = data.name.common;
    const countriesResponse = async () => {
      showLoader();
      const response = await fetch(
        `https://restcountries.com/v2/name/${countryResName}`
      );
      const result = await response.json();
      hideLoader();
      const countryModel = document.querySelector(".all");

      // delete Country
      countryModel.classList.toggle("show");
      countryModel.innerHTML = `
   
  <button class="back">
<img
  src="https://img.icons8.com/material-sharp/14/000000/long-arrow-left.png"
  alt=""
  class="back-Arrow"
/>
Back
</button>
<div class="countryModel body">
<div class="model">
  <div class="leftModel">
    <img
      src="${result[0].flags.png}"
      alt="flag"
      class="flag"
    />
  </div>

  <div class="rightModel">
    <div class="countryPreview">
      <div class="innerLeft country-info">
        <h1 class="countryName">${result[0].name}</h1>
        <p>Native Name: <span>${result[0].nativeName}</span></p>
        <p>Population:<span>${result[0].population.toLocaleString()}</span></p>
        <p>Region: <span>${result[0].region}</span></p>
        <p>Sub Region: <span>${result[0].subregion}</span></p>
        <p>Capital: <span>${result[0].capital}</span></p>
      </div>
      <div class="innerRight country-info">
        <p>Top Level Domains: <span>${result[0].topLevelDomain[0]}</span></p>
        <p>Currencies:<span>${result[0].currencies.map(
          (elem) => elem.name
        )}</span></p>
        <p>Languages: <span>${result[0].languages.map(
          (elem) => elem.name
        )}</span></p> 
      </div>
  </div>
</div>
</div>
`;
      const back_Btn = document.querySelector(".back");
      back_Btn.addEventListener("click", function () {
        userCardContainer.style.display = "grid";
        countryModel.classList.toggle("show");
      });
    };

    countriesResponse();
  }
});
//toggle dark mode
const darkModebtn = document.querySelector(".darkMode");

darkModebtn.addEventListener("click", function () {
  var element = document.body;
  element.classList.toggle("dark");
});
