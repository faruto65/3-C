const apiKey = 'YOUR_API_KEY';
const spreadsheetId = '1RLNa8jHR55u_16SIK93J3daMxR1PhhbsHf_PMWamNkc';
const range = '時間割';
const driveFolderId = '1-AbgYUOYiTPvmUmtwhpfrSl2HpeYMRoM';

document.addEventListener('DOMContentLoaded', () => {
    fetchScheduleData().then(data => {
        createScheduleTable(data);
    });

    const toggleButton = document.getElementById('toggleButton');
    toggleButton.addEventListener('click', toggleDisplayMode);
});

async function fetchScheduleData() {
    const response = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}?key=${apiKey}`);
    const data = await response.json();
    return data;
}

async function fetchDriveImages() {
    const response = await fetch(`https://www.googleapis.com/drive/v3/files?q='${driveFolderId}'+in+parents&key=${apiKey}`);
    const data = await response.json();
    return data.files.filter(file => file.mimeType === 'image/jpeg');
}

function toggleDisplayMode() {
    const scheduleContainer = document.getElementById('scheduleContainer');
    const imageContainer = document.getElementById('imageContainer');
    const toggleButton = document.getElementById('toggleButton');

    if (scheduleContainer.style.display === 'none') {
        scheduleContainer.style.display = 'block';
        imageContainer.style.display = 'none';
        toggleButton.textContent = '画像表示に切り替え';
    } else {
        scheduleContainer.style.display = 'none';
        imageContainer.style.display = 'block';
        toggleButton.textContent = 'テキスト表示に切り替え';

        fetchDriveImages().then(images => {
            displayImages(images);
        });
    }
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

function toggleVisibility(element) {
    element.style.display = element.style.display === 'none' || element.style.display === '' ? 'block' : 'none';
}

function displayImages(images) {
    const imageContainer = document.getElementById('imageContainer');
    imageContainer.innerHTML = '';

    images.forEach(image => {
        const img = document.createElement('img');
        img.src = `https://drive.google.com/uc?id=${image.id}`;
        img.alt = image.name;
        img.className = 'schedule-image';

        const dateLi = document.createElement('li');
        dateLi.className = 'date-header';
        dateLi.textContent = formatDateFromFileName(image.name);

        const imageUl = document.createElement('ul');
        const imageLi = document.createElement('li');
        imageLi.appendChild(img);
        imageUl.appendChild(imageLi);

        dateLi.appendChild(imageUl);
        dateLi.addEventListener('click', () => toggleVisibility(imageUl));
        imageContainer.appendChild(dateLi);
    });
}

function formatDateFromFileName(fileName) {
    const [year, month, day] = fileName.split(' ')[0].split('-');
    return `${year}/${month}/${day}`;
}
