// Данные храним прямо в JavaScript
const allData = [
    {
        "ID": "IvanovI19",
        "ФИО": "Ситдиков Владимир",
        "Группа": "Старшая",
        "ДР": "2018-05-15",
        "Lesson": "1",
        "Topic": "Знакомство",
        "Date": "2024-01-10",
        "Question": "Что ты построил сегодня? Кто тебе помогал?"

    },
    {
        "ID": "IvanovI19", 
        "ФИО": "Ситдиков Владимир",
        "Группа": "Старшая",
        "ДР": "2018-05-15",
        "Lesson": "2",
        "Topic": "Учимся читать схемы", 
        "Date": "2024-01-17",
        "Question": "Что нового ты узнал про схемы? Сложно ли было собирать по шагам?"
    },
    {
        "ID": "IvanovP12",
        "ФИО": "Иванов Петр",
        "Группа": "Средняя", 
        "ДР": "2019-03-20",
        "Lesson": "1",
        "Topic": "Знакомство",
        "Date": "2024-01-10",
        "Question": "Что ты построил сегодня? Кто тебе помогал?"
    }
];

document.addEventListener("DOMContentLoaded", function () {
    console.log("Дневник инженера - упрощенная версия");
    
    document.getElementById("findBtn").addEventListener("click", loadData);
    document.getElementById("childId").addEventListener("keypress", e => {
        if (e.key === "Enter") loadData();
    });
    
    setupPopup();
});

function setupPopup() {
    const popup = document.getElementById("lessonPopup");
    document.getElementById("closePopup").addEventListener("click", () => popup.close());
    
    popup.addEventListener("click", e => {
        if (e.target === popup) popup.close();
    });
    
    document.addEventListener("keydown", e => {
        if (e.key === "Escape") popup.close();
    });
}

function loadData() {
    const input = document.getElementById("childId").value.trim();
    if (!input) return alert("Введите ID");

    const findBtn = document.getElementById("findBtn");
    findBtn.textContent = "Поиск...";
    findBtn.disabled = true;

    try {
        if (input.toLowerCase().startsWith('lesson')) {
            const lessonNumber = input.replace('lesson', '').trim();
            loadLessonData(lessonNumber);
        } else {
            loadChildData(input);
        }
    } catch (err) {
        alert(err.message);
    } finally {
        findBtn.textContent = "Найти";
        findBtn.disabled = false;
    }
}

function loadChildData(id) {
    const childLessons = allData.filter(item => 
        item.ID && item.ID.toLowerCase() === id.toLowerCase()
    );
    
    if (!childLessons.length) throw new Error("Ученик не найден");

    const firstLesson = childLessons[0];
    const badgesCount = childLessons.length;

    // Показываем данные ребенка
    document.getElementById("childData").hidden = false;
    document.getElementById("lessonData").hidden = true;
    document.getElementById("startScreen").hidden = true;
    
    document.getElementById("name").textContent = firstLesson.ФИО;
    document.getElementById("group").textContent = "Группа: " + firstLesson.Группа;
    document.getElementById("birthdate").textContent = firstLesson.ДР ? "ДР: " + firstLesson.ДР : "";
    
    const photoElement = document.getElementById("photo");
    photoElement.src = `images/avatars/${firstLesson.ID}.jpg`;
    photoElement.onerror = () => photoElement.src = "images/avatars/default.png";
    
    // Показываем жетоны
    displayBadges(badgesCount);
    
    // Показываем занятия
    renderLessons(childLessons);
}

function loadLessonData(lessonNumber) {
    const lessonData = allData.filter(item => 
        item.Lesson && item.Lesson.toLowerCase() === lessonNumber.toLowerCase()
    );
    
    if (!lessonData.length) throw new Error("Занятие не найдено");

    // Показываем данные занятия
    document.getElementById("childData").hidden = true;
    document.getElementById("lessonData").hidden = false;
    document.getElementById("startScreen").hidden = true;
    
    document.getElementById("lessonTitle").textContent = lessonData[0].Topic;
    document.getElementById("lessonNumber").textContent = `Занятие ${lessonNumber}`;
    document.getElementById("lessonDate").textContent = lessonData[0].Date;
    document.getElementById("childrenCount").textContent = `Детей на занятии: ${lessonData.length}`;
    
    // Показываем детей
    renderChildrenOnLesson(lessonData, lessonNumber);
}

function displayBadges(badgesCount) {
    const badgeCounter = document.getElementById("badgeCounter");
    const badgesContainer = document.getElementById("badgesContainer");
    
    badgesContainer.innerHTML = '';
    badgeCounter.textContent = badgesCount;
    badgeCounter.style.display = badgesCount > 0 ? 'flex' : 'none';

    if (badgesCount > 0) {
        createCircularBadges(badgesCount);
        document.getElementById("avatarContainer").addEventListener('click', toggleBadges);
    }
}

function createCircularBadges(badgesCount) {
    const badgesContainer = document.getElementById("badgesContainer");
    
    for (let i = 0; i < badgesCount; i++) {
        const badge = document.createElement('div');
        badge.className = 'badge';
        badge.innerHTML = `
            <img src="images/badges/badge-${i+1}.png" 
                 alt="Жетон занятия ${i+1}" 
                 class="badge-image"
                 onerror="this.src='images/badges/default.png'">
            <div class="badge-tooltip">Занятие ${i+1}</div>
        `;
        
        // Простое расположение по кругу
        const angle = (i * 2 * Math.PI / badgesCount) - Math.PI/2;
        const radius = i < 11 ? 80 : 130;
        const x = 100 + radius * Math.cos(angle);
        const y = 100 + radius * Math.sin(angle);
        
        badge.style.left = `${x-25}px`;
        badge.style.top = `${y-25}px`;
        if (i >= 11) badge.classList.add('outer-badge');
        
        badgesContainer.appendChild(badge);
    }
}

function toggleBadges() {
    document.getElementById("badgesContainer").classList.toggle('visible');
}

function renderLessons(lessons) {
    const container = document.getElementById("lessonsContainer");
    container.innerHTML = '';

    lessons.reverse().forEach(lesson => {
        const lessonCard = document.createElement('div');
        lessonCard.className = 'lesson-card';
        lessonCard.innerHTML = `
            <img src="images/lessons/${lesson.Lesson}/${lesson.ID}.jpg" 
                 alt="${lesson.Topic}" 
                 class="lesson-card__image"
                 onerror="this.style.display='none'">
            <h4>${lesson.Topic}</h4>
            <p>Урок ${lesson.Lesson}</p>
            <p>${lesson.Date}</p>
        `;
        lessonCard.addEventListener('click', () => openLessonPopup(lesson));
        container.appendChild(lessonCard);
    });
}

function renderChildrenOnLesson(children, lessonNumber) {
    const container = document.getElementById("childrenContainer");
    container.innerHTML = '';

    children.forEach(child => {
        const row = document.createElement('tr');
        row.className = 'child-row';
        row.innerHTML = `
            <td>
                <img src="images/avatars/${child.ID}.jpg" 
                     alt="${child.ФИО}" 
                     class="child-avatar-table"
                     onerror="this.src='images/avatars/default.png'">
            </td>
            <td>
                <div class="child-name-table">${child.ФИО}</div>
                <div class="child-id-table">ID: ${child.ID}</div>
            </td>
            <td>
                <span class="group-badge ${getGroupClass(child.Группа)}">${child.Группа}</span>
            </td>
            <td>
                ${getLessonPhoto(child.ID, lessonNumber, child.ФИО)}
            </td>
        `;
        container.appendChild(row);
    });
}

function getLessonPhoto(childId, lessonNumber, childName) {
    return `
        <div class="photo-preview-container">
            <img src="images/lessons/${lessonNumber}/${childId}.jpg" 
                 alt="${childName} на занятии ${lessonNumber}" 
                 class="lesson-photo-thumbnail"
                 onerror="this.style.display='none'">
            <div class="photo-overlay" onclick="openLessonPhotoPopup('images/lessons/${lessonNumber}/${childId}.jpg', '${childName}', ${lessonNumber})">
                🔍
            </div>
        </div>
    `;
}

function getGroupClass(group) {
    const classes = {
        'Младшая': 'group-junior',
        'Средняя': 'group-middle', 
        'Старшая': 'group-senior',
        'Подготовительная': 'group-prep'
    };
    return classes[group] || 'group-default';
}

function openLessonPopup(lesson) {
    const popup = document.getElementById("lessonPopup");
    document.getElementById("popupImage").src = `images/lessons/${lesson.Lesson}/${lesson.ID}.jpg`;
    document.getElementById("popupTitle").textContent = lesson.Topic;
    document.getElementById("popupDate").textContent = `Урок ${lesson.Lesson}`;
    
    // Показываем вопрос для родителей
    const question = lesson.Question || getDefaultQuestion(lesson.Topic);
    document.getElementById("popupDescription").textContent = question;
    
    popup.showModal();
}


function openLessonPhotoPopup(photoUrl, childName, lessonNumber) {
    const popup = document.getElementById("lessonPhotoPopup");
    document.getElementById("lessonPhotoImage").src = photoUrl;
    document.getElementById("lessonPhotoTitle").textContent = `${childName} - Занятие ${lessonNumber}`;
    popup.showModal();
}

function backToSearch() {
    document.getElementById("childData").hidden = true;
    document.getElementById("lessonData").hidden = true;
    document.getElementById("startScreen").hidden = false;
    document.getElementById("childId").value = "";
}

function closeLessonPhotoPopup() {
    document.getElementById("lessonPhotoPopup").close();
}

// Глобальные функции
window.backToSearch = backToSearch;
window.closeLessonPhotoPopup = closeLessonPhotoPopup;
window.openLessonPhotoPopup = openLessonPhotoPopup;