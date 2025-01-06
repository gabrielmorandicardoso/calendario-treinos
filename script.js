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

    let selectedDay = null;
    let selectedDays = [];
    let currentMonth = new Date().getMonth();
    let currentYear = new Date().getFullYear();

    function renderCalendar() {
        const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
        const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();

        daysContainer.innerHTML = '';
        monthName.textContent = new Date(currentYear, currentMonth).toLocaleString('default', { month: 'long', year: 'numeric' });

        // Add empty days before the first day of the month
        for (let i = 0; i < firstDayOfMonth; i++) {
            let emptyDay = document.createElement('div');
            emptyDay.classList.add('day');
            daysContainer.appendChild(emptyDay);
        }

        // Add the days of the month
        for (let day = 1; day <= daysInMonth; day++) {
            let dayElement = document.createElement('div');
            dayElement.classList.add('day');
            dayElement.textContent = day;
            dayElement.dataset.day = day;

            // Verificar se existe conteúdo salvo para o dia
            const savedContent = localStorage.getItem(`day-${day}`);
            if (savedContent) {
                const contentDiv = document.createElement('div');
                contentDiv.classList.add('day-content');
                contentDiv.textContent = savedContent;
                dayElement.appendChild(contentDiv);
            }

            // Mark the current day (only if it's the current month and year)
            if (day === new Date().getDate() && currentMonth === new Date().getMonth() && currentYear === new Date().getFullYear()) {
                dayElement.classList.add('current-day');
            }

            // Add event listener to open modal
            dayElement.addEventListener('click', function() {
                selectedDay = dayElement.dataset.day;
                openModal(dayElement);
            });

            // Add hover listener for tooltip
            dayElement.addEventListener('mouseenter', function() {
                const existingContent = dayElement.querySelector('.day-content');
                if (existingContent) {
                    existingContent.style.display = 'block';  // Show the content when hovering
                }
            });

            dayElement.addEventListener('mouseleave', function() {
                const existingContent = dayElement.querySelector('.day-content');
                if (existingContent) {
                    existingContent.style.display = 'none';  // Hide the content when mouse leaves
                }
            });

            daysContainer.appendChild(dayElement);
        }
    }

    function openModal(dayElement) {
        modal.style.display = "flex";

        // Reset the modal content each time it's opened
        resetModalContent();

        const existingContent = dayElement.querySelector('.day-content');
        if (existingContent) {
            trainingText.value = existingContent.textContent;
        }
    }

    function closeModalHandler() {
        modal.style.display = "none";
    }

    function resetModalContent() {
        trainingText.value = ''; // Clear the content in the modal input
        selectedDays = []; // Clear the selected days array
        daysList.innerHTML = ''; // Clear the selectable days list
        selectDaysContainer.style.display = "none"; // Hide the select days container
    }

    closeModal.addEventListener("click", closeModalHandler);

    // Save single day
    saveBtn.addEventListener("click", function() {
        const selectedDayElement = document.querySelector(`.day[data-day="${selectedDay}"]`);
        const newContent = trainingText.value;

        // Salvar no LocalStorage
        localStorage.setItem(`day-${selectedDay}`, newContent); // Salva o conteúdo do dia selecionado

        const existingContent = selectedDayElement.querySelector('.day-content');

        if (existingContent) {
            existingContent.textContent = newContent;
        } else {
            const contentDiv = document.createElement('div');
            contentDiv.classList.add('day-content');
            contentDiv.textContent = newContent;
            selectedDayElement.appendChild(contentDiv);
        }

        closeModalHandler();
    });

    // Save for selected days
    saveSelectedBtn.addEventListener("click", function() {
        selectedDays.forEach(day => {
            const dayElement = document.querySelector(`.day[data-day="${day}"]`);
            const newContent = trainingText.value;

            // Salvar no LocalStorage
            localStorage.setItem(`day-${day}`, newContent);

            let existingContent = dayElement.querySelector('.day-content');
            if (existingContent) {
                existingContent.textContent = newContent;
            } else {
                const contentDiv = document.createElement('div');
                contentDiv.classList.add('day-content');
                contentDiv.textContent = newContent;
                dayElement.appendChild(contentDiv);
            }
        });

        closeModalHandler();
    });

    // Excluir treino
    deleteBtn.addEventListener("click", function() {
        const selectedDayElement = document.querySelector(`.day[data-day="${selectedDay}"]`);
        const content = selectedDayElement.querySelector('.day-content');
        if (content) {
            content.remove();
        }

        // Remover conteúdo do LocalStorage
        localStorage.removeItem(`day-${selectedDay}`);

        closeModalHandler();
    });

    // Seleção de dias
    selectDaysBtn.addEventListener("click", function() {
        selectDaysContainer.style.display = "block";
        renderSelectableDays();
    });

    function renderSelectableDays() {
        daysList.innerHTML = ''; // Limpa a lista de dias a cada vez que abrir
        const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
        for (let day = 1; day <= daysInMonth; day++) {
            const dayOption = document.createElement('div');
            dayOption.textContent = day;
            dayOption.dataset.day = day;

            // Adiciona evento de clique para selecionar ou desmarcar o dia
            dayOption.addEventListener('click', function() {
                if (selectedDays.includes(day)) {
                    selectedDays = selectedDays.filter(d => d !== day);
                    dayOption.style.backgroundColor = ''; // Remove a seleção
                } else {
                    selectedDays.push(day);
                    dayOption.style.backgroundColor = '#007bff'; // Marca o dia como selecionado
                }
            });

            daysList.appendChild(dayOption);
        }
    }

    renderCalendar();
});
