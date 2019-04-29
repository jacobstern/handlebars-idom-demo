const path = require('path');
const exphbs = require('express-handlebars');
const HandlebarsInc = require('handlebars-inc');
const { registerVerbatimHelper } = require('handlebars-inc-verbatim');

function initHandlebars() {
  const instance = HandlebarsInc.create();
  registerVerbatimHelper(instance);
  return instance;
}

function initExpressHandlebars() {
  return exphbs.create({
    defaultLayout: 'main.hbs',
    extname: '.hbs',
    handlebars: initHandlebars(),
    partialsDir: path.resolve(__dirname, './views/partials'),
  });
}

module.exports = initExpressHandlebars();
