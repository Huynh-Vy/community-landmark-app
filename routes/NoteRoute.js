const router = require("express").Router();
const Note = require("../models/Note");

// Create a note
router.post("/", async (req, res) => {
    const newNote = new Note(req.body);
    try {
        const savedNote = await newNote.save();
        return res.status(200).json(savedNote)
    } catch (error) {
        return res.status(500).json(error);
    }
})

// Get all notes
router.get("/", async (req, res) => {
    try {
        const notes = await Note.find();
        res.status(200).json(notes)
    } catch (error) {
        return res.status(500).json(error); 
    }
})


module.exports = router;


