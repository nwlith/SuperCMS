/* Variables**/
/* Nouvelle référence **/
/* Liste des références **/
/* Editer **/
/* Supprimer **/

/* Variables**********************************************************************************************************/
var express = require('express');
var router = express.Router();
const fs = require('fs');
/*  Modèles **/
var References = require('./../database/modeles').References;
var Themes = require('./../database/modeles').Themes;

var flasher = require('./../flash');
var marked = require('marked');

marked.setOptions({
  renderer: new marked.Renderer(),
  sanitize: true,
});

var dummyRandomString = require('./../util/dummyRandomString');
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

router.use('/nouvelle_video', uploadHandler.single('file'));
router.use('/nouvelle_image', uploadHandler.single('file'));
router.use('/nouvel_article', uploadHandler.single('file'));
router.use('/nouveau_livre', uploadHandler.single('file'));

var carte = {
  theme: Themes,
  reference: References,
};
var carteUrl = {
  theme:"theme",
  reference: "reference",
};


/* Nouvelle référence **************************************************************************************************/

/* Créer une réference */
router.get('/nouvelle', function(req, res, next) {
    Themes.findAll().then((themes) => {
        res.render('CMS/nouvelleReference',{
            themes: themes,
        });
    });
});

router.post('/nouvel_article', function(req, res, next) {
  References.create({
      classe: 'article',
      titre: req.body.titre || 'titre par défaut',
      auteur: req.body.auteur || 'auteur inconnu',
      path: req.file.filename ? '/images/'+ req.file.filename : 'erreur',
      description: req.body.description || 'Pas de descritpion',
    }).then((reference) => {
      flasher.flash({ message: 'Article ' + reference.titre + ' créé avec succès !' });
      res.redirect('/cms/reference/'+ reference.id);
    });
  });

router.post('/nouvelle_image', function(req, res, next) {
      References.create({
        classe: 'image',
        titre: req.body.titre || 'titre par défaut',
        auteur: req.body.auteur || 'auteur inconnu',
        path: req.file.filename ? '/images/' + req.file.filename : 'erreur',
        description: req.body.description || 'description par défaut',
      }).then((reference) => {
        flasher.flash({ message: 'Image ' + reference.titre + ' créé avec succès !' });
        res.redirect('/cms/reference/'+ reference.id);
    });
  });

router.post('/nouveau_livre', function(req, res, next) {
  References.create({
      classe: 'livre',
      titre: req.body.titre || 'titre par défaut',
      auteur: req.body.auteur || 'auteur inconnu',
      path: req.file.filename ? '/images/'+ req.file.filename : 'erreur',
      description: req.body.description || 'Pas de descritpion',
    }).then((reference) => {
      flasher.flash({ message: 'Livre ' + reference.titre + ' créé avec succès !' });
      res.redirect('/cms/reference/'+ reference.id);
    });
  });

router.post('/nouvelle_video', function(req, res, next) {
    References.create({
        classe: 'video',
        titre: req.body.titre || 'titre par défaut',
        auteur: req.body.auteur || 'auteur inconnu',
        path: req.file.filename ? '/images/'+ req.file.filename : 'erreur',
        lien: req.body.lien || 'oups pas de lien',
        description: req.body.description || 'Pas de description',
      }).then((reference) => {
        flasher.flash({ message: 'Vidéo ' + reference.titre + ' créé avec succès !' });
        res.redirect('/cms/reference/'+ reference.id);
      });
    });

router.post('/nouveau_theme', function(req, res, next) {
    Themes.create({
        nom: req.body.nom || 'Nom par défaut',
        couleur: req.body.couleur || '#0A0344',
        description: req.body.description || 'description par défaut',
      }).then((themes) => {
          res.redirect('back');
      });
    });

/* Associer une référence à un thème****************************************************************************************************************/
router.get('/reference/:id', function(req, res, next) {
  References.findById(req.params.id, {
      include: [{
      model: Themes,
      }],
  }).then((reference) => {
    Themes.findAll().then((themes) => {
      res.render('CMS/associerThemeReference', {
          reference: reference,
          themes: themes,
      });
    });
  });
});

/* Liste des références ****************************************************************************************************************/

router.get('/liste', function(req, res, next) {
  References.findAll().then((references) => {
    Themes.findAll().then((themes) => {
      /*references.titre = marked(references.titre);*/
      res.render('CMS/listeReferences',{
        themes: themes,
        references: references,
      });
    });
  });
});

/* Editer****************************************************************************************************************/

router.get('/reference/:id/edit' , function(req, res, next) {
  References.findById(req.params.id, {
    include: [{
      model: Themes,
    }],
  }).then((reference) => {
    Themes.findAll().then((themes) => {
      res.render('CMS/edit'+ reference.classe, {
        reference: reference,
        themes: themes,
        flash: flasher.getFlash(),
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
  References.findById(req.params.id).then(function(reference) {
    reference.update({
      titre: req.body.titre || reference.titre,
      auteur: req.body.auteur || reference.auteur,
      description: req.body.description || reference.description,
      path: req.body.filename || reference.path,
    }).then(function(a) {
      flasher.flash({ message: 'Article ' + reference.titre + ' modifié avec succès !' });
      res.redirect('back');
    });
  });
});

router.post('/image/:id/edit', function(req, res, next) {
  References.findById(req.params.id).then((reference) => {
    reference.update({
      titre: req.body.titre || reference.titre,
      auteur: req.body.auteur || reference.auteur,
      description: req.body.description || reference.description,
      path: req.body.filename || reference.path,
    }).then(() => {
      flasher.flash({ message: 'Image ' + reference.titre + ' modifiée avec succès !' });
      res.redirect('back');
    });
  });
});

router.post('/livre/:id/edit', function(req, res, next) {
  References.findById(req.params.id).then((reference) => {
    reference.update({
      titre: req.body.titre || reference.titre,
      auteur: req.body.auteur || reference.auteur,
      description: req.body.description || reference.description,
      path: req.body.filename || reference.path,
    }).then(() => {
      flasher.flash({ message: 'Image ' + reference.titre + ' modifiée avec succès !' });
      res.redirect('back');
    });
  });
});

router.post('/video/:id/edit', function(req, res, next) {
  References.findById(req.params.id).then(function(reference) {
    reference.update({
      titre: req.body.titre || reference.titre,
      auteur: req.body.auteur || reference.auteur,
      lien: req.body.lien || reference.lien,
      description: req.body.description || reference.description,
    })}).then(() => {
      res.redirect('back');
    });
});

router.post('/theme/:id/edit', function(req, res, next) {
  Themes.findById(req.params.id).then(function(theme) {
    theme.update({
      nom: req.body.nom || theme.nom,
      couleur: req.body.couleur || theme.couleur,
      description: req.body.description || theme.description,
    })}).then(function(themes) {
      res.redirect(req.originalUrl);
    });
});

/* Supprimer *************************************************************************************************************/

router.post('/reference/:id/delete', function(req, res, next) {
  References.findById(req.params.id).then(function(reference) {
    reference.destroy();
    /*
    fs.unlink(path.resolve(__dirname,'../public', image.path), (err) => {
      if (err) throw err;
      console.log('Image de #{reference.titre} supprimée !');
    });
    */
  }).then(function() {
    res.redirect('/cms/liste');
  });
});

router.post('/image/:id/delete', function(req, res, next) {
  References.findById(req.params.id).then(function(reference) {
    reference.destroy();
    console.log(__dirname+'<====== dirname');
    fs.unlink(path.resolve(__dirname,'../public', image.path), (err) => {
      if (err) throw err;
      console.log('#{reference.titre} supprimée !');
    });
  }).then(function() {
    res.redirect('/cms/liste');
  });
});

router.post('/video/:id/delete', function(req, res, next) {
  Reference.findById(req.params.id).then(function(reference) {
    reference.destroy();
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
