/* Variables**/
/* Nouvelle référence **/
/* Liste des références **/
/* Editer **/
/* Supprimer **/

/* Variables**********************************************************************************************************/
var express = require('express');
var router = express.Router();
/*  Modèles **/
var Articles = require('./../database/modeles').Articles;
var Themes = require('./../database/modeles').Themes;
var Images = require('./../database/modeles').Images;
var Videos = require('./../database/modeles').Videos;
var flasher = require('./../flash');
/*  Nommer les images **/
var dummyRandomString = require('./../util/dummyRandomString');
/* Multer (upload images) **/
var path = require('path');
var Multer = require('multer');
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
  article: Articles,
  theme: Themes,
  video: Videos,
};
var carteUrl = {
  image: "image",
  article: "article",
  theme:"theme",
  video:"video",
};

function pluralize(word) {
  return word + 's';
}

function capitalize(word) {
  return word.charAt(0).toUppercase() + word.substring(1);
}

function modelStringToDataParam(modelString) {
  return capitalize(pluralize(modelString));
}

/* Nouvelle référence **************************************************************************************************/

/* Créer une réference */
router.get('/nouvelle', function(req, res, next) {
  Articles.findAll().then((article) => {
    Images.findAll().then((images) => {
      Themes.findAll().then((themes) => {
        Videos.findAll().then((videos) => {
          res.render('CMS/nouvelleReference',{
            article: article,
            images: images,
            themes: themes,
            videos: videos,
          });
        });
      });
    });
  });
});

router.post('/nouvel_article', function(req, res, next) {
  Articles.create({
      titre: req.body.titre || 'titre par défaut',
      contenu: req.body.contenu || 'Pas de contenu',
    }).then((article) => {
      flasher.flash({ message: 'Article ' + article.titre + ' créé avec succès !' });
      res.redirect('/cms/article/'+ article.id);
    });
  });

router.post('/nouvelle_image', function(req, res, next) {
      Images.create({
        path: req.file.filename ? '/images/' + req.file.filename : 'erreur',
        titre: req.body.titre || 'titre par défaut',
        description: req.body.description || 'description par défaut',
      }).then((image) => {
        flasher.flash({ message: 'Image ' + image.titre + ' créé avec succès !' });
        res.redirect('/cms/image/'+ image.id);
    });
  });

router.post('/nouvelle_video', function(req, res, next) {
    Videos.create({
        titre: req.body.titre || 'titre par défaut',
        lien: req.body.lien || 'oups pas de lien',
        description: req.body.description || 'Pas de description',
      }).then((video) => {
        flasher.flash({ message: 'Vidéo ' + video.titre + ' créé avec succès !' });
        res.redirect('/cms/video/'+ video.id);
      });
    });

router.post('/nouveau_theme', function(req, res, next) {
    Themes.create({
        nom: req.body.nom || 'Nom par défaut',
        description: req.body.description || 'description par défaut',
        couleur: req.body.couleur || '#0A0344',
      }).then((themes) => {
          res.redirect(req.body.url_redir);
      });
    });

/* Associer Article à un thème****************************************************************************************************************/
router.get('/article/:id', function(req, res, next) {
  Articles.findById(req.params.id, {
      include: [{
      model: Themes,
      }],
  }).then((article) => {
    Themes.findAll().then((themes) => {
      res.render('CMS/associerThemeArticle', {
          article: article,
          themes: themes
      });
    });
  });
});

router.get('/image/:id', function(req, res, next) {
  Images.findById(req.params.id, {
      include: [{
        model: Themes,
      }],
    }).then((image) => {
      Themes.findAll().then((themes) => {
        res.render('CMS/associerThemeImage', {
            image: image,
            themes: themes
        });
      });
  });
});

router.get('/video/:id', function(req, res, next) {
    Videos.findById(req.params.id, {
      include: [{
        model: Themes,
      }],
    }).then((video) => {
      Themes.findAll().then((themes) => {
        res.render('CMS/associerThemeVideo', {
            video: video,
            themes: themes
        });
      });
    });
});

/* Liste des références ****************************************************************************************************************/

router.get('/liste', function(req, res, next) {
  Articles.findAll().then((article) => {
    Images.findAll().then((images) => {
      Themes.findAll().then((themes) => {
        Videos.findAll().then((videos) => {
          res.render('CMS/listeReferences',{
            article: article,
            images: images,
            themes: themes,
            videos: videos,
          });
        });
      });
    });
  });
});


/* Editer****************************************************************************************************************/
/*
router.get('/:model/:id/edit', function (req, res, next) {
  var r = req.params;
  carte[r.model].findById(r.modelId, {
    include: [{
      model: Themes,
    }],
  }).then(function(model) {
    Themes.findAll().then(function(model) {
        var data = {};
        data[modelStringToDataParam(carteUrl[model])] = model;
        res.render("CMS/edit"+carteUrl[r.model], data);
      });
    });
  });
*/
router.get('/article/:id/edit', function(req, res, next) {
  Articles.findById(req.params.id, {
    include: [{
      model: Themes,
    }],
  }).then((article) => {
    Themes.findAll().then((themes) => {
      res.render('CMS/editArticle', {
        article: article,
        themes: themes,
        flash: flasher.getFlash(),
      });
    });
  });
});

router.get('/image/:id/edit', function(req, res, next) {
  Images.findById(req.params.id, {
    include: [{
      model: Themes,
    }],
  }).then((image) => {
    Themes.findAll().then((themes) => {
      res.render('CMS/editImage', {
        image: image,
        themes: themes
      });
    });
  });
});

router.get('/video/:id/edit', function(req, res, next) {
  Videos.findById(req.params.id, {
    include: [{
      model: Themes,
    }],
  }).then((video) => {
    Themes.findAll().then((themes) => {
      res.render('CMS/editVideo', {
        video: video,
        themes: themes
      });
    });
  });
});

router.get('/theme/:id/edit', function(req, res, next) {
  Themes.findById(req.params.id).then(function(theme) {
    res.render('CMS/editTheme', {
      theme: theme,
    });
  });
});

/* Redirige suite un edit de l'article et le met à jour */
router.post('/article/:id/edit', function(req, res, next) {
  Articles.findById(req.params.id).then(function(article) {
    article.update({
      titre: req.body.titre || article.titre,
      contenu: req.body.contenu || article.contenu,
    }).then(function(a) {
      flasher.flash({ message: 'Article ' + article.titre + ' modifié avec succès !' });
      res.redirect(req.originalUrl);
    });
  });
});

router.post('/image/:id/edit', function(req, res, next) {
  Images.findById(req.params.id).then((image) => {
    image.update({
      titre: req.body.titre || image.titre,
      description: req.body.description || image.description,
    }).then(() => {
      flasher.flash({ message: 'Image ' + image.titre + ' modifiée avec succès !' });
      res.redirect(req.originalUrl);
    });
  });
});

router.post('/video/:id/edit', function(req, res, next) {
  Videos.findById(req.params.id).then(function(video) {
    video.update({
      titre: req.body.titre || 'titre par défaut',
      lien: req.body.lien || 'oups, pas de lien',
      description: req.body.description || 'Pas de description',
    })}).then(function(video) {
      res.redirect(req.originalUrl);
    });
});

router.post('/theme/:id/edit', function(req, res, next) {
  Themes.findById(req.params.id).then(function(themes) {
    themes.update({
      nom: req.body.nom || 'nom par défaut',
    })}).then(function(themes) {
      res.redirect(req.originalUrl);
    });
});

/* Supprimer *************************************************************************************************************/
/*(tentative numéro 2 de factorisation qui ne fonctionne pas non plus */ /*
router.post('/:model/:id/delete', function (req, res, next) {
  var r = req.params;
  carte[r.model].findById(r.modelId).then(function(model) {
    model.destroy();
  }).then(function() {
    res.redirect('/cms/nouvelle');
  });
});
*/
router.post('/article/:id/delete', function(req, res, next) {
  Articles.findById(req.params.id).then(function(article) {
    article.destroy();
  }).then(function() {
    res.redirect('/cms/liste');
  });
});

router.post('/image/:id/delete', function(req, res, next) {
  Images.findById(req.params.id).then(function(image) {
    image.destroy();
  }).then(function() {
    res.redirect('/cms/liste');
  });
});

router.post('/video/:id/delete', function(req, res, next) {
  Videos.findById(req.params.id).then(function(video) {
    video.destroy();
  }).then(function() {
    res.redirect('/cms/liste');
  });
});

router.post('/theme/:id/delete', function(req, res, next) {
  Themes.findById(req.params.id).then(function(theme) {
    theme.destroy();
  }).then(function() {
    res.redirect('/cms/liste');
  });
});


module.exports = router;
