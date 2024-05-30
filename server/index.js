const express = require('express');
const path = require('path');
const db = require('./database');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware para servir arquivos estáticos da pasta 'public'
app.use(express.static(path.join(__dirname, '../client')));

// Rota para obter todos os posts
app.get('/posts', (req, res) => {
    db.all('SELECT * FROM posts', (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ posts: rows });
    });
});

// Rota para adicionar um novo post
app.post('/posts', (req, res) => {
    const { user, title, content, category } = req.body;
    db.run('INSERT INTO posts (user, title, content, category) VALUES (?, ?, ?, ?)', [user, title, content, category], function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ id: this.lastID });
    });
});

// Rota para servir o arquivo HTML principal
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/index.html'));
});

// Inicie o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
