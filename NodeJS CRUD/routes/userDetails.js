const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const userModel = require("../models/post");
const path = require("path");

/* router.get("/", (req, resp, next) => {
  resp.send("It is working");
}); */

/* router.post("/put", (req, resp, next) => {
    console.log(req.body);
  let newUser = new userModel({
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    email: req.body.email,
    phnNumber: req.body.phnNumber,
  });

  newUser.save((err, result) => {
    if(err) throw err;
    resp.send({status: 200, message: 'One new User is added', resultingData: result});
  });

  
}); */


router.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "modal.html"));
});



router.post("/", (req, resp, next) => {
  console.log(req.body);
  let newUser = new userModel({
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    email: req.body.email,
    phnNumber: req.body.phnNumber,
  });

  newUser.save((err, result) => {
    if (err) throw err;
    /* resp.send({
      status: 200,
      message: "One new User is added",
      resultingData: result,
    }); */
    resp.redirect("/");
  });
});

module.exports = router;


