var express = require("express");
var bodyParser = require("body-parser");
var app = express();
var session = require('express-session')
const mustacheExpress = require('mustache-express')
const port = 3000 




app.engine("mustache", mustacheExpress())
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set('view engine','mustache')
app.set("views","./views")

var destination = [{city:"Denver", id:1},{city: "Boston", id:2}];
var complete = ["Seattle"];
var count = 3

//post route for adding new destination 
app.post("/adddestination", function(req, res) {
    var newdestination = req.body.newdestination;
    //add the new destination from the post route
    destination.push({city: newdestination, id:count});
    count ++;
    res.redirect("/");
});

app.post('/delete', (req, res)=> {
    console.log("deleting")
    console.log(req.body.id)
})

app.post("/removedestination", function(req, res) {
    var completedestination = req.body.check;
    //check for the "typeof" the different completed destination, then add into the complete destination
    if (typeof completedestination === "string") {
        complete.push(completedestination);
        //check if the completed destination already exits in the destination when checked, then remove it
        destination.splice(destination.indexOf(completedestination), 1);
    } else if (typeof completedestination === "object") {
        for (var i = 0; i < completedestination.length; i++) {
            complete.push(completedestination[i]);
            destination.splice(destination.indexOf(completedestination[i]), 1);
        }
    }
    res.redirect("/");
});

app.post("/login",function(req,res){
    let username = req.body.username
    let password = req.body.password

    if(req.session){
        req.session.username = username

    var hour = 3600000
    req.session.cookie.expires = new Date(Date.now() + hour)
    req.session.cookie.maxAge = hour
    }

    res.redirect("/home")
})

app.get("/home", function(req,res){
    console.log(req.session.username)
    res.render("home",{username : req.session.username})
})


app.get("/", function(req, res) {
    res.render("index", {destination: destination});
});

app.get("/login",function(req,res){
    res.render("login")
})

app.listen(port, function() {
    console.log("server is running on port 3000");
});