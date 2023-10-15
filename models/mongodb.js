
const mongoose = require('mongoose');
const mongodb = require('mongodb')
const Schema = mongoose.Schema;

// db.js

// Define the schema for School
const schoolSchema = new mongoose.Schema({
  school_name: String,
  address: String,
  contact_details: String,
  email: String,
  password: String,
});

// Define the schema for Student
const studentSchema = new mongoose.Schema({
  school_name: String,
  student_name: String,
  student_rollnbr: String,
  student_age: Number,
  student_gender: String,
  password: String,

  phq9:[ {
    date: Date,
    score: String,
  }],
  phq15: [{
    date: Date,
    score: String,
  }],
  gad7:[ {
    date: Date,
    score:String,
  }],


});

// Define the schema for WeeklyHealthReport
const weeklyHealthReportSchema = new mongoose.Schema({
  person: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'student',
  },

});

// Define the schema for PHQ9Scores
const phq9ScoresSchema = new mongoose.Schema({
  person: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'student',
  },
  date: Date,
  score: Number,
});

// Define the schema for PHQ15Scores
const phq15ScoresSchema = new mongoose.Schema({
  person: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'student',
  },
  date: Date,
  score: Number,
});

// Define the schema for GAD7Scores
const gad7ScoresSchema = new mongoose.Schema({
  person: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'student',
  },
  score: Number,
});

// Create the models for each schema
const School = mongoose.model('School', schoolSchema);
const Student = mongoose.model('Student', studentSchema);
const WeeklyHealthReport = mongoose.model('WeeklyHealthReport', weeklyHealthReportSchema);
const PHQ9Scores = mongoose.model('PHQ9Scores', phq9ScoresSchema);
const PHQ15Scores = mongoose.model('PHQ15Scores', phq15ScoresSchema);
const GAD7Scores = mongoose.model('GAD7Scores', gad7ScoresSchema);

// Export the models
module.exports = {
  School,
  Student,
  WeeklyHealthReport,
  PHQ9Scores,
  PHQ15Scores,
  GAD7Scores,
};
