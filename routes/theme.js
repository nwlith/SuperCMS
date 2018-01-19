var express = require('express');
var router = express.Router();
var Article = require('./../database/modeles').Article;
var Images = require('./../database/modeles').Images;
var Themes = require('./../database/modeles').Themes;

var carte = {
  image: Images,
  article: Article,
};

var carteUrl = {
  image: "image",
  article: "articles",
};

/** Ajouter thème*/
router.post('/add/:themesId/on/:model/:modelId', function (req, res) {
  var r = req.params;
  carte[r.model].findById(r.modelId).then(function(model) {
    Themes.findById(r.themesId).then((themes) => {
      model.addThemes(themes).then(() => {
        res.redirect(`/cms/${carteUrl[r.model]}/${r.modelId}/edit`);
      });
    });
  });
});

/** Supprimer thème*/
router.post('/remove/:themesId/from/:model/:modelId', function (req, res) {
  var r = req.params;
  carte[r.model].findById(r.modelId).then(function(model) {
    Themes.findById(r.themesId).then((themes) => {
      model.removeThemes(themes).then(() => {
        res.redirect(`/cms/${carteUrl[r.model]}/${r.modelId}/edit`);
      });
    });
  });
});


module.exports = router;
