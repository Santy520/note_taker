const router = require("express").Router();
const fs = require ('fs')
const uuid = require ('../helpers/uuid');

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

    const { username, topic } = req.body;

    if (req.body) {
        const newNote = {
            username,
            topic,
            note_id: uuid(),
        };

        readAndAppend(newNote, '../db/db.json');
        res.json('note added succesfully');
    } else {
        res.error('Error in adding note');
    }
});

module.exports = router