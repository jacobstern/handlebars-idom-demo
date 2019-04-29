# handlebars-inc-demo

This app demonstrates a basic usage of isomorphic Handlebars templates with
[handlebars-inc](https://github.com/jacobstern/handlebars-inc). The Handlebars
template for the UI is initially rendered on the server in
[routes/search.js](routes/search.js) and then updated on the client using AJAX
in [search-page.js](assets/js/search-page.js). This enables a fluid user
experience with good performance without requiring a UI framework or complex DOM
manipulation on the client.

## Running the application

```bash
npm install
npm run dev

```
