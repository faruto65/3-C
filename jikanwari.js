const apiKey = 'AIzaSyAiKmGF_oEbf1-i2JPBGFHM282pCcMlZr8';
const spreadsheetId = '1RLNa8jHR55u_16SIK93J3daMxR1PhhbsHf_PMWamNkc';
const range = '時間割';
const folderId = '1-AbgYUOYiTPvmUmtwhpfrSl2HpeYMRoM';  // Google DriveフォルダID

async function fetchScheduleData() {
    const response = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}?key=${apiKey}`);
    const data = await response.json();
    return data;
}

async function fetchImageUrls() {
    const response = await fetch(`https://www.googleapis.com/drive/v3/files?q='${folderId}'+in+parents&key=${apiKey}&fields=files(id,name,mimeType)`);
    const data = await response.json();
    const imageUrls = data.files
        .filter(file => file.mimeType.startsWith('image/'))
        .map(file => `https://drive.google.com/uc?export=view&id=${file.id}`);
    return imageUrls;
}

function toggleVisibility(element) {
    element.style.display = element.style.display === 'none' || element.style.display === '' ? 'block' : 'none';
}

function createScheduleTable(data, imageUrls) {
    const scheduleContainer = document.getElementById('schedule');
    const imageContainer = document.getElementById('imageList');
    const dates = data.values[0].slice(1);
    const times = data.values.slice(1);

    for (let i = 0; i < dates.length; i++) {
        const dateLi = document.createElement('li');
        dateLi.className = 'date-header';
        dateLi.textContent = dates[i];

        const scheduleUl = document.createElement('ul');
        const imageUl = document.createElement('ul');

        for (let j = 0; j < times.length; j++) {
            const timeLi = document.createElement('li');
            timeLi.textContent = times[j][0] + ': ' + (times[j][i + 1] || '授業なし');
            scheduleUl.appendChild(timeLi);

            const imageLi = document.createElement('li');
            const imageUrl = imageUrls[j]; // 画像URLを取得
            if (imageUrl) {
                const img = document.createElement('img');
                img.src = imageUrl;
                img.alt = 'Schedule Image';
                imageLi.appendChild(img);
            } else {
                imageLi.textContent = '画像なし';
            }
            imageUl.appendChild(imageLi);
        }

        dateLi.appendChild(scheduleUl);
        dateLi.appendChild(imageUl);
        dateLi.addEventListener('click', () => {
            toggleVisibility(scheduleUl);
            toggleVisibility(imageUl);
        });

        scheduleContainer.appendChild(dateLi);
        imageContainer.appendChild(dateLi.cloneNode(true)); // clone for image container
    }
}

async function initialize() {
    const scheduleData = await fetchScheduleData();
    const imageUrls = await fetchImageUrls();
    createScheduleTable(scheduleData, imageUrls);

    const toggleButton = document.getElementById('toggleButton');
    const scheduleContainer = document.getElementById('scheduleContainer');
    const imageContainer = document.getElementById('imageContainer');

    toggleButton.addEventListener('click', () => {
        toggleVisibility(scheduleContainer);
        toggleVisibility(imageContainer);
    });
}

window.onload = initialize;
