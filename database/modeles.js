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
  description : {
    type : Sequelize.STRING,
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
References.belongsToMany(Themes, {through: 'ReferencesThemes'});
Themes.belongsToMany(References, {through: 'ReferencesThemes'});

db.sync({force:true});

module.exports = {
  References,
  Themes,
  Images,
};
