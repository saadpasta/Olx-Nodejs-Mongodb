const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const AddSchema = new Schema({
  title:{
    type: String,
    required: true
  },

  Category:{
    type: String,
    required: true
  },
  AdDescription:{
    type: String,
    required: true
  },
  price:{
    type: Number,
    required: true
  },

  name:{
    type: String,
    required: true
  },

  number:{
    type: Number,
    required: true
  },

  city:{
    type: String,
    required: true
  },
  user:{
    type:String,
    required:true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

mongoose.model('adds', AddSchema);