// const Data = require("../models/mongodb.js")
// const jwt = require("jsonwebtoken")
// // for signing in and storing the data in mongo
// const sign = async (req, res) => {
//     const da = new Data({
//         passward: req.body.pw,
//         userid: req.body.userid,
//         email: req.body.email,
//     });
//     console.log(da);
//     // let user = false;
//     // let mail = false;
//     // let login = false;
//     const id = da._id
//     const userexsist = await Data.findOne({ userid: da.userid })
//         .then((userexsist) => {
//             if (userexsist) {
//                 res.render("review", { warnuser: true })
//             } else {
//                 const mailexsist = Data.findOne({ email: da.email })

//                 return mailexsist

//             }
//         })
//         .then((mailexsist) => {
//             if (mailexsist) {
//                 res.render("review", { warnmail: true })
//             } else {

//                 return da.save()

//             }
//         })
//         .then((result) => {
//             if (result) {
//                 const token = jwt.sign({ _id: id }, "keybro")
//                 res.cookie("token", token, {
//                     expiresnew: Date(Date.now() + 900000),
//                 })
//                 let url = id.toString()
//                 res.redirect("/user/" + url)
//                 // console.log("added")
//             }
//         })
//         .catch((error) => {
//             // Handle the error appropriately
//             console.error(error);
//             res.send(' <h1> An error occurred while checking user and email existence or saving the data.<h1/>');
//         });

// }
// //login and to serch the specfic data in the mongo
// const login = async (req, res) => {
//     const fetching = new Data({
//         passward: req.body.pw,
//         userid: req.body.userid,
//     });

//     const user = await Data.findOne({ userid: fetching.userid })
//         .then((user) => {
//             if (user && user.passward === fetching.passward) {
//                 const token = jwt.sign({ _id: user._id }, "keybro")
//                 res.cookie("token", token, {
//                     expiresnew: Date(Date.now() + 900000),
//                 })
//                 let url = '/user/' + user._id
//                 res.redirect(url)
//             } else {
//                 let p = false;
//                 res.render("review", { warn404: true });
//             }
//         })
//         .catch((error) => {
//             console.log(error);
//             // Handle error
//         });
// }

// //for storing user activity still incomplete (reason:no landing page)
// const useractivity = async (req, res) => {
//     const { q1, q2, q3, q4, q5, q6, q7, q8, q9, q10 } = req.body;
//     let s = 0;
//     s = (q1 * 1) + (q2 * 1) + (q3 * 1) + (q4 * 1) + (q5 * 1) + (q6 * 1) + (q7 * 1) + (q8 * 1) + (q9 * 1) + (q10 * 1);
//     s = s / 10;
//     let { token } = req.cookies
//     //        console.log(date )
//     //        console.log(score)

//     // console.log(token)

//     const id = jwt.verify(token, "keybro")
//     const user = await Data.findById(id)
//     // console.log(user)

//     // let somedate= new Date()
//     const newactivity = {
       
//             date: new Date(),
//             score: s,
      
      
     
//     }

//      console.log( user.activity.weekly)
    
//     user.activity.weekly.push(newactivity)
//     await user.save()
//     console.log( user.activity.weekly)
//     // console.log(user.activity)

//     //res.render("re",user)
//     const url = '/user/' + user.id
//    res.redirect(url)
// }


// //for fecting the useractity for a grpah in frontend
// const fetchingact = async (req, res) => {
//     const id = req.params.id
//     const useract = await Data.findById(id)
//     const weekly = []
//     const dateweekly = []
//     const dailysleep=[]
//     const dailymood=[]
//     const dailydate=[]

//     useract.activity.weekly.forEach(element => {

//         const inputDate = new Date(element.date);
//         const day = inputDate.getDate().toString().padStart(2, '0');
//         const month = (inputDate.getMonth() + 1).toString().padStart(2, '0'); // Month is zero-based
//         const year = inputDate.getFullYear().toString();
       
//         const formattedDate = `${day}/${month}/${year}`;
//         //console.log(newformat)
//         // date.push(formattedDate);

//         dateweekly.push(formattedDate)


//         weekly.push(element.score)
//     });
   
//     useract.activity.daily.forEach(element=>{
//         const inputDate = new Date(element.date);
//         const day = inputDate.getDate().toString().padStart(2, '0');
//         const month = (inputDate.getMonth() + 1).toString().padStart(2, '0'); // Month is zero-based
//         const year = inputDate.getFullYear().toString();
       
//         const formattedDate = `${day}/${month}/${year}`;
//         dailydate.push( formattedDate)
//        // console.log(element.mood,element.sleep)
//         dailymood.push(element.mood)
//         dailysleep.push(element.sleep)
//     })
// //    console.log(label,date,'label date')
//     const data = {
//         weekly,
//         dateweekly,
//         dailydate,
//         dailymood,
//         dailysleep
//     }
//     //console.log(data)
//     res.json(data)


// }
// const sleep= async (req,res)=>{
//     let { token } = req.cookies
//     const id = jwt.verify(token, "keybro")
//     const user = await Data.findById(id)
    
//     const ratesleep = req.body.stressRating;
    
//   //  console.log(ratesleep)
//     // Iterate through the 'user.activity.daily' array
//     let found = false;
//     user.activity.daily.forEach(element => {
//       if (element.date === new Date()) {
//         // If an entry for the current date exists, update it
//         element.sleep = ratesleep;
//         found = true;
//       }
//     });
    
//     if (!found) {
//       // If an entry for the current date does not exist, create a new one
//       const newEntry = {
//         date: new Date(),
//         sleep: ratesleep,
//       };
    
//       user.activity.daily.push(newEntry);
//       //console.log(user.activity.daily)
//     }
    
    
//     user.save() 
//     const url = '/user/' + user.id
//     res.redirect(url)

// }
// const mood= async(req,res)=>{
//     let { token } = req.cookies
//     const id = jwt.verify(token, "keybro")
//     const user = await Data.findById(id)

//     const ratemood = req.body.stressRating;
// //console.log(ratemood,'fgh')
//     // Iterate through the 'user.activity.daily' array
//     let found = false;
//     user.activity.daily.forEach(element => {
//       if (element.date === new Date()) {
//         // If an entry for the current date exists, update it
//         element.mood = ratemood;
//         found = true;
//       }
//     });
    
//     if (!found) {
//       // If an entry for the current date does not exist, create a new one
//       const newEntry = {
//         date: new Date(),
//         mood: ratemood,
//          // Set mood to your desired value
//       };
    
//       user.activity.daily.push(newEntry);
//       //console.log(user.activity.daily)
//     }
//   //  console.log(ratemood)
    
//     // Save the 'user' object or update it in your database
//     user.save() // Assuming 'user' is a Mongoose model

//     const url = '/user/' + user.id
//     res.redirect(url)
// }

// module.exports = {
//     sign,
//     login,
//     useractivity,
//     fetchingact,
//     sleep,
//     mood,
// }