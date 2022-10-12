const express = require('express');
const fs = require('fs');
const path = require('path');
const { notes } = require('./db/db.json');

const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// gets home page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
});

// gets notes page
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/notes.html'));
});

// gets notes from db.json to populate notes page
app.get('/api/notes', (req, res) => {
    let results = notes;
    res.json(results);
});

// wildcard get returns to home page
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
});

// saves note to db.json
app.post('/api/notes', (req, res) => {
    // sets id of new note to length of notes making id match index
    req.body.id = notes.length.toString();
    const note = req.body;
    // adds note to array
    notes.push(note);
    // saves array to db.json
    fs.writeFileSync(path.join(__dirname, './db/db.json'),
        JSON.stringify({ notes: notes }, null, 2));
    res.json(note);
});

// deletes note from db.json
app.delete('/api/notes/:id', (req, res) => {
    let id = req.params.id;
    // removes note with index of id from db.json
    notes.splice(id, 1);
    // resets id for each note to match its index
    notes.forEach(note => {note.id = JSON.stringify(notes.indexOf(note))});
    res.json(notes);
});

app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`);
});