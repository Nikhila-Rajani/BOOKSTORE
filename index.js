const express = require('express');
const nocache = require("nocache");
const path = require('path');
const session = require('express-session');
require('dotenv').config();

const app = express();
 
const mongoose = require('mongoose');

const user = require('./routes/user')
const admin = require('./routes/admin')

app.use(express.urlencoded({ extended: true }));

app.use(express.static('views'))
app.use(express.static('public'))

app.set('view engine','ejs')

app.use(session({
  secret:process.env.SESSIONSECRET,
  resave:true,
  saveUninitialized:true

}))

const MONGOATLASURI = process.env.MONGOATLASURI
mongoose.connect(MONGOATLASURI);
mongoose.connection.on("connected", () => {
      console.log("Connected to MongoDB");
    })
    
    mongoose.connection.on("error", (err) => {
      console.log("Error connecting to MongoDB");
    })
    
    mongoose.connection.on("disconnected", () => {
      console.log("Disconnected from MongoDB");
    })
    

app.use("/", nocache());


app.use("/",user)

app.use('/admin',admin)

app.use('*',(req,res,next)=>{
  // res.send("hrlll")
  res.render('user/error404')

})


app.listen(3000, () => {
      console.log(`http://localhost:3000`);
})