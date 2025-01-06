document.querySelectorAll('.date').forEach(date => {
    date.addEventListener('click', () => {
        alert(`Treino selecionado: ${date.textContent.trim()}`);
    });
});
