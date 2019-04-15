const path = require('path');
const exphbs = require('express-handlebars');
const HandlebarsIdom = require('handlebars-idom');

const instance = exphbs.create({
  defaultLayout: 'main.hbs',
  extname: '.hbs',
  handlebars: HandlebarsIdom,
  partialsDir: path.resolve(__dirname, './views/partials'),
});

module.exports = instance;
