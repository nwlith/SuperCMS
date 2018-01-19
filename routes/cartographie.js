var express = require('express');
var router = express.Router();
var path = require('path');
var marked = require('marked');
var Articles = require('./../database/modeles').Articles;
var Themes = require('./../database/modeles').Themes;
var Images = require('./../database/modeles').Images;

var db = require('./../database/db');

var carte = [{ m: Articles, n: 'article'}, { m: Images, n: 'image'}];

router.get('/aleatoire', function(req, res) {
  var model = carte[Math.floor(Math.random()*carte.length)];
  model.m.findAll({
    limit: 1,
    order: db.fn('RANDOM'),
  }).then(function(resultats) {
      res.redirect('/cartographie/' + model.n + '/' + resultats[0].id );
  });
});

/* Accueil*******************************************************************************************************************/
router.get('/accueil', function(req, res, next) {
        res.render('Cartographie/accueil');
      });

/* Liste des références *************************************************************************************************************/
router.get('/references', function(req, res, next) {
  Articles.findAll({
    include: [{
      model: Themes,
    }],
  }).then((articles) => {
      Images.findAll({
        include: [{
          model: Themes,
        }],
      }).then((images) => {
        articles.text = marked('articles.text');
        res.render('Cartographie/references',{
          articles: articles,
          images: images
        });
      });
    });
  });

/* Afficher une référence *********************************************************************************************************/
      /* Un article */
router.get('/article/:id', function(req, res, next) {
  Articles.findById(req.params.id, {
    include: [{
      model: Themes,
    }],
  }).then(function(article) {
    article.contenu = marked(article.contenu);
    res.render('Cartographie/unArticle', {
      article: article,
    });
  });
});
      /* Une image */
router.get('/image/:id', function(req, res, next) {
  Images.findById(req.params.id, {
    include: [{
      model: Themes,
    }],
  }).then(function(image) {
    res.render('Cartographie/uneImage', {
      image: image,
    });
  });
});

module.exports = router;
