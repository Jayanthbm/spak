const jwt = require('jsonwebtoken');

const SECRET_KEY = 'jayanth@123';
module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
    return res.send({
      message: 'Missing Authorisation',
    });
  }
  const token = authorization.replace('Bearer ', '');
  jwt.verify(token, SECRET_KEY, async (err, payload) => {
    if (err) {
      return res.send({
        message: 'Missing Authorisation',
      });
    }
    req.userId = payload.userId;
    next();
  });
};
