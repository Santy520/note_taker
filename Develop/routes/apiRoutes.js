const router = require("express").Router();
const fs = require ('fs')
const uuid = require ('../helpers/uuid');
const { title } = require("process");
const { text } = require("express");

router.get('/notes', (req, res) => {
        fs.readFile('db/db.json', 'utf-8', (err, data) => {
            if(err){
                res.status(500).json(err)
            } else{
                res.status(200).json(JSON.parse(data))
            }
        });
});

router.post('/notes', (req, res) => {
    console.info(`${req.method} request to add a note`);
    console.log(req.body);

    const { title, text } = req.body;
    const id = uuid();

    if (req.body) {
        const newNote = {
            id,
            title,
            text
           
        };

        readAndAppend(newNote, './db/db.json');
        res.json('note added succesfully');
    } else {
        res.error('Error in adding note');
    }
});

module.exports = router

// const router = require("express").Router();
// const fs = require('fs');
// const path = require('path'); // Import path module for file paths
// const uuid = require('../helpers/uuid');

// Define a helper function to read and append data to a JSON file
const readAndAppend = (newData, file) => {
  fs.readFile(file, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
    } else {
      const parsedData = JSON.parse(data);
      parsedData.push(newData);

      fs.writeFile(file, JSON.stringify(parsedData, null, 2), (err) => {
        if (err) {
          console.error(err);
        }
      });
    }
  });
};

// router.get('/notes', (req, res) => {
//   fs.readFile(path.join(__dirname, '../db/db.json'), 'utf-8', (err, data) => {
//     if (err) {
//       res.status(500).json(err);
//     } else {
//       res.status(200).json(JSON.parse(data));
//     }
//   });
// });

// router.post('/notes', (req, res) => {
//   console.info(`${req.method} request to add a note`);
//   console.log(req.body);

//   const { username, topic } = req.body;

//   if (username && topic) { // Check if both username and topic are provided
//     const newNote = {
//       username,
//       topic,
//       note_id: uuid(),
//     };

//     readAndAppend(newNote, path.join(__dirname, '../db/db.json')); // Use the helper function to append the new note
//     res.status(200).json('Note added successfully');
//   } else {
//     res.status(400).send('Both username and topic are required'); // Send a 400 Bad Request response if data is missing
//   }
// });

// module.exports = router;
