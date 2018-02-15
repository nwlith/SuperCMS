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

const Videos = db.define('video', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
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
    type: Sequelize.STRING,
  }
});

/* Associe des thèmes aux références et des références aux thèmes */
Articles.belongsToMany(Themes, { through: 'ArticlesThemes' });
Themes.belongsToMany(Articles, { through: 'ArticlesThemes' });
Images.belongsToMany(Themes, { through: 'ImagesThemes'});
Themes.belongsToMany(Images, { through: 'ImagesThemes'});
Videos.belongsToMany(Themes, { through: 'VideosThemes' });
Themes.belongsToMany(Videos, { through: 'VideosThemes'});

module.exports = {
  Articles,
  Themes,
  Images,
  Videos,
};
