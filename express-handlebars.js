const path = require('path');
const exphbs = require('express-handlebars');
const HandlebarsInc = require('handlebars-inc');

const instance = exphbs.create({
  defaultLayout: 'main.hbs',
  extname: '.hbs',
  handlebars: HandlebarsInc,
  partialsDir: path.resolve(__dirname, './views/partials'),
});

module.exports = instance;
