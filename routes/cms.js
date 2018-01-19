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

var carte = {
  image: Images,
  article: Article,
  theme: Themes,
};
var carteUrl = {
  image: "image",
  article: "articles",
  theme:"theme"
};


/* Créer / modifier / supprimer des références*******************************************************************************************************************/

/* Liste des réferences, thèmes, image : va chercher tous les références dans la base de données
puis les passe à la vue "nouvelleReference.jade" pour affichage à l'adresse /nouvelle */
router.get('/nouvelle', function(req, res, next) {
  Articles.findAll().then((article) => {
      Images.findAll().then((images) => {
        Themes.findAll().then((themes) => {
          res.render('CMS/nouvelleReference',{
            article: article,
            images: images,
            themes: themes
        });
      });
    });
  });
});

/* Crée référence et thème ***************************************************/
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


/** Ajouter thème*/
router.post('/nouveau_theme', function(req, res, next) {
    Themes.create({
        nom: req.body.nom || 'Nom par défaut',
      }).then((themes) => {
          res.redirect('/cms/nouvelle');
      });
    });

/* Affiche le formulaire permettant d'éditer référence et thème****************/
router.get('/:model/:id/edit', function (req, res, next) {
  var r = req.params;
  carte[r.model].findById(r.modelId, {
    include: [{
      model: Themes,
    }],
  }).then(function(model) {
    Themes.findAll().then((themes) => {
        res.render("CMS/edit"+carteUrl[r.model]);
      });
    });
  });
});

router.get('/theme/:id/edit', function(req, res, next) {
  Themes.findById(req.params.id).then(function(themes) {
    res.render('CMS/editTheme', {
      themes: themes,
    });
  });
});

/* Redirige suite un edit de l'article et le met à jour*************************/
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

router.post('/theme/:id/edit', function(req, res, next) {
  Themes.findById(req.params.id).then(function(themes) {
    themes.update({
      nom: req.body.nom || 'nom par défaut',
    })}).then(function(themes) {
      res.redirect('/cms/nouvelle');
    });
});

/* Supprime article/image/theme**************************************************/

router.post('/:model/:id/delete', function (req, res, next) {
  var r = req.params;
  carte[r.model].findById(r.modelId).then(function(model) {
    model.destroy();
  }).then(function() {
    res.redirect('/cms/nouvelle');
  });
});


module.exports = router;
