require("dotenv").config()

const express = require("express");
const logger = require("morgan");
const mongoose = require("mongoose");
const axios = require("axios");
const cheerio = require("cheerio");
const db = require("./models");
const _handlebars = require("handlebars");
const handlebars = require("express-handlebars");
const {allowInsecurePrototypeAccess} = require("@handlebars/allow-prototype-access");

const MONGODB_URI = process.env.MONGODB_URI

mongoose.connect(MONGODB_URI);

const PORT = 3000;

const app = express();
app.use(logger("dev"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static(__dirname + "public"));
app.use(express.static("."))

app.set("view engine","handlebars");
app.engine("handlebars", handlebars({
  layoutDirs: __dirname+"/views/layouts",
  handlebars: allowInsecurePrototypeAccess(_handlebars)
}));

//Homepage 
// app.get("/", function(req, res){
//   console.log('its working')
//   db.Article.find({})
//   .then(function(dbArticle) {
//     // If we were able to successfully find Articles, send them back to the client
//     res.json(dbArticle);
//   })
//   .catch(function(err){
//       res.json(err);
//   })
// }) 

//Scrape New Articles
app.get("/scrape", function(req, res) {
  axios.get("https://www.nytimes.com/section/opinion/technology").then(function(response) {
    let $ = cheerio.load(response.data);
    let articleArray = [];

    $(".css-ye6x8s").each(function(i, element) {
      let result = {};
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


// All articles scrapped
app.get("/", function(req, res) {
    db.Article.find({})
      .then(function(dbArticles){
        
        res.render("index", {
          Articles: dbArticles,
        }) 
    })
    .catch(function(err) {
      res.json(err);
    });
});

// All articles scrapped
app.get("/clearArticles", function(req, res) {
  db.Article.deleteMany({})
    .then(function(dbArticles){
      
      res.render("index", {
        Articles: dbArticles,
      }) 
  })
  .catch(function(err) {
    res.json(err);
  });
});

//Saved Articles
app.get("/savedArticles", function(req, res) {
  db.Article.findOne({ _id: req.params.id,  saved: true })
    .then(function(dbArticle) {
      res.render("partials/saved-articles", {
        Articles: dbArticle,
      }) 
    })
    .catch(function(err) {
      res.json(err);
    });
});

//to save articles
app.post("/articles/:id", function(req, res) {
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

//to clear articles
app.post("/articles/:id", function(req, res) {
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


app.listen(PORT, function() {
  console.log("App running on http://localhost:" + PORT);
});
