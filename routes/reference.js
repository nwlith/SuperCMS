var express = require('express');
var router = express.Router();
var References = require('./../database/modeles').References;
var Themes = require('./../database/modeles').Themes;
var Images = require('./../database/modeles').Images;





/* Créer / modifier / supprimer des références*******************************************************************************************************************/
router.post('/upload', function(req, res) {

})

/* Page d'accueil*/
router.get('/nouvelle', function(req, res, next) {
  References.findAll().then(function(reference) {
    res.render('nvReference', {
      reference: reference,
    });
  });
});

/* Liste des réferences : va chercher tous les références dans la base de données
puis les passe à la vue "nvReference.jade" pour affichage à l'adresse /nouvelle */
router.get('/nouvelle', function(req, res, next) {
  References.findAll().then(function(reference) {
    res.render('nvReference', {
      reference: reference,
    });
  });
});


/* Cartographie : thème / référence ******************************************************************************************************************/
/* Affiche une référence */
router.get('/reference/:id', function(req, res, next) {
  References.findById(req.params.id).then(function(reference) {
    res.render('uneReference', {
      reference: reference,
    });
  });
});

/* Affiche un thème*/
router.get('/theme/:id', function(req, res, next) {
  Themes.findById(req.params.id).then(function(theme) {
    res.render('unTheme', {
      theme: theme,
    });
  });
});

/* crée une nouvelle référence */
router.post('/nouvelle', function(req, res, next) {
  Themes.create({
    nom: req.body.themes || 'Pas de thèmes',
  }).then(function(){
  References.create({
    titre: req.body.titre || 'titre par défaut',
    contenu: req.body.contenu || 'Pas de contenu',
  })}).then(function(){
  Images.create({
    chapo: req.body.image || 'Pas d\'image',
  })}).then(function() {
    res.redirect('/reference/nouvelle');
  });
});


/* Affiche le formulaire permettant d'éditer une référence */
router.get('/:id/edit', function(req, res, next) {
  References.findById(req.params.id).then(function(reference) {
    res.render('editReference', {
      reference: reference,
    });
  });
});

/* Redirige suite un edit + mise à jour des références */
router.post('/:id/edit', function(req, res, next) {
  References.findById(req.params.id).then(function(reference) {
    reference.update({
      titre: req.body.titre || 'titre par défaut',
      chapo: req.body.image || 'Pas d\'image',
      contenu: req.body.contenu || 'Pas de contenu',
      themes: req.body.themes || 'Pas de thèmes',
    }).then(function() {
      res.redirect('/reference/nouvelle');
    });
  });
});

/* Redirige suite à une suppression */
router.post('/:id/delete', function(req, res, next) {
  References.findById(req.params.id).then(function(reference) {
    reference.destroy().then(function() {
      res.redirect('/reference/nouvelle');
    });
  });
});



module.exports = router;
