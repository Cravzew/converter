import iconArr from './iconArr.js';

const courseDate = document.getElementById("course__date");
const courseTable = document.getElementById("course__table");
const timeLoading = document.getElementById("time-loading");

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
