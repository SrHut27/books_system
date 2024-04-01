const express = require('express');
const router = express.Router();
const connection = require('../configs/database');
const excel = require('exceljs');
const isValidDate = require('./functions/books_functions');
const multer = require('multer');
const path = require('path');
const { format } = require('date-fns') // Esse módulo converte a hora para a que você deseja na parte do servidor

connection.connect((error) => {
    if (error) {
        console.log(`Não foi possível conectar ao banco de dados`, error);
    };
});

const upload = multer({ dest: 'public/uploads'});

const requireAuth = (req, res, next)=>{
    if(req.session.user){
        next()
    } else {
        return res.redirect('/auth/login')
    }
};

router.get('/', requireAuth, (req, res) =>{
    req.session.currentURL = [];
    req.session.currentURL = '/books';
    console.log(req.session.currentBook);

    const query = 'SELECT * FROM books ORDER BY id DESC'
    connection.query(query, (error, results) =>{
        if (error) {
            console.log('Houve um erro ao conectar com o banco de dados', error);
        }

        //results.forEach((book) =>{
          //  book.anopublicado = format(new Date(book.anopublicado), 'yyyy'); // função para formatar hora da forma que deseja
        //})
        
    res.render('books_templates/index.hbs', { user: req.session.user, msgs: req.session.msg, results });
    })
});

router.get('/cadastrar', requireAuth, (req, res)=>{
    res.render('books_templates/cadastrar', {msgs: req.session.msg})
});

router.post('/cadastrar', requireAuth, async(req, res)=>{
    req.session.msg = [];
    const {titulo, autores, editora, anopublicado, genero, sinopse, estoque, preco} = req.body;

    if(!titulo || !autores || !editora || !anopublicado || !genero) {
        console.log(`Livro não adcionado por falta de informações necessárias...`);
        req.session.msg.push('Para inserir um livro no sistema, você deve foornecer PELO MENOS oo título, autores, editora, ano de publicação e o gênero desse livro.');
        return res.redirect('/books/cadastrar')
    };

    if (!isValidDate(anopublicado)) {
        req.session.msg.push('A data de publicação fornecida não é válida. Certifique-se de fornecer uma data dentro de um intervalo razoável.');
        return res.redirect('/books/cadastrar');
    }

    connection.query('SELECT * FROM books where titulo = ?', [titulo], async (error, results)=>{
        if (error) {
            console.log('Não foi possísvel adicionar o livro no banco de dados:', error);
            req.session.msg.push('No momento não foi possível adcionar o livro ao banco de dados, tente novamente mais tarde...');
            return res.redirect('/cadastrar')
        };
        if (results.length>0) {
            req.session.msg.push('Esse livro já existe no banco de dados e não pode ser cadastrado. Se deseja alterar o preço oou estoque, edite o item da lista...');
            return res.redirect('/books/cadastrar')
        }

    try {
    const sql = 'INSERT INTO books (titulo, autores, editora, anopublicado, genero, sinopse, estoque, preco) VALUES (?,?,?,?,?,?,?,?)';
    const values = [titulo, autores, editora, anopublicado, genero, sinopse, estoque, preco];
    connection.query(sql, values, async (error, results) =>{
        if (error) {
            console.log('Não foi possísvel adicionar o livro no banco de dados:', error);
            req.session.msg.push('No momento não foi possível adcionar o livro ao banco de dados, tente novamente mais tarde...');
            return res.redirect('/cadastrar')
        };
        req.session.msg = [];
        const addedBookTitle = req.body.titulo;
        req.session.msg.push(`O livro ${addedBookTitle} foi adcionado ao banco de dados!`);
        return res.redirect('/books')
    })} catch (error) {

    }});
});

router.get('/editar/:id', requireAuth, (req, res) =>{
    console.log(req.session.currentURL);
    const {id} = req.params;

    connection.query('SELECT * FROM books WHERE id = ?', [id], (error, results) =>{
        if (error) {
            console.log('Não foi possível editar o livro', error);
            req.session.msg.push('Não foi possível editar o livro no momento, tente novamente mais tarde...');
            return res.redirect('/books');
        };
        const rota = req.session.currentURL;
        return res.render('books_templates/editar', {msgs: req.session.msg, books:results});
    });
});

router.post('/editar/:id', requireAuth, (req, res) => {
    const { id } = req.params;
    const { titulo, autores, editora, anopublicado, genero, sinopse, estoque, preco } = req.body;

    connection.query('SELECT * FROM books WHERE id = ?', [id], async (error, results) => {
        if (error) {
            console.log('Não foi possível editar o livro', error);
            req.session.msg.push('Não foi possível editar o livro no momento, tente novamente mais tarde...');
            return res.redirect('/books');
        }

        if (results.length === 0) {
            req.session.msg.push('Livro não encontrado');
            return res.redirect('/books');
        }

        const currentBook = results[0];

        const newBook = {
            titulo: titulo || currentBook.titulo,
            autores: autores || currentBook.autores,
            editora: editora || currentBook.editora,
            anopublicado: anopublicado || currentBook.anopublicado,
            genero: genero || currentBook.genero,
            sinopse: sinopse || currentBook.sinopse,
            estoque: estoque || currentBook.estoque,
            preco: preco || currentBook.preco
        };

        const sql = 'UPDATE books SET titulo = ?, autores = ?, editora = ?, anopublicado = ?, genero = ?, sinopse = ?, estoque = ?, preco = ? WHERE id = ?';
        const values = [newBook.titulo, newBook.autores, newBook.editora, newBook.anopublicado, newBook.genero, newBook.sinopse, newBook.estoque, newBook.preco, id];
        connection.query(sql, values, async (error, results) => {
            if (error) {
                console.log('Não foi possível atualizar o livro no banco de dados:', error);
                req.session.msg.push('No momento não foi possível atualizar o livro, tente novamente mais tarde...');
                return res.redirect(req.session.currentURL);
            }

            req.session.msg = [];
            req.session.msg.push(`O livro ${currentBook.titulo} foi atualizado com sucesso!`);
            return res.redirect(req.session.currentURL);
        });
    });
});

router.get('/adicionarvarios', requireAuth, (req, res) => {
    res.render('books_templates/adcionarvarios', {msgs: req.session.msg})
});

router.post('/adcionarvarios', upload.single('excelFile'), requireAuth, async (req, res) =>{
    try {
        const workbook = new excel.Workbook();
        await workbook.xlsx.readFile(req.file.path);
        const worksheet = workbook.getWorksheet(1);

        const rows = [];
        worksheet.eachRow((row, rowNumber) => {
            if (rowNumber !== 1) {
                const rowData = {
                    titulo: row.getCell(1).value,
                    autores: row.getCell(2).value,
                    editora: row.getCell(3).value,
                    anopublicado: row.getCell(4).value,
                    genero: row.getCell(5).value,
                    sinopse: row.getCell(6).value,
                    estoque: row.getCell(7).value,
                    preco: row.getCell(8).value
                };
                rows.push(rowData);
            };
        });
        
        req.session.msg = [];
        const existingBooks = []; 

        for (const row of rows) {
            connection.query('SELECT * FROM books WHERE titulo = ?', [row.titulo], (error, results) => {
                if (error) {
                    console.log('Não foi possível conectar ao banco de dados:', error);
                    req.session.msg.push('No momento não foi possível conectar ao banco de dados, tente novamente mais tarde.');
                    return res.redirect('/books');
                }

                if(results.length > 0) {
                    existingBooks.push(row.titulo); 
                } else {
                    const sql = 'INSERT INTO books (titulo, autores, editora, anopublicado, genero, sinopse, estoque, preco) VALUES (?,?,?,?,?,?,?,?)';
                    const values = [row.titulo, row.autores, row.editora, row.anopublicado, row.genero, row.sinopse, row.estoque, row.preco];
                    connection.query(sql, values, (error, results) => {
                        if (error) {
                            console.log('Não foi possível conectar ao banco de dados:', error);
                            req.session.msg.push('No momento não foi possível conectar ao banco de dados, tente novamente mais tarde.');
                        }
                    });
                }
            });
        }

        if (existingBooks.length > 0) {
            req.session.msg.push(`Os seguintes livros já existem no banco de dados: ${existingBooks.join(', ')}`);
        }

        return res.redirect('/books');

    } catch (error) {
        console.error('Erro durante o upload e inserção no banco de dados:', error);
        res.status(500).send('Erro durante o upload e inserção no banco de dados.');
    }
});

router.get('/listar', requireAuth, (req, res) =>{
    req.session.currentURL = [];
    req.session.currentURL = "/books/listar";
    console.log(req.session.currentURL);
    connection.query('SELECT * FROM books', (error, results) =>{
        if (error) {
            console.log('Não foi possível conectar ao banco de dados');
            req.session.msg.push('No momento, essa função está indisponível. tente novamente mais tarde...');
            return res.redirect('/books');
        }

        return res.render('books_templates/listar', {msgs: req.session.msg, books: results});
    })
});

router.get('/listar/pesquisar', requireAuth, (req, res) => {
    const {nomeDolivro} = req.query;

    connection.query('SELECT * FROM books WHERE titulo LIKE ?', [`%${nomeDolivro}%`], (error, results) => {
        if (error) {
            console.log('Não foi possível conectar ao banco de dados');
            req.session.msg.push('No momento, essa função está indisponível. tente novamente mais tarde...');
            return res.redirect('/books');
        };
        
        res.render('books_templates/listar', {books: results})
    })
})


router.get('/apagar/:id', (req, res) =>{
    const { id } = req.params;
    console.log(req.session.currentURL)

    connection.query('SELECT * FROM books WHERE id = ?', [id], (error, results) =>{
        if (error) {
            console.log('Não foi possível apagar o livro no banco de dados', error);
            req.session.msg = [];
            req.session.msg.push('Não foi possível apagar o livro no banco de dados');
            return res.redirect('/books')
        };
        const rota = req.session.currentURL;
        console.log(rota, "1");
        return res.render('books_templates/apagar', {msgs: req.session.msg, books: results})
    })
})

router.post('/apagar/:id', requireAuth, (req, res)=>{
    req.session.msg = [];
    const {id} = req.params;

    connection.query('DELETE FROM books WHERE id = ?', [id], (error, results) =>{
        if (error) {
            console.log('Não foi possísvel apagar o livro no banco de dados:', error);
            req.session.msg.push('No momento não foi possível apagar o livro ao banco de dados, tente novamente mais tarde...');
            return res.redirect('/books')
        };

        req.session.msg.push('Livro apagado com sucessso!');
        return res.redirect(req.session.currentURL);
    })
})


module.exports = router;