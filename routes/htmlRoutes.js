// Import the Express router and the path module
const router = require("express").Router();
const path = require('path');

// Define a route handler for GET requests to the '/notes' endpoint
router.get('/notes', (req, res) => (
    // Send the notes.html file as a response
    res.sendFile(path.join(__dirname, '../public/notes.html'))
));

// Define a wildcard route handler for all other GET requests
router.get('*', (req, res) => (
    // Send the index.html file as a response for any unspecified routes
    res.sendFile(path.join(__dirname, '../public/index.html'))
));

// Export the router to be used in other parts of the application
module.exports = router;