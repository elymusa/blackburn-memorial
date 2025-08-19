const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Person = require('../models/Person');

// @route   GET api/people
// @desc    Get all people
// @access  Public
router.get('/', async (req, res) => {
  try {
    const people = await Person.find({}).sort({ name: 1 }); // Sort alphabetically
    res.json(people);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/people
// @desc    Add a new person
// @access  Private
router.post('/', auth, async (req, res) => {
  const { name, biography } = req.body;
  try {
    const newPerson = new Person({
      name,
      biography,
      // We will handle image uploads in a future step
    });
    const person = await newPerson.save();
    res.json(person);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/people/:id
// @desc    Update a person
// @access  Private
router.put('/:id', auth, async (req, res) => {
  const { name, biography } = req.body;
  const personFields = { name, biography };

  try {
    let person = await Person.findById(req.params.id);
    if (!person) return res.status(404).json({ msg: 'Person not found' });

    person = await Person.findByIdAndUpdate(
      req.params.id,
      { $set: personFields },
      { new: true }
    );
    res.json(person);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/people/:id
// @desc    Delete a person
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    await Person.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Person removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;