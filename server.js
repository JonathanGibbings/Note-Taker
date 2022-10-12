const express = require('express');
const fs = require('fs');
const path = require('path');
const { notes } = require('./db/db.json');

const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/notes.html'));
});

app.get('/api/notes', (req, res) => {
    let results = notes;
    res.json(results);
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.post('/api/notes', (req, res) => {
    req.body.id = notes.length.toString();
    const note = req.body;
    notes.push(note);
    fs.writeFileSync(path.join(__dirname, './db/db.json'),
        JSON.stringify({ notes: notes }, null, 2));
    res.json(note);
});

app.delete('/api/notes/:id', (req, res) => {
    let id = req.params.id;
    notes.splice(id, 1);
    notes.forEach(note => {note.id = JSON.stringify(notes.indexOf(note))});
    res.json(notes);
});

app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`);
});