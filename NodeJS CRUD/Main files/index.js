const express = require("express");
const app = express();

const exphbs = require('express-handlebars')
const path = require("path");

/* const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true})); */

// replacement for body-parser in latest version
app.use(express.json());
app.use(express.urlencoded({ extended: false }));


// view engine setup
// template engine -> enables us to use static template files

//app.set("views", path.join(__dirname, "views"));
//app.set("view engine", "jade");

app.engine('handlebars', exphbs({defaultLayout: 'datas'}));
app.set('view engine', 'handlebars')


// import mongoose
const mongoose = require("mongoose");
// import mongodb url
var db_URL = require("./properties").DB_URL;
// connecting express to mongodb
mongoose.connect(db_URL, (err) => {
  if (err) {
    console.log("Error in mongoose to db connection");
  } else {
    console.log("Connected to db, good to go!!");
  }
});

const userModel = require("./models/post");

app.get("/", async (req, res) => {

  let arr = req.url;
  let split = arr.split("?");
  if(split[1] !== '' && arr.length > 1) {
    var checkfordelete = split[1].split("=")[1];
    if(checkfordelete){
      var delete_data = await userModel.deleteOne({_id: checkfordelete});
      if(delete_data) {
        var message = "One data is deleted";
        var color = 'rgb(243, 10, 10)';
      }
    }
    else if (split[1] == 'try-diff-num') {
      var message = "Try with different Contact number";
      var color = 'rgb(243, 10, 10)';
    }
    else{
      var message = "One data is added";
      var color = 'rgb(64, 243, 10)';
    }
    var sortOrder = {firstname: 1};
    var allDatas = await userModel.find({}).lean().sort(sortOrder).exec();

    // res.sendFile(path.join(__dirname, "public", "modal.html"));
    res.render('layouts/datas', {title: "Data" ,message: message,color: color, allDatas});
  }else{
    var sortOrder = {firstname: 1};
    var allDatas = await userModel.find({}).lean().sort(sortOrder).exec();

    // res.sendFile(path.join(__dirname, "public", "modal.html"));
    res.render('layouts/datas', {title: "Data" , allDatas});
  }
});
  
// to check whether the phnNumber exists , the response has to wait till it ends , so async/await is used 
app.post("/", async (req, resp, next) => {
    //console.log(req.body);
    let newUser = new userModel({
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      email: req.body.email,
      phnNumber: req.body.phnNumber,
    });
  
    var checkExist = await userModel.findOne({phnNumber: req.body.phnNumber});
    if (checkExist) {
      resp.redirect('/?try-diff-num');
    }
    else {
      newUser.save((err, result) => {
        if (err) throw err;
  
        //resp.redirect("/?" + "firstname=" + req.body.firstname + "&lastname=" + req.body.lastname + "&email=" + req.body.email + "&phnNumber=" + req.body.phnNumber);
        resp.redirect("/?data-added");
      });
    }
  });

// importing routes
// const userDetailsRouter = require("./routes/userDetails");
// app.use("/userDetails", userDetailsRouter);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log("Port is listening., Good to go!!"));
