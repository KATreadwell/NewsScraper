var express = require("express");
var logger = require("morgan");
var mongoose = require("mongoose");
var axios = require("axios");
var cheerio = require("cheerio");
var db = require("./models");
require("dotenv").config()

var MONGODB_URI = process.env.MONGODB_URI

mongoose.connect(MONGODB_URI);

var PORT = 3000;

var app = express();
app.use(logger("dev"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));

// mongoose.connect("mongodb://localhost/mongoHeadlines", { useNewUrlParser: true });

app.get("/scrape", function(req, res) {
  axios.get("https://www.nytimes.com/section/opinion/technology").then(function(response) {
    var $ = cheerio.load(response.data);
    var articleArray = [];

    $(".css-ye6x8s").each(function(i, element) {
      var result = {};
      result.title = $(this)
        .find("h2")
        .text();
      result.link = "https://www.nytimes.com" + $(this)
        .find("a")
        .attr("href");
      result.summary = $(this,"p")
        .first()
        .text();

        articleArray.push(result)
    });
   
    db.Article.create(articleArray)
    .then(function(dbArticle) {
      console.log(dbArticle);
      res.send("Scrape Complete");
    })

    .catch(function(err) {
      console.log(err);
    });   
  }); 
});

app.get("/", function(req, res){
    db.Article.find({})
    .then(function(dbArticles){
        res.render("index", {
            dbArticles

        }) 
    })
    .catch(function(err){
        res.json(err);
    })
}) 


app.get("/articles", function(req, res) {
  db.Article.find({})
    .then(function(dbArticle) {
      res.json(dbArticle);
    })
    .catch(function(err) {
      res.json(err);
    });
});

// // Route for grabbing a specific Article by id, populate it with saved?
// app.get("/articles/:id", function(req, res) {
//   // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
//   db.Article.findOne({ _id: req.params.id })
//     // ..and populate all of the notes associated with it
//     .populate("note")
//     .then(function(dbArticle) {
//       // If we were able to successfully find an Article with the given id, send it back to the client
//       res.json(dbArticle);
//     })
//     .catch(function(err) {
//       // If an error occurred, send it to the client
//       res.json(err);
//     });
// });

// // Route for saving/updating an Article's associated Note
// app.post("/articles/:id", function(req, res) {
//   // Create a new note and pass the req.body to the entry
//   db.Note.create(req.body)
//     .then(function(dbNote) {
//       // If a Note was created successfully, find one Article with an `_id` equal to `req.params.id`. Update the Article to be associated with the new Note
//       // { new: true } tells the query that we want it to return the updated User -- it returns the original by default
//       // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
//       return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
//     })
//     .then(function(dbArticle) {
//       // If we were able to successfully update an Article, send it back to the client
//       res.json(dbArticle);
//     })
//     .catch(function(err) {
//       // If an error occurred, send it to the client
//       res.json(err);
//     });
// });

app.listen(PORT, function() {
  console.log("App running on http://localhost:" + PORT);
});
