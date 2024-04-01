function isValidDate(dateString) {
    // Converter a string da data para um objeto Date
    const date = new Date(dateString);

    // Verificar se a conversão foi bem-sucedida e se a data está dentro do intervalo permitido
    if (!isNaN(date.getTime())) {
        // Obter o ano atual
        const currentYear = new Date().getFullYear();

        // Definir o intervalo permitido (600 anos no passado e o ano atual no futuro)
        const minYear = currentYear - 600;
        const maxYear = currentYear;

        // Obter o ano da data fornecida
        const year = date.getFullYear();

        // Verificar se o ano está dentro do intervalo permitido
        if (year >= minYear && year <= maxYear) {
            return true; // A data é válida
        }
    }

    return false; // A data não é válida
}

module.exports = isValidDate;