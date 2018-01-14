var express = require('express');
var router = express.Router();
var path = require('path');
var Multer = require('multer');
var dummyRandomString = require('./../util/dummyRandomString');

var Articles = require('./../database/modeles').Articles;
var Themes = require('./../database/modeles').Themes;
var Images = require('./../database/modeles').Images;

var rangement = Multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.resolve( __dirname, '../public/images/'));
  },
  filename: function (req, file, cb) {
    var name = dummyRandomString();
    cb(null, name);
  },
  limits: {fileSize: 1000000, files:1},
});

var uploadHandler = Multer({ storage: rangement });

router.use('/upload', uploadHandler.single('file'));

/* Créer / modifier / supprimer des références*******************************************************************************************************************/

/* Liste des réferences, thèmes, image : va chercher tous les références dans la base de données
puis les passe à la vue "nouvelleReference.jade" pour affichage à l'adresse /nouvelle */
router.get('/nouvelle', function(req, res, next) {
  Articles.findAll().then((article) => {
      Images.findAll().then((images) => {
        res.render('CMS/nouvelleReference',{
          article: article,
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

/* Créer soit article soit image et thèmes */
router.post('/nouvelle', function(req, res, next) {
  Articles.create({
      titre: req.body.titre || 'titre par défaut',
      contenu: req.body.contenu || 'Pas de contenu',
    }).then((article) => {
        res.redirect('/reference/nouvelle');
    });
  });

router.post('/upload', function(req, res, next) {
      Images.create({
        path: req.file.filename ? '/images/' + req.file.filename : 'erreur',
        description: req.body.description || 'description par défaut',
      }).then((image) => {
        res.redirect('/reference/nouvelle');
    });
  });




/* Affiche le formulaire permettant d'éditer une référence */
router.get('/article/:id/edit', function(req, res, next) {
  Articles.findById(req.params.id).then(function(article) {
    res.render('editArticle', {
      article: article,
    });
  });
});


/* Redirige suite un edit + mise à jour des références */
router.post('/article/:id/edit', function(req, res, next) {
  Articles.findById(req.params.id).then(function(article) {
    article.update({
      titre: req.body.titre || 'titre par défaut',
      contenu: req.body.contenu || 'Pas de contenu',
    })}).then(function(article) {
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
    })}).then(function(image) {
      res.redirect('/reference/nouvelle');
    });
});

/* Supprime article*/
router.post('/article/:id/delete', function(req, res, next) {
  Articles.findById(req.params.id).then(function(article) {
    article.destroy();
  }).then(function() {
    res.redirect('/reference/nouvelle');
  });
});

/* Supprime image */
router.post('/article/:id/delete', function(req, res, next) {
  Images.findById(req.params.id).then(function(images) {
    images.destroy();
  }).then(function() {
    res.redirect('/reference/nouvelle')
  });
});

/* Supprime thèmes */
router.post('/theme/:id/delete', function(req, res, next) {
  Themes.findById(req.params.id).then(function(theme) {
    theme.destroy();
  }).then(function() {
    res.redirect('/reference/nouvelle')
  });
});

module.exports = router;
