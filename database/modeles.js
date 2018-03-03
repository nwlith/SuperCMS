const Sequelize = require('sequelize');
const db = require('./db');


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
  couleur: {
    type: Sequelize.STRING,
  },
  description: {
    type: Sequelize.TEXT,
  },
});

/* définit constructeur référence */
const References = db.define('references', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  classe: {
    type: Sequelize.STRING,
  },
  titre: {
    type: Sequelize.STRING,
  },
  auteur: {
    type: Sequelize.STRING,
  },
  description: {
    type: Sequelize.TEXT,
  },
  path : {
    type: Sequelize.STRING,
  },
  lien : {
    type: Sequelize.STRING,
  },
  date: {
    type: Sequelize.DATE,
  },
});

/* Associe des thèmes aux références et des références aux thèmes */

Themes.belongsToMany(References, { through: 'ReferencesThemes'});
References.belongsToMany(Themes, { through: 'ReferencesThemes' });

db.sync({ });

module.exports = {
  References,
  Themes,
};
