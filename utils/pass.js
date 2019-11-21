'use strict';
const passport = require('passport');
const Strategy = require('passport-local').Strategy;

const users = [
  {
    user_id: 1,
    name: 'Foo Bar',
    email: 'foo@bar.fi',
    password: 'foobar',
  },
  {
    user_id: 2,
    name: 'Bar Foo',
    email: 'bar@foo.fi',
    password: 'barfoo',
  },
];

const getUserById = (id) => {
  console.log('id', id);
  const user = users.filter((usr) => {
    if (usr.user_id === id) {
      return usr;
    }
  });
  return user[0];
};

const getUserLogin = (email, pass) => {
  const user = users.filter((usr) => {
    console.log(email, pass);
    if (usr.email === email && usr.password === pass) {
      return usr;
    }
  });
  return user[0];
};

// serialize: store user id in session
passport.serializeUser((id, done) => {
  // serialize user id by adding it to 'done()' callback
  console.log('serialize', id);
  done(null, id);
});

// deserialize: get user id from session and get all user data
passport.deserializeUser(async (id, done) => {
  // get user data by id from users
  const user = getUserById(id);
  console.log('deserialize', user);
// deserialize user by adding it to 'done()' callback
  done(null, user);
});

passport.use(new Strategy(
    async (username, password, done) => {
      // if username and password match user.email and user.password in users
      const user = getUserLogin(username, password);
      console.log(user);
      if (user === undefined) {
        return done(null, false);
      } else {
        return done(null, user.user_id);
      }
    },
));

module.exports = passport;
