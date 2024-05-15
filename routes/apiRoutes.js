const router = require("express").Router();
const fs = require('fs');
const uuid = require('../helpers/uuid');

// Read notes
router.get('/notes', (req, res) => {
    fs.readFile('db/db.json', 'utf-8', (err, data) => {
        if (err) {
            res.status(500).json({ error: "Internal server error" });
        } else {
            res.status(200).json(JSON.parse(data));
        }
    });
});

// Add a note
router.post('/notes', (req, res) => {
    console.info(`${req.method} request to add a note`);
    const { title, text } = req.body;
    const id = uuid();

    if (!title || !text) {
        return res.status(400).json({ error: "Title and text are required" });
    }

    const newNote = { id, title, text };
    readAndAppend(newNote, './db/db.json', (err) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: "Failed to add note" });
        }
        res.json('Note added successfully');
    });
});

// Helper function to read and append data
const readAndAppend = (newData, file, callback) => {
    fs.readFile(file, 'utf8', (err, data) => {
        if (err) {
            return callback(err);
        }
        const parsedData = JSON.parse(data);
        parsedData.push(newData);
        fs.writeFile(file, JSON.stringify(parsedData, null, 2), (err) => {
            if (err) {
                return callback(err);
            }
            callback(null);
        });
    });
};

// Delete a note
router.delete('/notes/:id', (req, res) => {
  console.info(`${req.method} request to delete a note`);
  const noteId = req.params.id;

  fs.readFile('db/db.json', 'utf8', (err, data) => {
      if (err) {
          return res.status(500).json({ error: "Internal server error" });
      }

      let notes = JSON.parse(data);
      const updatedNotes = notes.filter(note => note.id !== noteId);

      if (notes.length === updatedNotes.length) {
          return res.status(404).json({ error: "Note not found" });
      }

      fs.writeFile('db/db.json', JSON.stringify(updatedNotes, null, 2), (err) => {
          if (err) {
              console.error(err);
              return res.status(500).json({ error: "Failed to delete note" });
          }
          res.json('Note deleted successfully');
      });
  });
});
module.exports = router;
