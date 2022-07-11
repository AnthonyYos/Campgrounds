// src https://github.com/saintedlama/passport-local-mongoose/tree/main/examples/login
const User = require('../models/user');

const registerForm = (req, res) => {
  res.render('users/register');
};

const registerUser = async (req, res, next) => {
  try {
    const { email, username, password, passwordConfirm } = req.body;
    if (password !== passwordConfirm) throw error;
    const user = new User({ email, username });
    user.roles.push('user');
    // .register(user, password, cb) Convenience method to register a new user instance with a given password. Checks if username is unique.
    const registeredUser = await User.register(user, password);
    // req.login given by passport, use to login user after registeration
    req.login(registeredUser, (err) => {
      if (err) return next(err);
      req.flash('success', 'Register Successful');
      res.redirect('/campgrounds');
    });
  } catch (e) {
    req.flash('error', 'Username taken or passwords did not match.');
    res.redirect('register');
  }
};

const loginForm = (req, res) => {
  res.render('users/login');
};

const login = (req, res) => {
  // returnTo doesn't working w/ express V0.60 due to bugs
  const redirectUrl = req.session.returnTo || '/campgrounds';
  delete req.session.returnTo;
  res.redirect(redirectUrl);
};

const logout = (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    const redirectUrl = req.session.returnTo || '/campgrounds';
    req.flash('success', 'Logged Out');
    res.redirect(redirectUrl);
  });
};

module.exports = {
  registerForm,
  registerUser,
  loginForm,
  login,
  logout,
};
