const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

// task model
const task = require("../../model/task");

// Validation
const validatetaskInput = require("../../validation/task");

// @route   GET api/tasks
// @desc    Get tasks
// @access  Public
router.get("/", (req, res) => {
  task
    .find()
    .sort({ date: -1 })
    .then(tasks => res.json(tasks))
    .catch(err => res.status(404).json({ notasksfound: "No tasks found" }));
});

// @route   GET api/tasks/:id
// @desc    Get task by id
// @access  Public
router.get("/ID/:id", (req, res) => {
  task
    .findById(req.params.id)
    .then(task => res.json(task))
    .catch(err =>
      res.status(404).json({ notaskfound: "No task found with that ID" })
    );
});



// @route   GET api/tasks/:id
// @desc    Get task by id
// @access  Public
router.get("/text/:text", (req, res) => {  
  task
    .find({text: { $regex: '.*' + req.params.text + '.*' } }).limit(5)
    .then(task => res.json(task))
    .catch(err =>
      res.status(404).json({ notaskfound: "No task match with that word" })
    );
});





// @route   task api/tasks
// @desc    Create task
// @access  Private
router.post("/", (req, res) => {
  const { errors, isValid } = validatetaskInput(req.body);
  // Check Validation
  if (!isValid) {
    // If any errors, send 400 with errors object
    return res.status(400).json(errors);
  }
  const newtask = new task({
    text: req.body.text
  });
  newtask.save().then(task => res.json(task));
});



// @route   task api/tasks
// @desc    Create task
// @access  Private

router.put("/ID/:id", (req, res) => {
  const { errors, isValid } = validatetaskInput(req.body);
  if (!isValid) {
    return res.status(400).json(errors);
  }

  task
    .findOneAndUpdate({ _id: req.params.id }, req.body, {
      upsert: true,
      new: true
    })
    .then(() => {
      res.json({ success: true });
    })
    .catch(err => {
      res.status(404).json({ error: `${err},failed to update!` });
    });
});


// @route   DELETE api/tasks/:id
// @desc    Delete task
router.delete("/ID/:id", (req, res) => {
  task
    .findById(req.params.id)
    .then(task => {
      // Delete
      task.remove().then(() => res.json({ success: true }));
    })
    .catch(err => res.status(404).json({ tasknotfound: "No task found" }));
});

module.exports = router;
