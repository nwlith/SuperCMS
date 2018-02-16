var Articles = require('./../../database/modeles').Articles;
var Images = require('./../../database/modeles').Images;
var Themes = require('./../../database/modeles').Themes;
var flasher = require('./../../flash');

var companions = [{
    model: Themes,
  },{
    model: Images,
  },
];

/* Créer un article */
var nouvelArticle = function(req, res, next) {
    Articles.create({
      titre: req.body.titre || 'titre par défaut',
      contenu: req.body.contenu || 'Pas de contenu',
    }).then((article) => {
      flasher.flash({ message: 'Article ' + article.titre + ' créé avec succès !' });
      res.redirect('/cms/article/'+ article.id);
    });
};

/* Affiche un article */
var getArticle = function(req, res, next) {
  Articles.findById(req.params.id, { include: companions })
  .then((article) => {
    Themes.findAll().then((themes) => {
      res.render('CMS/associerThemeArticle', {
          article: article,
          themes: themes
      });
    });
  });
};

/* Formulaire d'édition */
var editArticle = function(req, res, next) {
  Articles.findById(req.params.id, { include: companions })
  .then((article) => {
    Themes.findAll().then((themes) => {
      res.render('CMS/editArticle', {
        article: article,
        themes: themes,
        flash: flasher.getFlash(),
      });
    });
  });
};

/* Met à jour */
var updateArticle = function(req, res, next) {
  Articles.findById(req.params.id).then(function(article) {
    article.update({
      titre: req.body.titre || article.titre,
      contenu: req.body.contenu || article.contenu,
    }).then(function(a) {
      flasher.flash({ message: 'Article ' + article.titre + ' modifié avec succès !' });
      res.redirect(req.originalUrl);
    });
  });
};

/* Supprime */
var deleteArticle = function(req, res, next) {
  Articles.findById(req.params.id).then(function(article) {
    article.destroy();
  }).then(function() {
    res.redirect('/cms/liste');
  });
};

module.exports = {
  nouvelArticle,
  getArticle,
  deleteArticle,
  editArticle,
  updateArticle,
};
