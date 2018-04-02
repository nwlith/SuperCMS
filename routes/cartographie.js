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

const Sequelize = require('sequelize');
const Op = Sequelize.Op;

marked.setOptions({
  renderer: new marked.Renderer(),
  sanitize: true,
});

var db = require('./../database/db');
var carte = [{ 'References' : References }];
var model = [{m : References}];

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
      /*visites.push(theme.id+'-theme');*/
      /*console.log(visites);*/
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
    if (typeof req.session.visites === 'undefined') {
      req.session.visites = [];
    }
    req.session.visites.push(reference.id);
    console.log(req.session.visites);
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
    if (typeof req.session.visites === 'undefined') {
      req.session.visites = [];
    }
    req.session.visites.push(reference.id);
    console.log(req.session.visites);
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
    if (typeof req.session.visites === 'undefined') {
      req.session.visites = [];
    }
    req.session.visites.push(reference.id);
    console.log(req.session.visites);
    reference.description = marked(reference.description);
    reference.titre = marked(reference.titre);
    res.render('Cartographie/'+reference.classe, {
      reference: reference,
    });
  });
});

router.get('/revue/:id', function(req, res, next) {
  References.findById(req.params.id, {
    include: [{
      model: Themes,
    }],
  }).then(function(reference) {
    if (typeof req.session.visites === 'undefined') {
      req.session.visites = [];
    }
    req.session.visites.push(reference.id);
    console.log(req.session.visites);
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
    if (typeof req.session.visites === 'undefined') {
      req.session.visites = [];
    }
    req.session.visites.push(reference.id);
    console.log(req.session.visites);
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
      res.redirect('/cartographie/'+reference[0].classe+'/'+reference[0].id,{
        theme: theme,
      });
    });
  });

/*  Parcours *************************************************************************************************************/

router.get('/parcours', function(req,res,next) {
    References.findAll({
      where:{
        id: { [Op.in]: req.session.visites || [] }
      }
    }).then((references) => {
      var referencesRangees = (req.session.visites || []).map((id) => {
          return references.find((ref) => ref.id === id);
      });
      Themes.findAll().then((themes)=> {
        res.render('Cartographie/parcours',{
          references: referencesRangees,
          themes: themes,
        });
      });
    });
  });

module.exports = router;
