/*
  Genère une chaine de caractères pseudo-aléatoire de (par défaut) 64 caractères, pour les noms de fichiers
*/

var dummyRandomString = function dummyRandomString(length = 64) {
  var chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  var charsArray = chars.split('');
  var charsCount = charsArray.length;
  var str = '';
  while (str.length < length) {
    str = str + chars[Math.floor(Math.random() * charsCount)];
  }
  return str;
};

 module.exports = dummyRandomString;
