const apiKey = 'AIzaSyAiKmGF_oEbf1-i2JPBGFHM282pCcMlZr8';
const spreadsheetId = '1RLNa8jHR55u_16SIK93J3daMxR1PhhbsHf_PMWamNkc';
const range = '宿題';

async function fetchHomeworkData() {
    const response = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}?key=${apiKey}`);
    const data = await response.json();
    return data;
}

function createHomeworkTable(data) {
    const homeworkContainer = document.getElementById('homework');
    const rows = data.values.slice(1);

    rows.forEach(row => {
        const [date, subject, content] = row;

        const homeworkLi = document.createElement('li');
        homeworkLi.className = 'homework-item';

        const dateDiv = document.createElement('div');
        dateDiv.textContent = `締切日: ${date}`;
        homeworkLi.appendChild(dateDiv);

        const subjectDiv = document.createElement('div');
        subjectDiv.textContent = `教科: ${subject}`;
        homeworkLi.appendChild(subjectDiv);

        const contentDiv = document.createElement('div');
        contentDiv.textContent = `内容: ${content}`;
        homeworkLi.appendChild(contentDiv);

        homeworkContainer.appendChild(homeworkLi);
    });
}

async function initialize() {
    const data = await fetchHomeworkData();
    createHomeworkTable(data);
}

window.onload = initialize;