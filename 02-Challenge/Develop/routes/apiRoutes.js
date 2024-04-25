const router = require("express").Router();
const fs = require ('fs')

router.get('/notes', (req, res) => {
        fs.readFile('db/db.json', 'utf-8', (err, data) => {
            if(err){
                res.status(500).json(err)
            } else{
                res.status(200).json(JSON.parse(data))
            }
        });
});

router.post

module.exports = router