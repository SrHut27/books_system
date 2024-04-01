const express = require('express');
const hbs = require('express-handlebars');
const connection = require('./configs/database');
const bodyParser = require('body-parser');
const session = require('express-session')
const PORT = process.env.PORT || 3000;
const path = require('path');

const app = express();

// Importando rotas:
const authRoute = require('./Routes/auth');
const bookRoute = require('./Routes/books')

connection.connect((error) =>{
    if (error) {
        console.log(`Não foi possível conectar ao banco de dados: ${error}`);
    } else {
        console.log(`Conectado com o id:${connection.threadId}`)
    }
});

// Definindo os helpers diretamente aqui
const msg = [];
const book = [];

app.engine('hbs', hbs.engine({
    extname: 'hbs',
    defaultLayout: 'main',
    helpers: {
        msg: () => msg,
        book: () => book
    }
}));
app.set('view engine', 'hbs');

app.use(express.static(path.join(__dirname, 'public')));

app.use((session({
    secret: 'gsdlalskdlasdfs',
    saveUninitialized: true,
    resave:true,
    cookie: {
        maxAge: 3600000 // 1 hora em milissegundos
    }
})));

app.use(bodyParser.urlencoded({extended:true}));

app.use('/books', bookRoute);
app.use('/auth', authRoute);

// Rota inicial:
app.get('', (req, res) =>{
    return res.redirect('/books')
})

app.listen(PORT, () =>{
    console.log(`Server is running in http://localhost:${PORT}`)
})