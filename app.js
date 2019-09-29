//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');
const _ = require("lodash");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikiDB",{
    useNewUrlParser: true,
    useUnifiedTopology: true
})

const articleSchema = {
    title: String,
    content: String
}

const Article = mongoose.model("Article", articleSchema);
//Routes for just /articles
app.route("/articles")
  .get((req,res) => {
    Article.find((err,results) =>{
        if(!err)
        {
            res.send(results);
        }
        else 
        {
            res.send(err);
        }
    });
})
.post((req,res) => {
    console.log(req.body.title)
    console.log(req.body.content)

    const newArticle = new Article({
        title: req.body.title,
        content: req.body.content
    });

    newArticle.save((err) => {
        if (!err )
        {
            res.send("You Successfully Posted An Article")
        }
        else 
        {
            res.send(err);
        }
    });
  
})
 .delete((req,res) => {
    Article.deleteMany((err) => {
        if(!err) {
            res.send("Successfully deleted all articles")
        }
        else 
        {
            res.send(err);
        }
    })
});

//Routes for specfic articles

app.route("/articles/:articleTitle")
.get((req,res) => {
    let title = req.params.articleTitle;
    Article.findOne({title: title}, (err, foundArticle) => {
        if(!err) {
            res.send(foundArticle);
        }
        else
        {
            res.send("No Matching Article Found");
        }
    });
})
.put((req,res) => {
    let title = req.params.articleTitle;
    Article.update(
        {title:title},
        {title:req.body.title, content: req.body.content},
        {overwrite:true},
        (err,results) => {
            if(!err)
            {
                res.send("Successfully Updated Article")
            }
        })
})
.patch((req,res) => {
    let title = req.params.articleTitle;
    Article.update(
        {title:title},
        {$set: req.body},
        (err) => {
        if(!err) {
            res.send("Successfully Updated Article");
        } else {
            res.send(err);
        }
    }
    
    )
})
.delete((req,res) => {
    Article.deleteOne({title:req.params.articleTitle}, (err) => {
        if(!err)
        {
            res.send("Successfully Deleted Article");
        }
        else 
        {
            res.send(err);
        }
    });
})
app.listen(3000, function() {
  console.log("Server started on port 3000");
});