const apiKey = 'AIzaSyAiKmGF_oEbf1-i2JPBGFHM282pCcMlZr8';
const spreadsheetId = '1RLNa8jHR55u_16SIK93J3daMxR1PhhbsHf_PMWamNkc';
const homeworkRange = '宿題';
const eventRange = 'イベント';
const scheduleRange = '時間割';

const today = new Date();
const tomorrow = new Date(today);
tomorrow.setDate(tomorrow.getDate() + 1);

function formatDate(date) {
    const yyyy = date.getFullYear();
    const mm = ('0' + (date.getMonth() + 1)).slice(-2);
    const dd = ('0' + date.getDate()).slice(-2);
    return `${yyyy}/${mm}/${dd}`;
}

async function fetchSheetData(range) {
    const response = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}?key=${apiKey}`);
    const data = await response.json();
    return data;
}

function createListItem(text) {
    const li = document.createElement('li');
    li.textContent = text;
    return li;
}

async function displayHomeworkDueToday() {
    const data = await fetchSheetData(homeworkRange);
    const rows = data.values.slice(1);
    const homeworkContainer = document.getElementById('homework-due-today');
    const todayStr = formatDate(today);

    const homeworkList = rows.filter(row => row[0] === todayStr);
    homeworkContainer.innerHTML = '';  // Clear previous content

    if (homeworkList.length === 0) {
        const listItem = createListItem('なし');
        homeworkContainer.appendChild(listItem);
    } else {
        homeworkList.forEach(row => {
            const [dueDate, subject, content] = row;
            const listItem = createListItem(`${subject}: ${content}`);
            homeworkContainer.appendChild(listItem);
        });
    }
}

async function displayHomeworkDueTomorrow() {
    const data = await fetchSheetData(homeworkRange);
    const rows = data.values.slice(1);
    const homeworkContainer = document.getElementById('homework-due-tomorrow');
    const tomorrowStr = formatDate(tomorrow);

    const homeworkList = rows.filter(row => row[0] === tomorrowStr);
    homeworkContainer.innerHTML = '';  // Clear previous content

    if (homeworkList.length === 0) {
        const listItem = createListItem('なし');
        homeworkContainer.appendChild(listItem);
    } else {
        homeworkList.forEach(row => {
            const [dueDate, subject, content] = row;
            const listItem = createListItem(`${subject}: ${content}`);
            homeworkContainer.appendChild(listItem);
        });
    }
}

async function displayEvents() {
    const data = await fetchSheetData(eventRange);
    const rows = data.values.slice(1);
    const todayEventsContainer = document.getElementById('today-events');
    const tomorrowEventsContainer = document.getElementById('tomorrow-events');
    const todayStr = formatDate(today);
    const tomorrowStr = formatDate(tomorrow);

    const todayEvents = rows.filter(row => row[0] === todayStr);
    const tomorrowEvents = rows.filter(row => row[0] === tomorrowStr);

    todayEventsContainer.innerHTML = '';  // Clear previous content
    tomorrowEventsContainer.innerHTML = '';  // Clear previous content

    if (todayEvents.length === 0) {
        const listItem = createListItem('なし');
        todayEventsContainer.appendChild(listItem);
    } else {
        todayEvents.forEach(row => {
            const [eventDate, subject, event] = row;
            const listItem = createListItem(`${subject}: ${event}`);
            todayEventsContainer.appendChild(listItem);
        });
    }

    if (tomorrowEvents.length === 0) {
        const listItem = createListItem('なし');
        tomorrowEventsContainer.appendChild(listItem);
    } else {
        tomorrowEvents.forEach(row => {
            const [eventDate, subject, event] = row;
            const listItem = createListItem(`${subject}: ${event}`);
            tomorrowEventsContainer.appendChild(listItem);
        });
    }
}

async function displaySchedule() {
    const data = await fetchSheetData(scheduleRange);
    const rows = data.values;
    const dates = rows[0].slice(1);
    const times = rows.slice(1);
    const todayStr = formatDate(today);
    const tomorrowStr = formatDate(tomorrow);
    const todayScheduleContainer = document.getElementById('today-schedule');
    const tomorrowScheduleContainer = document.getElementById('tomorrow-schedule');

    todayScheduleContainer.innerHTML = '';  // Clear previous content
    tomorrowScheduleContainer.innerHTML = '';  // Clear previous content

    let todayFound = false;
    let tomorrowFound = false;

    dates.forEach((date, i) => {
        if (date === todayStr) {
            todayFound = true;
            times.forEach(time => {
                const listItem = createListItem(`${time[0]}: ${time[i + 1] || 'なし'}`);
                todayScheduleContainer.appendChild(listItem);
            });
        } else if (date === tomorrowStr) {
            tomorrowFound = true;
            times.forEach(time => {
                const listItem = createListItem(`${time[0]}: ${time[i + 1] || 'なし'}`);
                tomorrowScheduleContainer.appendChild(listItem);
            });
        }
    });

    if (!todayFound) {
        const listItem = createListItem('なし');
        todayScheduleContainer.appendChild(listItem);
    }

    if (!tomorrowFound) {
        const listItem = createListItem('なし');
        tomorrowScheduleContainer.appendChild(listItem);
    }
}

async function initialize() {
    await displayHomeworkDueToday();
    await displayHomeworkDueTomorrow();
    await displayEvents();
    await displaySchedule();
}

window.onload = initialize;
