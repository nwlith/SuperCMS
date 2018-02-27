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

var carte = [{ 'Articles' : Articles }, { 'Images' : Images }, { 'Videos': Videos}];
var carteAl = [{ m : Articles }, { m : Images }, { m : Videos}];

var visites = [];
var visitesThemes = [];

/* Accueil*******************************************************************************************************************/
router.get('/accueil', function(req, res, next) {
        res.render('Cartographie/accueil');
      });

/* Liste des références *************************************************************************************************************/
router.get('/references', function(req, res, next) {
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
      visitesThemes.push(theme.id);
      console.log(visitesThemes);
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
    visites.push(article.id+'-Articles');
    console.log(visites);
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
    visites.push(image.id+'-Images');
    console.log(visites);
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
    visites.push(video.id+'-Videos')
    console.log(visites);
    video.description = marked(video.description);
    res.render('Cartographie/uneVideo', {
      video: video,
    });
  });
});

/* Aléatoire en fonction d'un thème *************************************************************************************************************/
/* juste aléatoire **/
router.get('/aleatoire', function(req, res) {
  var model = carteAl[Math.floor(Math.random()*carteAl.length)];
  model.m.findAll({
    limit: 1,
    order: db.fn('RANDOM'),
  }).then(function(resultats) {
      res.redirect('/cartographie/' + model.n + '/' + resultats[0].id );
  });
});

/* En fonction d'un thème**/
router.get('/:id/aleatoire', function(req, res) {
  var model = carteAl[Math.floor(Math.random()*carteAl.length)];
  model.m.findAll({
    limit: 1,
    order: db.fn('RANDOM'),
  }).then(function(resultats) {
      res.redirect('/cartographie/' + model.n + '/' + resultats[0].id );
  });
});


/*  Parcours *************************************************************************************************************/


/*
router.get('/parcours', function(req,res,next) {
  var visitesPropres = [];
  for(var i=0; i<visites.length; i++) {
    visitesPropres.push(visites[i].split('-'));
  };
  console.log(visitesPropres);
  for(var i = 0; i < visitesPropres.length; i++) {
    var modele = carte[visites[i][1]];
    var modeleId = parseInt(visites[i][0]);
    var themesId = parseInt(visitesThemes[i])
    console.log('modele :', modele, 'modeleId': modeleId);
    modele.findById(modeleId).then((donnees) => {
      var articles = donnees[0];
      var images = donnees[1];
      var videos = donnees[2];
      Themes.findById(themesId]).then((themes)=> {
        res.render('Cartographie/parcours',{
          articles: articles,
          images: images,
          videos: videos,
          themes:themes,
        });
      });
    });
  };
});

router.get('/references', function(req, res, next) {
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
**/

/*
router.get('/parcours', function(req,res,next) {
  var visitesPropres = [];
  var modeles =[];
  var modelesId =[];
  for(var i=0; i<visites.length; i++) {
    visitesPropres.push(visites[i].split('-'));
    console.log(visitesPropres);
  };
  for(var i=0; i<visitesPropres.length; i++) {
    modeles.push(carte[visitesPropres[i][1]]);
    modelesId.push(parseInt[visitesPropres[i][0]]);
    console.log('MODELES ====> ', modeles, 'ID ====> ', modelesId);
  };
  Promise.all([
    for(var i = 0; i < modeles.length; i++) {
      modele[i].findById(modeleId[i]);
    };
  ]).then((donnees) => {
    var articles = donnees[0];
    var images = donnees[1];
    var videos = donnees[2];
    Promise.all([
      for(var i = 0; i < modeles.length; i++) {
        Themes.findById(parseInt[visitesThemes[i]]);
      };
    ]).then((themes) => {
        res.render('Cartographie/parcours',{
          articles: articles,
          images: images,
          videos: videos,
          themes:themes,
        });
      });
    });
  });
*/


module.exports = router;
