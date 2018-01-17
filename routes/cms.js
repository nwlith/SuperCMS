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

router.use('/nouvelle_image', uploadHandler.single('file'));

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
router.post('/nouvel_article', function(req, res, next) {
  Articles.create({
      titre: req.body.titre || 'titre par défaut',
      contenu: req.body.contenu || 'Pas de contenu',
    }).then((article) => {
        res.redirect('/cms/nouvelle');
    });
  });

router.post('/nouvelle_image', function(req, res, next) {
      Images.create({
        path: req.file.filename ? '/images/' + req.file.filename : 'erreur',
        description: req.body.description || 'description par défaut',
      }).then((image) => {
        res.redirect('/cms/nouvelle');
    });
  });

/* Affiche le formulaire permettant d'éditer un article*/
router.get('/article/:id/edit', function(req, res, next) {
  Articles.findById(req.params.id).then(function(article) {
    res.render('CMS/editArticle', {
      article: article,
    });
  });
});

/* Affiche le formulaire permettant d'éditer une image*/
router.get('/image/:id/edit', function(req, res, next) {
  Images.findById(req.params.id).then(function(image) {
    res.render('CMS/editImage', {
      image: image,
    });
  });
});

/* Redirige suite un edit de l'article et le met à jour*/
router.post('/article/:id/edit', function(req, res, next) {
  Articles.findById(req.params.id).then(function(article) {
    article.update({
      titre: req.body.titre || 'titre par défaut',
      contenu: req.body.contenu || 'Pas de contenu',
    })}).then(function(article) {
      res.redirect('/cms/nouvelle');
    });
});

router.post('/image/:id/edit', function(req, res, next) {
  Images.findById(req.params.id).then((image) => {
    image.update({
      description: req.body.description || image.description,
    }).then(() => {
      res.redirect('/cms/nouvelle');
    });
  });
});

/* Supprime article*/
router.post('/article/:id/delete', function(req, res, next) {
  Articles.findById(req.params.id).then(function(article) {
    article.destroy();
  }).then(function() {
    res.redirect('/cms/nouvelle');
  });
});

/* Supprime image */
router.post('/image/:id/delete', function(req, res, next) {
  Images.findById(req.params.id).then(function(image) {
    image.destroy();
  }).then(function() {
    res.redirect('/cms/nouvelle')
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
