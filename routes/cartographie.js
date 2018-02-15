/* Variables**/
/* Accueil**/
/* Liste des références **/
/* Liste des thèmes **/
/* Une référence **/
/* Aléatoire **/

/* Variables****************************************************************************************************************/
var express = require('express');
var router = express.Router();
var path = require('path');
var marked = require('marked');
var Articles = require('./../database/modeles').Articles;
var Themes = require('./../database/modeles').Themes;
var Images = require('./../database/modeles').Images;
var Videos = require('./../database/modeles').Videos;

marked.setOptions({
  renderer: new marked.Renderer(),
  sanitize: true,
});

var db = require('./../database/db');

var carte = [{ m: Articles, n: 'article'}, { m: Images, n: 'image'}, { m: Videos, n: 'video'}];

/* Accueil*******************************************************************************************************************/
router.get('/accueil', function(req, res, next) {
        res.render('Cartographie/accueil');
      });

/* Liste des références *************************************************************************************************************/
router.get('/references', function(req, res, next) {
  /*
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
          Videos.findAll({
            include: [{
              model: Themes,
            }],
          }).then((videos) => {
        articles.text = marked('articles.text');
        res.render('Cartographie/references',{
          articles: articles,
          images: images,
          videos: videos
        });
      });
    });
  });
  */
  var withThemes = { include: [{ model: Themes, }]};
  Promise.all([
    Articles.findAll(withThemes),
    Images.findAll(withThemes),
    Videos.findAll(withThemes)
  ]).then(function(donnees) {
    var articles = donnees[0].map(art => {
      var article = art;
      article.contenu = marked(art.contenu);
      return article;
    });
    var images = donnees[1];
    var videos = donnees[2];
    res.render('Cartographie/references',{
      articles,
      images,
      videos,
    });
  });
});
/* Liste des thèmes *************************************************************************************************************/
router.get('/themes', function(req, res, next) {
  Themes.findAll().then((themes) => {
        res.render('Cartographie/themes',{
          themes: themes,
        });
      });
    });

/* Thème et liste des reférences associées */
router.get('/theme/:id', function(req, res, next) {
  Themes.findById(req.params.id, {
    include: [{
      model: Articles,
      model: Images,
      model: Videos,
    }],
  }).then(function(theme) {
      res.render('Cartographie/theme',{
        theme: theme,
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
    image.description = marked(image.description);
    res.render('Cartographie/uneImage', {
      image: image,
    });
  });
});

/* Une vidéo */
router.get('/video/:id', function(req, res, next) {
  Videos.findById(req.params.id, {
    include: [{
      model: Themes,
    }],
  }).then(function(video) {
    video.description = marked(video.description);
    res.render('Cartographie/uneVideo', {
      video: video,
    });
  });
});

/* Aléatoire en fonction d'un thème *************************************************************************************************************/
/* juste aléatoire **/
router.get('/aleatoire', function(req, res) {
  var model = carte[Math.floor(Math.random()*carte.length)];
  model.m.findAll({
    limit: 1,
    order: db.fn('RANDOM'),
  }).then(function(resultats) {
      res.redirect('/cartographie/' + model.n + '/' + resultats[0].id );
  });
});

/* En fonction d'un thème**/
router.get(':id/aleatoire', function(req, res) {
  var model = carte[Math.floor(Math.random()*carte.length)];
  model.m.findAll({
    limit: 1,
    order: db.fn('RANDOM'),
  }).then(function(resultats) {
      res.redirect('/cartographie/' + model.n + '/' + resultats[0].id );
  });
});

module.exports = router;
