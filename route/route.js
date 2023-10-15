
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
  console.log(schooldata)
  res.render("page",{schooldata});
});
route.post("/register", async (req, res) => {
  const newdata = Data.Student({
    school_name:req.body.school,
    student_name: req.body.student_name,
    student_rollnbr: req.body.student_rollnbr,
    student_age: req.body.student_age,
    student_gender: req.body.student_gender,
    password: req.body.password,
  })
  newdata.save();
  console.log(newdata)
  req.session.isAuthenticated = true;
  req.session.studentId = newdata._id;
  const url="/"+newdata.id +"/studentdash"
  res.redirect(url);

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
route.get("/:student/studentdash",(req,res)=>{
  const id= req.params.student;
  res.render("studentdash",{id})
})
route.get("/:student/phq15", (req, res) => {
  const id= req.params.student;
  res.render("phq15",{id});
})
route.get("/:student/phq9", (req, res) => {
  const id= req.params.student;
  console.log(id,"phq9")
  res.render("phq9",{id});
})
route.get("/:student/gad7", (req, res) => {
  const id= req.params.student;
  console.log(id)
  res.render("gad7",{id});
})
route.get("/weekly", (req, res) => {
  res.render("question4");
})
route.post("/:student/phq15", async (req, res) => {

 
  let marks;
  const { q1, q2, q3, q4, q5, q6, q7, q8, q9, q10, q11, q12, q13, q14, q15 } = req.body;
  console.log(req.params.student, req.body, "phq15")
  const studentid = await Data.Student.findById(req.params.student)
  marks = parseInt(q1) + parseInt(q2) + parseInt(q3) + parseInt(q4) + parseInt(q5) + parseInt(q6) + parseInt(q7) + parseInt(q8) + parseInt(q9) + parseInt(q10) + parseInt(q11) + parseInt(q12) + parseInt(q13) + parseInt(q14) + parseInt(q15)
  const newphq15 ={
    //person: studentid._id,
    date: new Date(),
    score: marks,
  }
studentid.phq15.push(newphq15)
studentid.save();
const url="/"+ studentid._id +"/gad7"
res.redirect(url)
})
route.post("/:student/phq9", async (req, res) => {
  // const std= await Data.Student.findOne({person:req.params.student})
  let marks;
  
  const { q1, q2, q3, q4, q5, q6, q7, q8, q9, q10 } = req.body;
  console.log(req.params.student, req.body, "phq9")
  const studentid = await Data.Student.findById(req.params.student)
  marks = parseInt(q1) + parseInt(q2) + parseInt(q3) + parseInt(q4) + parseInt(q5) + parseInt(q6) + parseInt(q7) + parseInt(q8) + parseInt(q9) + parseInt(q10)   
  const newphq9 = {
    //person: studentid._id,
    date: new Date(),
    score: marks,
  }
  console.log(newphq9,marks);
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



module.exports = route
