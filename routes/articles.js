var express = require('express');
var router = express.Router();
var Article = require('./../database/modeles').Article;

/* Liste des articles : va chercher tous les articles dans la base de données
puis les passe à la vue "articles.jade" pour affichage */
router.get('/', function(req, res, next) {
  Article.findAll().then(function(articles) {
    res.render('articles', {
      articles: articles,
    });
  });
});

router.get('/:id', function(req, res, next) {
  Article.findById(req.params.id).then(function(article) {
    res.render('unArticle', {
      article: article,
    });
  });
});

/* Affiche le formulaire permettant d'éditer un article */
router.get('/:id/edit', function(req, res, next) {
  Article.findById(req.params.id).then(function(article) {
    res.render('editArticle', {
      article: article,
    });
  });
});

router.post('/:id/edit', function(req, res, next) {
  Article.findById(req.params.id).then(function(article) {
    article.update({
      titre: req.body.titre || 'titre par défaut',
      chapo: req.body.chapo || 'chapo par défaut',
      contenu: req.body.contenu || 'Pas de contenu',
      themes: req.body.themes || 'Pas de thèmes',
    }).then(function() {
      res.redirect('/articles');
    });
  });
});

router.post('/:id/delete', function(req, res, next) {
  Article.findById(req.params.id).then(function(article) {
    article.destroy().then(function() {
      res.redirect('/articles');
    });
  });
});

router.post('/', function(req, res, next) {
  Article.create({
    titre: req.body.titre || 'titre par défaut',
    chapo: req.body.chapo || 'chapo par défaut',
    contenu: req.body.contenu || 'Pas de contenu',
    themes: req.body.themes || 'Pas de thèmes',
  }).then(function() {
    res.redirect('/articles');
  });
});

module.exports = router;
