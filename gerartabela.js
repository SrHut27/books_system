const excel = require('exceljs');

// Cria um novo workbook
const workbook = new excel.Workbook();

// Adiciona uma nova worksheet ao workbook
const worksheet = workbook.addWorksheet('Livros');

// Define os cabeçalhos da tabela
const headers = [
    'Título',
    'Autores',
    'Editora',
    'Ano de Publicação',
    'Gênero',
    'Sinopse',
    'Quantidade Disponível',
    'Preço'
];

// Define os dados dos livros
const data = [
    ["Harry Potter e a Pedra Filosofal", "J.K. Rowling", "Rocco", 1997, "Fantasia", "Harry Potter é um menino que, em seu aniversário de 11 anos, descobre que é um bruxo", 50, 39.90],
    ["Orgulho e Preconceito", "Jane Austen", "Martin Claret", 1813, "Romance", "Clássico da literatura inglesa que narra o romance entre Elizabeth Bennet e Mr. Darcy", 30, 29.90],
    ["O Senhor dos Anéis", "J.R.R. Tolkien", "Martins Fontes", 1954, "Fantasia", "A saga épica que acompanha Frodo Baggins na missão de destruir o Um Anel", 40, 45.50],
    ["A Culpa é das Estrelas", "John Green", "Intrínseca", 2012, "Romance", "Uma emocionante história de amor entre dois adolescentes com câncer", 25, 34.99],
    ["Cem Anos de Solidão", "Gabriel García Márquez", "Record", 1967, "Realismo Mágico", "A história da família Buendía, que vive em Macondo, uma cidade fictícia na América Latina", 20, 28.75],
    ["A Menina que Roubava Livros", "Markus Zusak", "Intrínseca", 2005, "Drama", "Narrado pela Morte, o livro conta a história de Liesel Meminger durante a Segunda Guerra Mundial", 35, 32.00],
    ["A Guerra dos Tronos", "George R.R. Martin", "Leya", 1996, "Fantasia", "O primeiro livro da série 'As Crônicas de Gelo e Fogo', repleto de intriga e traição", 60, 38.25],
    ["O Pequeno Príncipe", "Antoine de Saint-Exupéry", "Agir", 1943, "Fábula", "Um clássico da literatura mundial, que narra a história de um príncipe viajante", 45, 22.99],
    ["1984", "George Orwell", "Companhia das Letras", 1949, "Ficção Distópica", "Uma visão sombria do futuro, onde o governo controla todos os aspectos da vida", 28, 26.50],
    ["O Hobbit", "J.R.R. Tolkien", "Martins Fontes", 1937, "Fantasia", "A história de Bilbo Bolseiro e sua jornada para recuperar o tesouro dos anões", 33, 30.75],
    ["O Poder do Hábito", "Charles Duhigg", "Objetiva", 2012, "Autoajuda", "Um livro sobre como os hábitos funcionam e como podemos mudá-los para melhorar nossas vidas", 15, 31.20],
    ["As Crônicas de Nárnia", "C.S. Lewis", "Martins Fontes", 1950, "Fantasia", "Uma série de sete livros que acompanha crianças em aventuras mágicas em Nárnia", 22, 27.80],
    ["A Revolução dos Bichos", "George Orwell", "Companhia das Letras", 1945, "Fábula", "Uma alegoria política que retrata animais de uma fazenda que se rebelam contra seus donos", 18, 24.99],
    ["O Código Da Vinci", "Dan Brown", "Arqueiro", 2003, "Suspense", "Uma trama cheia de mistérios envolvendo códigos secretos e conspirações", 40, 36.75],
    ["A Sangue Frio", "Truman Capote", "Companhia das Letras", 1966, "Não Ficção", "Um livro-reportagem que narra os assassinatos de uma família no Kansas, em 1959", 20, 29.50],
    ["Moby Dick", "Herman Melville", "Zahar", 1851, "Aventura", "Uma história sobre a busca obsessiva de vingança de Capitão Ahab contra a baleia branca", 25, 33.25],
    ["O Alquimista", "Paulo Coelho", "Sextante", 1988, "Espiritualidade", "Um livro sobre seguir seus sonhos e encontrar o verdadeiro significado da vida", 30, 23.99]
];

// Adiciona os cabeçalhos à worksheet
worksheet.addRow(headers);

// Adiciona os dados à worksheet
data.forEach((row) => {
    worksheet.addRow(row);
});

// Salva o workbook em um arquivo Excel
workbook.xlsx.writeFile('livros.xlsx')
    .then(() => {
        console.log('Tabela de livros gerada com sucesso!');
    })
    .catch((error) => {
        console.error('Erro ao gerar a tabela de livros:', error);
    });
