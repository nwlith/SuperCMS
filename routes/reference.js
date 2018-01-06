var express = require('express');
var router = express.Router();
var path = require('path');
var Multer = require('multer');
var dummyRandomString = require('./../util/dummyRandomString');

var References = require('./../database/modeles').References;
var Themes = require('./../database/modeles').Themes;
var Images = require('./../database/modeles').Images;

var uploading = Multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.resolve( __dirname, '../public/images/'));
  },
  filename: function (req, file, cb) {
    var name = dummyRandomString();
    cb(null, name);
  },
  limits: {fileSize: 1000000, files:1},
});
var uploadHandler = Multer({ storage: uploading });

router.use('/nouvelle',uploadHandler.single('file'));

/* Créer / modifier / supprimer des références*******************************************************************************************************************/

/* Liste des réferences, thèmes, image : va chercher tous les références dans la base de données
puis les passe à la vue "nouvelleReference.jade" pour affichage à l'adresse /nouvelle */
router.get('/nouvelle', function(req, res, next) {
  References.findAll().then((reference) => {
      Images.findAll().then((images) => {
        res.render('nouvelleReference',{
          reference: reference,
          images: images
        });
      });
    });
  });

/* crée une nouvelle référence */

/*
router.post('/nouvelle', function(req, res, next) {
  References.create({
    titre: req.body.titre || 'titre par défaut',
    contenu: req.body.contenu || 'Pas de contenu',
  }).then(function(){
  Images.create({
    path: req.file.filename ? '/images/' + req.file.filename : 'erreur',
    description: req.body.description || 'description par défaut',
  })}).then(function() {
    res.redirect('/reference/nouvelle');
  });
});
 */

router.post('/nouvelle', function(req, res, next) {
  References.create({
      titre: req.body.titre || 'titre par défaut',
      contenu: req.body.contenu || 'Pas de contenu',
    }).then((reference) => {
      Images.create({
        path: req.file.filename ? '/images/' + req.file.filename : 'erreur',
        description: req.body.description || 'description par défaut',
      }).then((images) => {
        res.redirect('/reference/nouvelle');
    });
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
      contenu: req.body.contenu || 'Pas de contenu',
    })}).then(function(images) {
      res.redirect('/reference/nouvelle');
    });
});

router.get('/image/:id/edit', function(req, res, next) {
  Images.findById(req.params.id).then(function(images) {
    res.render('editImage', {
      images: images,
    });
  });
});

router.post('/image/:id/edit', function(req, res, next) {
  Images.findById(req.params.id).then(function(images) {
    images.update({
      titre: req.body.titre || 'titre par défaut',
      description: req.body.description || 'Pas de contenu',
    })}).then(function(images) {
      res.redirect('/reference/nouvelle');
    });
});

/* Supprime */
router.post('/:id/delete', function(req, res, next) {
  References.findById(req.params.id).then(function(reference) {
    reference.destroy();
  }).then(function(){
  Images.findById(req.params.id).then(function(images) {
    images.destroy();
  })}).then(function(){
  Themes.findById(req.params.id).then(function(theme) {
    theme.destroy();
  })}).then(function() {
    res.redirect('/reference/nouvelle');
  });
});

/* Cartographie : accueil / thème / référence ******************************************************************************************************************/

/* Page d'accueil*/
router.get('/nouvelle', function(req, res, next) {
  References.findAll().then(function(reference) {
    res.render('nvReference', {
      reference: reference,
    });
  });
});

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

module.exports = router;
