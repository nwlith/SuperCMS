/* Variables**/
/* Nouvelle référence **/
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

/* Nouvelle références ********************************************************************************************/
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


/* Nouvelle référence **************************************************************************************************/

/* Créer une réferences */
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
        res.redirect('/cms/nouvelle');
    });
  });

router.post('/nouvelle_image', function(req, res, next) {
      Images.create({
        path: req.file.filename ? '/images/' + req.file.filename : 'erreur',
        titre: req.body.descritpion || 'titre par défaut',
        description: req.body.description || 'description par défaut',
      }).then((image) => {
        res.redirect('/cms/nouvelle');
    });
  });

router.post('/nouvelle_video', function(req, res, next) {
    Videos.create({
        titre: req.body.titre || 'titre par défaut',
        lien: req.body.lien || 'oups pas de lien',
        description: req.body.description || 'Pas de description',
      }).then((article) => {
          res.redirect('/cms/nouvelle');
      });
    });

router.post('/nouveau_theme', function(req, res, next) {
    Themes.create({
        nom: req.body.nom || 'Nom par défaut',
        description: req.body.description || 'description par défaut',
        couleur: req.body.couleur || '#0A0344',
      }).then((themes) => {
          res.redirect('/cms/nouvelle');
      });
    });

/* Editer****************************************************************************************************************/
/* (tentative de factorisation qui ne marche pas du tout)
router.get('/:model/:id/edit', function (req, res, next) {
  var r = req.params;
  carte[r.model].findById(r.modelId, {
    include: [{
      model: Themes,
    }],
  }).then(function(model) {
    Themes.findAll().then(function(model) {
        res.render("CMS/edit"+carteUrl[r.model], {
          carteUrl[model] : carteUrl[model];
        });
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
        themes: themes
      });
    });
  });
});

router.get('/image/:id/edit', function(req, res, next) {
  Images.findById(req.params.id, {
    include: [{
      model: Themes,
    }],
  }).then((images) => {
    Themes.findAll().then((themes) => {
      res.render('CMS/editImage', {
        images: images,
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
    Videos.findAll().then((themes) => {
      res.render('CMS/editVideo', {
        video: video,
        themes: themes
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

/* Redirige suite un edit de l'article et le met à jour */
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

router.post('/video/:id/edit', function(req, res, next) {
  Videos.findById(req.params.id).then(function(video) {
    video.update({
      titre: req.body.titre || 'titre par défaut',
      lien: req.body.lien || 'oups, pas de lien',
      description: req.body.description || 'Pas de description',
    })}).then(function(video) {
      res.redirect('/cms/nouvelle');
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
    res.redirect('/cms/nouvelle');
  });
});

router.post('/image/:id/delete', function(req, res, next) {
  Images.findById(req.params.id).then(function(image) {
    image.destroy();
  }).then(function() {
    res.redirect('/cms/nouvelle');
  });
});

router.post('/video/:id/delete', function(req, res, next) {
  Videos.findById(req.params.id).then(function(video) {
    video.destroy();
  }).then(function() {
    res.redirect('/cms/nouvelle');
  });
});

router.post('/theme/:id/delete', function(req, res, next) {
  Themes.findById(req.params.id).then(function(theme) {
    theme.destroy();
  }).then(function() {
    res.redirect('/cms/nouvelle');
  });
});


module.exports = router;
