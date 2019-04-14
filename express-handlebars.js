let path = require('path');
let exphbs = require('express-handlebars');
let HandlebarsIdom = require('handlebars-idom');

let instance = exphbs.create({
  defaultLayout: 'main.hbs',
  extname: '.hbs',
  handlebars: HandlebarsIdom,
  partialsDir: path.resolve(__dirname, './views/partials'),
});

module.exports = instance;
