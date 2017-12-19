const Sequelize = require('sequelize');
const db = require('./db');

/* définit constructeur Article */
const Article = db.define('article', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  titre: {
    type: Sequelize.STRING,
  },
  chapo: {
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

/* Associe des thèmes aux articles et des articles aux thèmes */
Article.belongsToMany(Themes, {through: 'ArticlesThemes'});
Themes.belongsToMany(Article, {through: 'ArticlesThemes'});

db.sync();

module.exports = {
  Article,
  Themes,
};
