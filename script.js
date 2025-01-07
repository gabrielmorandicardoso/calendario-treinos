document.addEventListener("DOMContentLoaded", function() {
    const daysContainer = document.getElementById("days-container");
    const monthName = document.getElementById("month-name");
    const modal = document.getElementById("modal");
    const closeModal = document.querySelector(".close");
    const saveBtn = document.getElementById("save-btn");
    const saveSelectedBtn = document.getElementById("save-selected-btn");
    const trainingText = document.getElementById("training-text");
    const deleteBtn = document.querySelector(".delete-btn");
    const selectDaysBtn = document.getElementById("select-days-btn");
    const selectDaysContainer = document.getElementById("select-days-container");
    const daysList = document.getElementById("days-list");
    const prevMonthBtn = document.getElementById("prev-month");
    const nextMonthBtn = document.getElementById("next-month");
    const todayBtn = document.getElementById("today-btn");

    let selectedDay = null;
    let selectedDays = [];
    let currentMonth = new Date().getMonth();
    let currentYear = new Date().getFullYear();

    function renderCalendar() {
        const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
        const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();

        daysContainer.innerHTML = '';
        monthName.textContent = new Date(currentYear, currentMonth).toLocaleString('default', { month: 'long', year: 'numeric' });

        for (let i = 0; i < firstDayOfMonth; i++) {
            let emptyDay = document.createElement('div');
            emptyDay.classList.add('day');
            daysContainer.appendChild(emptyDay);
        }

        for (let day = 1; day <= daysInMonth; day++) {
            let dayElement = document.createElement('div');
            dayElement.classList.add('day');
            dayElement.textContent = day;
            dayElement.dataset.day = day;

            const key = `day-${currentYear}-${currentMonth}-${day}`;
            const savedContent = localStorage.getItem(key);
            if (savedContent) {
                const contentDiv = document.createElement('div');
                contentDiv.classList.add('day-content');
                contentDiv.innerHTML = `<i class="fa fa-dumbbell"></i>${savedContent}`;
                dayElement.appendChild(contentDiv);
            }

            if (day === new Date().getDate() && currentMonth === new Date().getMonth() && currentYear === new Date().getFullYear()) {
                dayElement.classList.add('current-day');
            }

            // Marca os dias selecionados visualmente
            if (selectedDays.includes(day)) {
                dayElement.classList.add('selected');
            }

            dayElement.addEventListener('click', function() {
                selectedDay = dayElement.dataset.day;
                openModal(dayElement);
            });

            dayElement.addEventListener('mouseenter', function() {
                const existingContent = dayElement.querySelector('.day-content');
                if (existingContent) {
                    existingContent.style.display = 'block';
                }
            });

            dayElement.addEventListener('mouseleave', function() {
                const existingContent = dayElement.querySelector('.day-content');
                if (existingContent) {
                    existingContent.style.display = 'none';
                }
            });

            daysContainer.appendChild(dayElement);
        }
    }

    function openModal(dayElement) {
        modal.style.display = "flex";
        const key = `day-${currentYear}-${currentMonth}-${selectedDay}`;
        trainingText.value = localStorage.getItem(key) || '';
        selectDaysContainer.style.display = "none";
        daysList.innerHTML = '';
        saveBtn.style.display = 'block';
        saveSelectedBtn.style.display = 'none';
        deleteBtn.style.display = 'block';
    }

    closeModal.addEventListener("click", function() {
        modal.style.display = "none";
    });

    saveBtn.addEventListener('click', function() {
        const key = `day-${currentYear}-${currentMonth}-${selectedDay}`;
        localStorage.setItem(key, trainingText.value);
        modal.style.display = "none";
        renderCalendar();
    });

    deleteBtn.addEventListener('click', function() {
        const key = `day-${currentYear}-${currentMonth}-${selectedDay}`;
        localStorage.removeItem(key);
        modal.style.display = "none";
        renderCalendar();
    });

    selectDaysBtn.addEventListener('click', function() {
        selectDaysContainer.style.display = 'block';
        saveBtn.style.display = 'none';
        saveSelectedBtn.style.display = 'block';

        daysList.innerHTML = '';
        for (let day = 1; day <= 31; day++) {
            let dayDiv = document.createElement('div');
            dayDiv.textContent = day;
            dayDiv.dataset.day = day;

            // Marca os dias selecionados visualmente no modal
            if (selectedDays.includes(day)) {
                dayDiv.classList.add('selected');
            }

            dayDiv.addEventListener('click', function() {
                dayDiv.classList.toggle('selected');
                const day = parseInt(dayDiv.dataset.day);
                const index = selectedDays.indexOf(day);
                if (index === -1) {
                    selectedDays.push(day);
                } else {
                    selectedDays.splice(index, 1);
                }
            });

            daysList.appendChild(dayDiv);
        }
    });

    saveSelectedBtn.addEventListener('click', function() {
        selectedDays.forEach(day => {
            const key = `day-${currentYear}-${currentMonth}-${day}`;
            localStorage.setItem(key, trainingText.value);
        });
        modal.style.display = "none";
        renderCalendar();
    });

    prevMonthBtn.addEventListener('click', function() {
        currentMonth--;
        if (currentMonth < 0) {
            currentMonth = 11;
            currentYear--;
        }
        renderCalendar();
    });

    nextMonthBtn.addEventListener('click', function() {
        currentMonth++;
        if (currentMonth > 11) {
            currentMonth = 0;
            currentYear++;
        }
        renderCalendar();
    });

    todayBtn.addEventListener('click', function() {
        currentMonth = new Date().getMonth();
        currentYear = new Date().getFullYear();
        renderCalendar();
    });

    renderCalendar();
});
