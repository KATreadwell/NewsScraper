require("dotenv").config()

const express = require("express");
const logger = require("morgan");
const mongoose = require("mongoose");
const axios = require("axios");
const cheerio = require("cheerio");
const db = require("./models");
const _handlebars = require("handlebars");
const handlebars = require("express-handlebars");
const { allowInsecurePrototypeAccess } = require("@handlebars/allow-prototype-access");

const MONGODB_URI = process.env.MONGODB_URI

mongoose.connect(MONGODB_URI);

const PORT = process.env.PORT || 8000;

const app = express();
app.use(logger("dev"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static(__dirname + "public"));
app.use(express.static("."))

app.set("view engine", "handlebars");
app.engine("handlebars", handlebars({
  layoutDirs: __dirname + "/views/layouts",
  partialsDir:__dirname + "/views/partial",
  handlebars: allowInsecurePrototypeAccess(_handlebars)
}));

//Scrape New Articles
app.get("/scrape", function (req, res) {
  axios.get("https://www.nytimes.com/section/opinion/technology").then(function (response) {
    let $ = cheerio.load(response.data);
    let articleArray = [];

    $(".css-ye6x8s").each(function (i, element) {
      let result = {};
      result.title = $(this)
        .find("h2")
        .text();
      result.link = "https://www.nytimes.com" + $(this)
        .find("a")
        .attr("href");
      result.summary = $(this, "p")
        .first()
        .text();

      articleArray.push(result)
    });

    db.Article.create(articleArray)
      .then(function (dbArticle) {
        console.log(dbArticle);
        res.send("Scrape Complete");
      })

      .catch(function (err) {
        console.log(err);
      });
  });
});

//Homepage
app.get("/", function (req, res) {
  db.Article.find({saved: false})
    .then(function (dbArticles) {

      res.render("index", {
        Articles: dbArticles,
      })
    })
    .catch(function (err) {
      res.json(err);
    });
});

//Clear Articles
app.get("/clearArticles", function (req, res) {
  db.Article.deleteMany({})
    .then(function (dbArticles) {

      res.render("index", {
        Articles: dbArticles,
      })
    })
    .catch(function (err) {
      res.json(err);
    });
});

//Saved Articles 
app.get("/savedArticles", function (req, res) {
  db.Article.find({saved: true })
    .then(function (dbArticles) {
      console.log(dbArticles)
      res.render("saved-articles", {
        Articles: dbArticles,
      })
    })
    .catch(function (err) {
      res.json(err);
    });
});

//Saved Articles with their notes
// app.get("/savedArticles", function (req, res) {
//   db.Article.findOne({_id: req.params.id}, {saved: true })
//   .populate("note")
//     .then(function (dbArticles) {
//       res.render("saved-articles", {
//         Articles: dbArticles,
//       })
//     })
//     .catch(function (err) {
//       res.json(err);
//     });
// });

//to save articles 
app.post("/savedArticles/:id", function(req, res) {
  db.Article.update(req.body)
    .then(function(saveArticle) {
      return db.Article.update({ _id: req.params.id }, { saved: true});
    })
    .then(function(dbArticle) {
      res.json(dbArticle);
    })
    .catch(function(err) {
      res.json(err);
    });
});

//to read notes
app.get("/note/:id", function(req, res){
  console.log('request params', req.params)
  db.Article.findOne({_id: req.params.id}, {saved: true })
  .populate("note")
  .then(function(dbArticle){
    console.log('read note for client', dbArticle);
    res.json(dbArticle);

  })
  .catch(function(err){
    res.json(err);
  });
});


//to make notes
app.post("/note/:id", function(req, res){
  console.log(req.body)
  db.Note.create(req.body)
  .then(function(dbNote) {
    return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
  })
  .then(function(dbArticle){
    console.log('article data',dbArticle)
    res.json(dbArticle);
  })
  .catch(function(err){
    res.json(err);
  });
});

app.listen(PORT, function () {
  console.log("App running on http://localhost:" + PORT);
});
