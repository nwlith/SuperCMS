const Sequelize = require('sequelize');
const db = require('./db');


/* définit constructeur article */
const Articles = db.define('article', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  titre: {
    type: Sequelize.STRING,
  },
  contenu: {
    type: Sequelize.TEXT,
  },
});

/* définit constructeur image */
const Images = db.define('images', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  titre : {
    type : Sequelize.STRING,
  },
  description : {
    type : Sequelize.TEXT,
  },
  path : {
    type : Sequelize.STRING,
  }
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
Articles.belongsToMany(Themes, {through: 'ArticlesThemes'});
Themes.belongsToMany(Articles, {through: 'ArticlesThemes'});

db.sync({force:true});

module.exports = {
  Articles,
  Themes,
  Images,
};
