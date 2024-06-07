const apiKey = 'AIzaSyAiKmGF_oEbf1-i2JPBGFHM282pCcMlZr8';
const spreadsheetId = '1RLNa8jHR55u_16SIK93J3daMxR1PhhbsHf_PMWamNkc';
const range = '時間割';

async function fetchScheduleData() {
    const response = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}?key=${apiKey}`);
    const data = await response.json();
    return data;
}

function toggleVisibility(element) {
    element.style.display = element.style.display === 'none' || element.style.display === '' ? 'block' : 'none';
}

function createScheduleTable(data) {
    const scheduleContainer = document.getElementById('schedule');
    const dates = data.values[0].slice(1);
    const times = data.values.slice(1);

    for (let i = 0; i < dates.length; i++) {
        const dateLi = document.createElement('li');
        dateLi.className = 'date-header';
        dateLi.textContent = dates[i];

        const scheduleUl = document.createElement('ul');

        for (let j = 0; j < times.length; j++) {
            const timeLi = document.createElement('li');
            timeLi.textContent = times[j][0] + ': ' + (times[j][i + 1] || '授業なし');
            scheduleUl.appendChild(timeLi);
        }

        dateLi.appendChild(scheduleUl);
        dateLi.addEventListener('click', () => toggleVisibility(scheduleUl));
        scheduleContainer.appendChild(dateLi);
    }
}

async function initialize() {
    const data = await fetchScheduleData();
    createScheduleTable(data);
}

window.onload = initialize;