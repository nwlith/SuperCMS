const Sequelize = require('sequelize');
const db = require('./db');

/* définit un nouveau modèle */
const Article = db.define('article', {
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
  keyword: {
    type: Sequelize.STRING,
  },
});

/* crée la table pour de bon, si elle n'existe pas */
Article.sync().then(function() {
  console.log(':)');
});

module.exports = Article;
