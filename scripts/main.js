import iconArr from "./iconArr.js";

const courseDate = document.getElementById("course__date");
const courseTable = document.getElementById("course__table");
const timeLoading = document.getElementById("time-loading");
const converter = document.getElementById("convert");
const converted = document.getElementById("converted");
const converterConvertBox = document.getElementById("converter__convert-box");
// const converterSelecter = document.querySelector(".converter__selecter");
// const converterSelecterItems = document.querySelectorAll(
//   ".converter__selecter-item"
// );
const converterConvertBoxtext = document.querySelector(
  ".converter__convert-boxtext"
);
// const convertSelecterList = document.querySelector(".converter__selecter-list");

fetch("https://www.cbr-xml-daily.ru/daily_json.js")
  .then((response) => response.json())
  .then((json) => {
    const today = json.Date;
    const todayYear = today.substring(0, 4);
    const todayMonth = today.substring(5, 7);
    const todayDay = today.substring(8, 10);

    courseDate.textContent = `${todayDay}.${todayMonth}.${todayYear}`;

    const valute = Object.entries(json.Valute).map((i) => i[1]);
    timeLoading.remove();

    for (let i = 0; i < valute.length; i++) {
      courseTable.innerHTML += `
		  <div class="course__table-group">
		  <div class="course__table-header">
			  <p class="course__table-header-code">Код</p>
			  <p class="course__table-header-number">Единица</p>
			  <p class="course__table-header-valute">Валюта</p>
			  <p class="course__table-header-course">Курс базовой валюты</p>
		  </div>
		  <div class="course__table-body">
			  <p class="course__table-body-code">
			  ${
          iconArr[valute[i].CharCode] !== undefined
            ? iconArr[valute[i].CharCode]
            : iconArr["NONE"]
        }
				  ${valute[i].CharCode}
			  </p>
			  <p class="course__table-body-number">${valute[i].Nominal}</p>
			  <p class="course__table-body-valute">${valute[i].Name}</p>
			  <p class="course__table-body-course">${valute[i].Value}</p>
		  </div>
	  </div> 
		  `;
    }
  });

//   превратить селектор в массив и создать самому функция

converter.addEventListener("input", (e) => {
  converted.value = (e.target.value * converter.dataset.value).toFixed(2);
});

converterConvertBox.addEventListener("click", () => {
  if (document.querySelectorAll(".converter__selecter").length === 1) {
    document.querySelector(".converter__selecter").remove();
  } else {
    generateValuteList();
  }
});

async function generateValuteList() {
  const converterSelector = document.createElement("div");
  const converterSelectorClose = document.createElement("button");
  const converterSelectorList = document.createElement("ul");

  converterSelector.classList.add("converter__selecter");
  converterSelectorClose.classList.add("converter__selector-close");
  converterSelectorList.classList.add("converter__selecter-list");

  converterSelectorClose.innerHTML = `
  <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
							<path d="M26 14L14 26" stroke="#777F85" stroke-linecap="round" stroke-linejoin="round" />
							<path d="M14 14L26 26" stroke="#777F85" stroke-linecap="round" stroke-linejoin="round" />
						</svg>`;

  document.querySelector(".converter__content").append(converterSelector);
  converterSelector.append(converterSelectorClose);
  converterSelector.append(converterSelectorList);

  converterSelectorClose.addEventListener("click", () => {
    converterSelector.remove();
	document.querySelector(".container").style.padding = "0 15px";
  });

  if (window.matchMedia("(max-width: 578px)").matches) {
    document.body.style.overflow = "hidden";
    document.querySelector(".container").style.padding = "0";
  }

  const response = await fetch("https://www.cbr-xml-daily.ru/daily_json.js");
  const data = response.json();
  data.then((json) => {
    const valute = Object.entries(json.Valute).map((i) => i[1]);
    for (let i = 0; i < valute.length; i++) {
      converterSelectorList.innerHTML += `
		  <li data-target="${valute[i].Value}" data-charcode="${valute[i].CharCode}" class="converter__selecter-item">
		  <button class="converter__selecter-button">
		  <span>${valute[i].Name}</span>
		  <strong>${valute[i].CharCode}</strong>
		  </button>
		  </li> 
		  `;
    }
    document.querySelectorAll(".converter__selecter-item").forEach((item) => {
      item.addEventListener("click", (e) => {
		document.querySelector(".container").style.padding = "0 15px";
        converter.dataset.value = e.currentTarget.dataset.target;
        converterConvertBoxtext.textContent = e.currentTarget.dataset.charcode;
        converterSelector.remove();
        converted.value = (converter.value * converter.dataset.value).toFixed(
          2
        );
      });
    });
  });
}
