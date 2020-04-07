'use strict';
const express = require('express');
const session = require('express-session');
const passport = require('./utils/pass');
const app = express();
const port = 3000;

const loggedIn = (req, res, next) => {
  console.log('logged', req.user);
  if (req.user) {
    next();
  } else {
    res.redirect('/form');
  }
};

app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({extended: true})); // for parsing application/x-www-form-urlencoded

const username = 'foo';
const password = 'bar';

app.use(session({
  secret: 'salainen kissa',
  resave: false,
  saveUninitialized: true,
}));

app.use(passport.initialize());
app.use(passport.session());

app.set('views', './views');
app.set('view engine', 'pug');

app.get('/', (req, res) => {
  res.render('home');
});

app.get('/setCookie/:clr', (req, res) => {
  res.cookie('color', req.params.clr).send('cookie set');
});

app.get('/deleteCookie', (req, res) => {
  res.clearCookie('color');
  res.send('cookie color cleared');
});

app.get('/form', (req, res) => {
  res.render('form');
});

app.get('/secret', loggedIn, (req, res) => {
  res.render('secret');
});

app.post('/login',
    passport.authenticate('local', {failureRedirect: '/form'}),
    (req, res) => {
      console.log('success');
      res.redirect('/secret');
    });

app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/form');
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
