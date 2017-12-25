const Sequelize = require('sequelize');
const db = require('./db');

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
