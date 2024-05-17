// Import the Express router, the fs module for file operations, and a helper function for generating unique IDs
const router = require("express").Router();
const fs = require('fs');
const uuid = require('../helpers/uuid');

// Route to read all notes from the database
router.get('/notes', (req, res) => {
    fs.readFile('db/db.json', 'utf-8', (err, data) => {
        if (err) {
            // Respond with a 500 status code if there's an error reading the file
            res.status(500).json({ error: "Internal server error" });
        } else {
            // Respond with a 200 status code and the parsed data if successful
            res.status(200).json(JSON.parse(data));
        }
    });
});

// Route to add a new note to the database
router.post('/notes', (req, res) => {
    console.info(`${req.method} request to add a note`);
    const { title, text } = req.body;
    const id = uuid();  // Generate a unique ID for the new note

    // Validate the request body
    if (!title || !text) {
        return res.status(400).json({ error: "Title and text are required" });
    }

    const newNote = { id, title, text };  // Create a new note object
    readAndAppend(newNote, './db/db.json', (err) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: "Failed to add note" });
        }
        // Respond with a success message if the note is added successfully
        res.json('Note added successfully');
    });
});

// Helper function to read the current data from the file and append new data to it
const readAndAppend = (newData, file, callback) => {
    fs.readFile(file, 'utf8', (err, data) => {
        if (err) {
            return callback(err);  // Invoke the callback with an error if reading the file fails
        }
        const parsedData = JSON.parse(data);  // Parse the existing data
        parsedData.push(newData);  // Add the new data to the existing data
        fs.writeFile(file, JSON.stringify(parsedData, null, 2), (err) => {
            if (err) {
                return callback(err);  // Invoke the callback with an error if writing to the file fails
            }
            callback(null);  // Invoke the callback with no error if the operation is successful
        });
    });
};

// Route to delete a note by its ID
router.delete('/notes/:id', (req, res) => {
    console.info(`${req.method} request to delete a note`);
    const noteId = req.params.id;  // Get the note ID from the request parameters

    fs.readFile('db/db.json', 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: "Internal server error" });
        }

        let notes = JSON.parse(data);  // Parse the existing notes
        const updatedNotes = notes.filter(note => note.id !== noteId);  // Filter out the note to be deleted

        if (notes.length === updatedNotes.length) {
            // Respond with a 404 status code if the note was not found
            return res.status(404).json({ error: "Note not found" });
        }

        fs.writeFile('db/db.json', JSON.stringify(updatedNotes, null, 2), (err) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: "Failed to delete note" });
            }
            // Respond with a success message if the note is deleted successfully
            res.json('Note deleted successfully');
        });
    });
});

// Export the router to be used in other parts of the application
module.exports = router;

