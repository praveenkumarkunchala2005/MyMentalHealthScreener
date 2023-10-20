
const express = require("express")
const route = express()
const jwt = require("jsonwebtoken")
const cookieParser = require("cookie-parser")
const Data = require("../models/mongodb.js")
const c = require("../controller/controls.js")




//route to send user after login



//incomplete
// route.post("user/:id",c.useractivity)
route.get("/", (req, res) => {
  res.render("index");
});
route.get("/student",async (req, res) => {
  const schooldata=await Data.School.find();
  const mentordata=await Data.mentor.find();
  console.log(schooldata,mentordata)
  res.render("page",{schooldata,mentordata});
});
route.post('/getMentors', async (req, res) => {
  try {
    const selectedSchool = req.body.selectedSchool;
    const mentordata = await Data.mentor.find().exec();
    if (!Array.isArray(mentordata)) {
      throw new Error('Mentor data is not an array');
    }
    const filteredMentors = mentordata.filter(mentor => mentor.school_name === selectedSchool);
    res.json(filteredMentors);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
route.post("/register", async (req, res) => {
  // Capture the submitted data from the registration form
  const schoolName = req.body.school;
  const mentorName = req.body.mentor_name; // This contains the selected mentor's name
  const studentName = req.body.student_name;
  const studentRollNumber = req.body.student_rollnbr;
  const studentAge = req.body.student_age;
  const studentGender = req.body.student_gender;
  const password = req.body.password;
  try {
    const student = Data.Student({
      school_name: schoolName,
      mentor_name: mentorName, // Set the mentor name
      student_name: studentName,
      student_rollnbr: studentRollNumber,
      student_age: studentAge,
      student_gender: studentGender,
      password: password,
    });
    await student.save();
    console.log("Student saved:", student);

  req.session.studentId = student._id;
  const url="/"+student.id +"/studentdash"
  res.redirect(url);
  } catch (error) {

    console.error("Error during registration:", error);
    res.render("registration-failed", { error: "Registration failed" });
  }
});


route.post("/login", async (req, res) => {
  const { student_rollnbr, password } = req.body;
  const student = await Data.Student.findOne({ student_rollnbr });
  if (!student) {
    return res.render("login", { error: "Student not found" });
  }
  if (student.password !== password) {
    return res.render("login", { error: "Invalid password" });
  }
  req.session.isAuthenticated = true;
  req.session.studentId = student._id;
  const url="/"+student.id +"/studentdash"
  res.redirect(url);
});
//route.get("/:student/studentdash",(req,res)=>{
 // const id= req.params.student;
  //res.render("studentdash",{id})
//})
const Student = require('../models/mongodb.js');
const { PHQ9Scores, PHQ15Scores, GAD7Scores } = require('../models/mongodb.js');
const { get } = require("mongoose")

route.get("/:student/studentdash", async (req, res) => {
  const id = req.params.student;
  console.log(id)
  
  const studentData = await Data.Student.findOne({ _id: id});
  const phq15Scores1 = studentData.phq15.length > 0 ? studentData.phq15.slice(-1)[0].score : null;
  const gad7Scores1 = studentData.gad7.length > 0 ? studentData.gad7.slice(-1)[0].score : null;
  const phq9Scores1 = studentData.phq9.length > 0 ? studentData.phq9.slice(-1)[0].score : null;
  const phq15date1 = studentData.phq15.length > 0 ? studentData.phq15.slice(-1)[0].date.toLocaleDateString() : null;
  const gad7Sdate1 = studentData.gad7.length > 0 ? studentData.gad7.slice(-1)[0].date.toLocaleDateString() : null;
  const phq9date1 = studentData.phq9.length > 0 ? studentData.phq9.slice(-1)[0].date.toLocaleDateString() : null;
  const today = new Date().toLocaleDateString(); 
  console.log(phq15Scores1,phq9Scores1,gad7Scores1,phq15date1,gad7Sdate1,phq9date1,today)
  res.render("studentdash",{id,phq15Scores1,phq9Scores1,gad7Scores1,phq9date1})
});

route.get("/:student/phq15", (req, res) => {
  const id= req.params.student;
  res.render("phq15",{id});
})
route.get("/:student/phq9", async (req, res) => {
  const id= req.params.student;
  console.log(id,"phq9")
  const studentData = await Data.Student.findOne({ _id: id});
  const phq9Scores = studentData.phq9.length > 0 ? studentData.phq9.slice(-1)[0].score : null;
  console.log(phq9Scores)
  if (phq9Scores === null) {
    res.render("phq9", { id });
  } else {
    const phq9date = studentData.phq9.slice(-1)[0].date.toLocaleDateString();
    const today = new Date().toLocaleDateString(); // get today's date
    const timeDiff = Math.abs(new Date(today) - new Date(phq9date));
    const diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
    console.log(diffDays,timeDiff,phq9date,today)
    if (diffDays >= 7) {
      res.render("phq9", { id });
    } else {
      const phq15Scores = studentData.phq15.slice(-1)[0].score;
      const phq9Scores = studentData.phq9.slice(-1)[0].score;
      const gad7Scores = studentData.gad7.slice(-1)[0].score;
      res.render("studentdash",{id,phq15Scores,phq9Scores,gad7Scores,phq9date})
    }
  }
})
route.get("/:student/gad7", (req, res) => {
  const id= req.params.student;
  console.log(id)
  res.render("gad7",{id});
})
route.get("/weekly", (req, res) => {
  res.render("question4");
})
route.get("/:student/profile", async (req, res) => {
  const id = req.params.student;
  const studentData = await Data.Student.findById(id);
  const school_name = studentData.school_name;
  const student_name = studentData.student_name;
  const student_rollnbr = studentData.student_rollnbr;
  const student_age = studentData.student_age;
  const student_gender = studentData.student_gender;
  const student_phq9 = studentData.phq9;
  const student_phq15 = studentData.phq15;
  const student_gad7 = studentData.gad7;
  const phq9Scores = studentData.phq9.length > 5 ? studentData.phq9.slice(-5).map(score => parseInt(score.score)) : studentData.phq9.map(score => parseInt(score.score));
  const phq15Scores = studentData.phq15.length > 5 ? studentData.phq15.slice(-5).map(score => parseInt(score.score)) : studentData.phq15.map(score => parseInt(score.score));
  const gad7Scores = studentData.gad7.length > 5 ? studentData.gad7.slice(-5).map(score => parseInt(score.score)) : studentData.gad7.map(score => parseInt(score.score));
  const phq9dates = studentData.phq9.length > 5 ? studentData.phq9.slice(-5).map(score => score.date.toLocaleDateString()) : studentData.phq9.map(score => score.date.toLocaleDateString());
  console.log(school_name,student_name,student_rollnbr,student_age,student_gender,student_phq9,student_phq15,student_gad7,phq9Scores,phq15Scores,gad7Scores,phq9dates)

  const phq15Scores1 = studentData.phq15.length > 0 ? studentData.phq15.slice(-1)[0].score : null;
  const gad7Scores1 = studentData.gad7.length > 0 ? studentData.gad7.slice(-1)[0].score : null;
  const phq9Scores1 = studentData.phq9.length > 0 ? studentData.phq9.slice(-1)[0].score : null;
  const phq15date1 = studentData.phq15.length > 0 ? studentData.phq15.slice(-1)[0].date.toLocaleDateString() : null;
  const gad7Sdate1 = studentData.gad7.length > 0 ? studentData.gad7.slice(-1)[0].date.toLocaleDateString() : null;
  const phq9date1 = studentData.phq9.length > 0 ? studentData.phq9.slice(-1)[0].date.toLocaleDateString() : null;
  const today = new Date().toLocaleDateString(); 
  console.log(phq15Scores1,phq9Scores1,gad7Scores1,phq15date1,gad7Sdate1,phq9date1,today)
  res.render("profile", { id, school_name, student_name, student_rollnbr, student_age, student_gender ,student_phq9,student_phq15,student_gad7,phq9Scores,phq15Scores,gad7Scores,phq9dates,phq15Scores1,phq9Scores1,gad7Scores1,phq9date1});
});

route.post("/:student/phq15", async (req, res) => {
  let marks;
  const { q1, q2, q3, q4, q5, q6, q7, q8, q9, q10, q11, q12, q13, q14, q15 } = req.body;
  console.log(req.params.student, req.body, "phq15")
  const studentid = await Data.Student.findById(req.params.student)
  marks = parseInt(q1) + parseInt(q2) + parseInt(q3) + parseInt(q4) + parseInt(q5) + parseInt(q6) + parseInt(q7) + parseInt(q8) + parseInt(q9) + parseInt(q10) + parseInt(q11) + parseInt(q12) + parseInt(q13) + parseInt(q14) + parseInt(q15)
  const newphq15 ={
    date: new Date(),
    score: marks,
  }
studentid.phq15.push(newphq15)
studentid.save();
const url="/"+ studentid._id +"/gad7"
res.redirect(url)
})
route.post("/:student/phq9", async (req, res) => {
  let marks;
  const { q1, q2, q3, q4, q5, q6, q7, q8, q9, q10 } = req.body;
  console.log(req.params.student, req.body, "phq9")
  const studentid = await Data.Student.findById(req.params.student)
  marks = parseInt(q1) + parseInt(q2) + parseInt(q3) + parseInt(q4) + parseInt(q5) + parseInt(q6) + parseInt(q7) + parseInt(q8) + parseInt(q9) + parseInt(q10)   
  suicidemarks = parseInt(q9) + parseInt(q10)
  const newphq9 = {
    date: new Date(),
    score: marks,
    suicide : suicidemarks,
  }
  console.log(newphq9, marks, suicidemarks);
  studentid.phq9.push(newphq9)
  studentid.save();
  const url="/"+ studentid._id +"/phq15"
  res.redirect(url)
})
route.post("/:student/gad7", async (req, res) => {
  // const std= await Data.Student.findOne({person:req.params.student})
  let marks;
  const { q1, q2, q3, q4, q5, q6, q7 } = req.body;
  console.log(req.params.student, req.body, "gad7")
  const studentid = await Data.Student.findById(req.params.student)
  marks = parseInt(q1) + parseInt(q2) + parseInt(q3) + parseInt(q4) + parseInt(q5) + parseInt(q6) + parseInt(q7)
  const gad7 ={
    date: new Date(),
    score: marks,
  }
 studentid.gad7.push(gad7)
 studentid.save();
 const url="/"
  res.redirect(url)
})

route.get("/schooldashboard", async (req, res) => {
  const schlid= req.session.schoolId;
  console.log(schlid)
  const schlname= await Data.School.findById(schlid)
  console.log(schlname)
 const allstudent = await Data.Student.find({school_name: schlname.school_name})
 console.log(allstudent)

  res.render("school_dashboard",{allstudent} )
})
route.get("/school",(req,res)=>{
  res.render("schoollogin")
})
route.post("/login-school", async (req, res) => {
  const  email= req.body.email, password  = req.body.password;
   console.log(email,password)
  // Find a school by email
  const school = await Data.School.findOne({ email });

  if (!school) {
    return res.render("login-school", { error: "School not found" });
  }

  // Compare the provided password with the stored password
  if (school.password !== password) {
    return res.render("login-school", { error: "Invalid password" });
  }

  // Handle successful login (e.g., set a session variable)
  req.session.isAuthenticated = true;
  req.session.schoolId = school._id;

  res.redirect("/schooldashboard");
});


route.post("/signup-school", async (req, res) => {
  const { school_name, address, contact_details, email, password } = req.body;
  // Check if a school with the provided email already exists
  const existingSchool = await Data.School.findOne({ email });
  if (existingSchool) {
    return res.render("signup-school", { error: "School with this email already exists" });
  }
  // Create a new school
  const newSchool = new Data.School({
    school_name,
    address,
    contact_details,
    email,
    password, // You should hash the password for security in a real application
  });

  await newSchool.save();
  // Handle successful registration (e.g., set a session variable)
  req.session.isAuthenticated = true;
  req.session.schoolId = newSchool._id;

  res.redirect("/schooldashboard");;
});
route.get("/", (req, res) => {
  res.render("signup-school");
});

route.get("/mentorloginsignup", async (req, res) => {
  const schooldata=await Data.School.find();
  console.log(schooldata)
  res.render("mentorloginsignup",{schooldata});
});
route.post("/register-mentor", async (req, res) => {
  const newdata = Data.mentor({
    school_name: req.body.school,
    mentor_name: req.body.mentor_name,
    mentor_id: req.body.mentor_id,
    password: req.body.password,
  });

  try {
    await newdata.save();
    req.session.isAuthenticated = true;
    req.session.mentorId = newdata._id;
    const url = "/" + newdata._id + "/mentordashboard";
    console.log("Redirecting to:", url);
    res.redirect(url);
  } catch (error) {
    console.error("Error while saving mentor:", error);
    res.render("login", { error: "Registration failed" });
  }
});

route.post("/login-mentor", async (req, res) => {
  const { mentor_id, password } = req.body;
  const mentor = await Data.mentor.findOne({ mentor_id });
  if (!mentor) {
    return res.render("login", { error: "Mentor not found" });
  }
  if (mentor.password !== password) {
    return res.render("login", { error: "Invalid password" });
  }
  req.session.isAuthenticated = true;
  req.session.mentorId = mentor._id;
  console.log("Mentor:", mentor);
  const url = "/" + mentor._id + "/mentordashboard";
    console.log("Redirecting to:", url);
    res.redirect(url);
});

route.get("/:mentor/mentordashboard", async (req, res) => {
  const mentorid = req.params.mentor;
  console.log(mentorid);
  const mentor = await Data.mentor.findById(mentorid);
  console.log(mentor);
  const allstudent = await Data.Student.find({ mentor_name: mentor.mentor_name});
  res.render("mentordash", { allstudent });
});

const puppeteer = require('puppeteer');
route.get('/:student/generate-pdf', async (req, res) => {
  const studentid = req.params.student;
  console.log('Student ID:', studentid);
  const encodedStudentId = encodeURIComponent(studentid);
  console.log('Encoded Student ID:', encodedStudentId);
  const url = `http://localhost:3000/${encodedStudentId}/profile1`;
  console.log('URL:', url);
  if (!url) {
    return res.status(400).send('Missing URL parameter');
  }
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: 'networkidle0' });
  await page.waitForTimeout(2000); // add a delay of 2 seconds
  const pdf = await page.pdf({ format: 'A4' });
  await browser.close();

  // Set the response headers to specify that the content is a PDF and set the filename for download.
  res.setHeader('Content-Disposition', 'attachment; filename="profile.pdf"');
  res.contentType('application/pdf');
  res.send(pdf);
});
route.get("/:student/profile1", async (req, res) => {
  const id = req.params.student;
  const studentData = await Data.Student.findById(id);
  const school_name = studentData.school_name;
  const student_name = studentData.student_name;
  const student_rollnbr = studentData.student_rollnbr;
  const student_age = studentData.student_age;
  const student_gender = studentData.student_gender;
  const student_phq9 = studentData.phq9;
  const student_phq15 = studentData.phq15;
  const student_gad7 = studentData.gad7;
  const phq9Scores = studentData.phq9.length > 5 ? studentData.phq9.slice(-5).map(score => parseInt(score.score)) : studentData.phq9.map(score => parseInt(score.score));
  const phq15Scores = studentData.phq15.length > 5 ? studentData.phq15.slice(-5).map(score => parseInt(score.score)) : studentData.phq15.map(score => parseInt(score.score));
  const gad7Scores = studentData.gad7.length > 5 ? studentData.gad7.slice(-5).map(score => parseInt(score.score)) : studentData.gad7.map(score => parseInt(score.score));
  const phq9dates = studentData.phq9.length > 5 ? studentData.phq9.slice(-5).map(score => score.date.toLocaleDateString()) : studentData.phq9.map(score => score.date.toLocaleDateString());
  console.log(school_name,student_name,student_rollnbr,student_age,student_gender,student_phq9,student_phq15,student_gad7,phq9Scores,phq15Scores,gad7Scores,phq9dates)

  const phq15Scores1 = studentData.phq15.length > 0 ? studentData.phq15.slice(-1)[0].score : null;
  const gad7Scores1 = studentData.gad7.length > 0 ? studentData.gad7.slice(-1)[0].score : null;
  const phq9Scores1 = studentData.phq9.length > 0 ? studentData.phq9.slice(-1)[0].score : null;
  const phq15date1 = studentData.phq15.length > 0 ? studentData.phq15.slice(-1)[0].date.toLocaleDateString() : null;
  const gad7Sdate1 = studentData.gad7.length > 0 ? studentData.gad7.slice(-1)[0].date.toLocaleDateString() : null;
  const phq9date1 = studentData.phq9.length > 0 ? studentData.phq9.slice(-1)[0].date.toLocaleDateString() : null;
  const today = new Date().toLocaleDateString(); 
  console.log(phq15Scores1,phq9Scores1,gad7Scores1,phq15date1,gad7Sdate1,phq9date1,today)
  res.render("profile1", { id, school_name, student_name, student_rollnbr, student_age, student_gender ,student_phq9,student_phq15,student_gad7,phq9Scores,phq15Scores,gad7Scores,phq9dates,phq15Scores1,phq9Scores1,gad7Scores1,phq9date1});
});

module.exports = route;