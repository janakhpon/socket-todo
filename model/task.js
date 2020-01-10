const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//create electron-todo-task schema
const taskSchema = new Schema({

    text: {
        type: String,
        required:true
    },
    date: {
        type: Date,
        default : Date.now
    }
})

module.exports = task = mongoose.model('task', taskSchema);
