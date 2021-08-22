const jwt = require('jsonwebtoken');
const db = require('../models/db');
const SECRET_KEY = 'jayanth@123';
module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
    return res.status(404).send({
      message: 'Missing Authorisation',
    });
  }
  const token = authorization.replace('Bearer ', '');
  jwt.verify(token, SECRET_KEY, async (err, payload) => {
    if (err) {
      return res.status(404).send({
        message: 'Missing Authorisation',
      });
    }
    req.userId = payload.userId;
    let Query = `SELECT islogged FROM users WHERE id = ${req.userId}`;
    let islogged = await db.query(Query);
    let status = islogged.results[0].islogged;
    if (status == 1) {
      next();
    } else {
      res.status(404).send({
        message: 'User Already Logged Out of this system, Using Wrong Token',
      });
    }
  });
};
