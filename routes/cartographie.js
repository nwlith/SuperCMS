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
var Themes = require('./../database/modeles').Themes;
var References = require('./../database/modeles').References;

marked.setOptions({
  renderer: new marked.Renderer(),
  sanitize: true,
});

var db = require('./../database/db');
var carte = [{ 'References' : References }];
var model = [{m : References}];

var visites = [];

/* Accueil*******************************************************************************************************************/
router.get('/accueil', function(req, res, next) {
        res.render('Cartographie/accueil');
      });

/* Liste des références *************************************************************************************************************/
router.get('/references', function(req, res, next) {
    References.findAll().then(function(references) {
      res.render('Cartographie/references',{
      references: references,
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

/* Un thème et liste des reférences associées */
router.get('/theme/:id', function(req, res, next) {
  Themes.findById(req.params.id, {
    include: [{
      model: References,
    }],
  }).then(function(theme) {
      visites.push(theme.id+'-theme');
      console.log(visites);
      theme.description = marked(theme.description);
      res.render('Cartographie/theme',{
        theme: theme,
      });
    });
  });

/* Afficher une référence *********************************************************************************************************/

/* Une référence */
router.get('/article/:id', function(req, res, next) {
  References.findById(req.params.id, {
    include: [{
      model: Themes,
    }],
  }).then(function(reference) {
    visites.push(reference.id+'-reference');
    console.log(visites);
    reference.description = marked(reference.description);
    reference.titre = marked(reference.titre);
    res.render('Cartographie/'+reference.classe, {
      reference: reference,
    });
  });
});

router.get('/image/:id', function(req, res, next) {
  References.findById(req.params.id, {
    include: [{
      model: Themes,
    }],
  }).then(function(reference) {
    visites.push(reference.id+'-reference');
    console.log(visites);
    reference.description = marked(reference.description);
    reference.titre = marked(reference.titre);
    res.render('Cartographie/'+reference.classe, {
      reference: reference,
    });
  });
});

router.get('/livre/:id', function(req, res, next) {
  References.findById(req.params.id, {
    include: [{
      model: Themes,
    }],
  }).then(function(reference) {
    visites.push(reference.id+'-reference');
    console.log(visites);
    reference.description = marked(reference.description);
    reference.titre = marked(reference.titre);
    res.render('Cartographie/'+reference.classe, {
      reference: reference,
    });
  });
});

router.get('/video/:id', function(req, res, next) {
  References.findById(req.params.id, {
    include: [{
      model: Themes,
    }],
  }).then(function(reference) {
    visites.push(reference.id+'-reference');
    console.log(visites);
    reference.description = marked(reference.description);
    reference.titre = marked(reference.titre);
    res.render('Cartographie/'+reference.classe, {
      reference: reference,
    });
  });
});
/* Aléatoire en fonction d'un thème *************************************************************************************************************/
/* juste aléatoire **/
router.get('/aleatoire', function(req, res) {
  References.findAll({
    limit: 1,
    order: db.fn('RANDOM'),
  }).then(function(resultats) {
      res.redirect('/cartographie/' + resultats[0].classe + '/' + resultats[0].id );
  });
});


/* En fonction d'un thème  **/
router.get('/:id/aleatoire', function(req, res, next) {
  Themes.findById(req.params.id, {
    include: [{
      model: References.findById({ limit: 1, order: db.fn('RANDOM'),}),
    }],
  }).then(function(reference) {
      visites.push(Themes.id+'-theme');
      console.log(visites);
      res.redirect('/cartographie/'+reference[0].classe+'/'+reference[0].id,{
        theme: theme,
      });
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
      article.descritpion = marked(art.descritpion);
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
