const Sequelize = require('sequelize');
const db = require('./db');
const host = req.host;
const filePath = req.protocol + "://" + host + '/' + req.file.path;

/* définit constructeur reference */
const References = db.define('reference', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  titre: {
    type: Sequelize.STRING,
  },
  image: {
    type: Sequelize.TEXT,
  },
  contenu: {
    type: Sequelize.TEXT,
  },
});

/* définit constructeur image (?)*/
const Images = multer.diskStorage({
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  destination: '/images',
  filename: function (req, file, callback) {
    crypto.pseudoRandomBytes(16, function(err, raw) {
      if (err) return callback(err);
      callback(null, raw.toString('hex') + path.extname(file.originalname));
    });
  },
});

/* Definition du constructeur Themes */
const Themes = db.define('themes', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nom: {
    type: Sequelize.STRING,
  },
});

/* Associe des thèmes aux références et des références aux thèmes */
References.belongsToMany(Themes, {through: 'ReferencesThemes'});
Themes.belongsToMany(References, {through: 'ReferencesThemes'});

db.sync({force:true});

module.exports = {
  References,
  Themes,
};
