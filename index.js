const express = require('express');
const mysql = require('mysql2');
const PORT = 3000;

const app = express();

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'sucomp_system'
});

connection.connect((error) =>{
    if (error) {
        console.log('Não foi possível conectar ao servidor:', error);
    } else {
        console.log('Conectado com o id:', connection.threadId);
    }
});

app.get('/', (req, res) =>{
    res.send('Suco Maria peregrina Sistema...')
})


app.listen(PORT, () =>{
    console.log('Rodando em http://localhost:'+PORT)
})