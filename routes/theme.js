var express = require('express');
var router = express.Router();
var Articles = require('./../database/modeles').Articles;
var Images = require('./../database/modeles').Images;
var Videos = require('./../database/modeles').Videos;
var Themes = require('./../database/modeles').Themes;

var carte = {
  image: Images,
  article: Articles,
  video: Videos,
};

var carteUrl = {
  image: "image",
  article: "article",
  video: "video",
};

/** Ajouter thème sur une référence */
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

/** Supprimer thème d'une référence */
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
