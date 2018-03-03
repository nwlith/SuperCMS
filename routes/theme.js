var express = require('express');
var router = express.Router();
var References = require('./../database/modeles').References;
var Themes = require('./../database/modeles').Themes;

/** Ajouter thème sur une référence */
router.post('/add/:themeId/on/reference/:referenceId', function (req, res) {
  References.findById(req.params.referenceId).then(function(reference) {
    Themes.findById(req.params.themeId).then((theme) => {
      reference.addThemes(theme).then(() => {
        res.redirect('back');
      });
    });
  });
});

/** Supprimer thème d'une référence */
router.post('/remove/:themeId/from/reference/:referenceId', function (req, res) {
  References.findById(req.params.referenceId).then(function(reference) {
    Themes.findById(req.params.themesId).then((theme) => {
      reference.removeThemes(theme).then(() => {
        res.redirect('back');
      });
    });
  });
});


module.exports = router;
