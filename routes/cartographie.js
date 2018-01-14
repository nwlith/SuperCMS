var express = require('express');
var router = express.Router();
var path = require('path');

var Articles = require('./../database/modeles').Articles;
var Themes = require('./../database/modeles').Themes;
var Images = require('./../database/modeles').Images;


/* Accueil*******************************************************************************************************************/

/* Liste des références *************************************************************************************************************/
router.get('/references', function(req, res, next) {
  References.findAll().then((reference) => {
      Images.findAll().then((images) => {
        res.render('Cartographie/references',{
          reference: reference,
          images: images
        });
      });
    });
  });

/* Afficher une référence *********************************************************************************************************/
      /* Un article */
router.get('/article/:id', function(req, res, next) {
  Articles.findById(req.params.id).then(function(article) {
    res.render('Cartographie/unArticle', {
      article: article,
    });
  });
});
      /* Une image */
router.get('/image/:id', function(req, res, next) {
  Images.findById(req.params.id).then(function(image) {
    res.render('Cartographie/uneImage', {
      image: image,
    });
  });
});
