const Sequelize = require('sequelize');
const db = require('./db');


/* définit constructeur référence
const References = db.define('reference', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  attribut:{
    type: Sequelize.STRING,
  },
  titre: {
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
  /*date: {
    type: Sequelize.STRING,
  },
});
*/

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
  /*date: {
    type: Sequelize.STRING,
  },*/
});

/* définit constructeur image */
const Images = db.define('images', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  /*date: {
    type: Sequelize.STRING,
  },*/
  titre : {
    type : Sequelize.STRING,
  },
  description : {
    type : Sequelize.TEXT,
  },
  path : {
    type : Sequelize.STRING,
  },
});

const Videos = db.define('video', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  /*date: {
    type: Sequelize.STRING,
  },*/
  titre: {
    type: Sequelize.STRING,
  },
  lien: {
    type: Sequelize.STRING,
  },
  description: {
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
  couleur: {
    type: Sequelize.STRING,
  },
  description: {
    type: Sequelize.TEXT,
  }
});

/* Associe des thèmes aux références et des références aux thèmes */
Articles.belongsToMany(Themes, { through: 'ArticlesThemes' });
Themes.belongsToMany(Articles, { through: 'ArticlesThemes' });
Images.belongsToMany(Themes, { through: 'ImagesThemes'});
Themes.belongsToMany(Images, { through: 'ImagesThemes'});
Videos.belongsToMany(Themes, { through: 'VideosThemes' });
Themes.belongsToMany(Videos, { through: 'VideosThemes'});
Articles.belongsToMany(Images, { through: 'ArticlesImages' });
Images.belongsToMany(Articles, { through: 'ArticlesImages' });

/*
Themes.belongsToMany(References, { through: 'ReferencesThemes'});
References.belongsToMany(Themes, { through: 'ReferencesThemes' });
*/

module.exports = {
  Articles,
  Themes,
  Images,
  Videos,
};
