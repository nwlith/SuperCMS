var express = require('express');
var router = express.Router();
var flasher = require('./../flash');
var bcrypt = require('bcrypt');
var Users = require('./../database/modeles').User;
var passport = require('./../passport');

router.get('/connexion', function(req, res, next) {
 	res.render('utilisateurs/connexion', {
 		flash: flasher.getFlash(req),
 	});
});

router.post('/connexion',
  passport.authenticate('local', { failureRedirect: '/users/connexion' }),
  function(req, res, next) {
          flasher.flash(req, `Bienvenue ${req.user.nom}!`);
          res.redirect('/');
  });

router.get('/inscription', function(req, res, next) {
	  res.render('utilisateurs/inscription', {
	 		flash: flasher.getFlash(req),
	  });
});

function validateNewUser({nom, email, password, password_verify}, callback) {
	var e = []; // sac à erreurs
	var lettres = new RegExp(/[a-zA-Z]/);
	if (typeof nom === 'undefined') e.push("Veuillez entrer un nom");
	if (!email) e.push("Veuillez entrer un email");
	if (!password) e.push("Veuillez entrer un mot de passe");
  if (nom.trim().length === 0 || !lettres.test(nom.trim())) {
  	e.push("Votre nom doit contenir au moins une lettre");
  }
  if (email.trim().length < 5 || !email.includes('@') || email.indexOf('.') === -1) {
  	e.push("Votre adresse email est invalide");
  }
  if (password.trim().length < 5) {
  	e.push("Veuillez entrer un mot de passe de plus de cinq caractères");
  }
  if (password.trim() !== password_verify.trim()) {
  	e.push("Le mot de passe de confirmation ne correspond pas");
  }
  if (e.length > 0) {
  	callback(e, null);
  	return;
  }
  callback(null, {
  	nom: nom.trim(),
  	email: email.trim(),
  	password: password.trim(),
  });
}

router.post('/nouvel_utilisateur', function(req, res, next) {
	/**
		nom : doit faire plus de 0 caractères et contenir au moins une lettre
		mail : doit faire plus de 5 caractères, contenir une arobase et un point
		mot de passe : plus de 6 caractères
	**/
	validateNewUser(req.body, function(err, newUser) {
		if (err) {
			flasher.flash(req, err, true);
			res.redirect('back');
			return;
		}
		bcrypt.hash(newUser.password, 10).then((hash) => {
			var copain = Users.create({
 				nom: newUser.nom,
 				email: newUser.email,
 				password: hash,
 			});
 			flasher.flash(req, `Bienvenue ${copain.nom}!`);
 			res.redirect('/');
		});
	});
});


module.exports = router;
