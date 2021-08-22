const express = require('express');
const db = require('../models/db');
const router = express.Router();
const jwt = require('jsonwebtoken');
//Middlewares
const auth = require('../middlewares/auth');
const { query } = require('express');

const SECRET_KEY = 'jayanth@123';
//Register Route
router.post('/register', async (req, res) => {
  try {
    let name = req.body.name || '';
    let contact = req.body.contact || '';
    let address = req.body.address || '';
    let gender = req.body.gender || '';
    let country = req.body.country || '';

    if (name && contact && address && gender && country) {
      let InsertQuery = `INSERT INTO users (name,contact,address,gender,country,islogged)VALUES('${name}','${contact}','${address}','${gender}','${country}',0)`;
      let InsertResults = await db.query(InsertQuery);
      let results = InsertResults.results;
      if (results.affectedRows === 1) {
        res.send({
          message: `Registration Successful for user ${name}`,
        });
      } else {
        res.status(400).send({
          message: 'Try Again',
        });
      }
    } else {
      res.status(400).send({
        message: 'Missing Fields',
      });
    }
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      res.status(406).send({
        message: 'Name /Contact Already Exist, Please use different one',
      });
    } else {
      res.status(400).send({
        message: 'Error Try Again',
      });
    }
  }
});

//Login Route
router.post('/login', async (req, res) => {
  try {
    let name = req.body.name || '';
    if (name.trim().length > 0) {
      let loginQuery = `SELECT id,name from users where name ='${name}'`;
      let loginResults = await db.query(loginQuery);
      let results = loginResults.results;
      if (results.length > 0) {
        let id = results[0].id;
        let updateQuery = `UPDATE users SET islogged = 1 WHERE id = ${id}`;
        await db.query(updateQuery);
        const token = jwt.sign(
          {
            userId: id,
          },
          SECRET_KEY,
          {
            expiresIn: '3h',
          }
        );
        res.send({
          token: token,
        });
      } else {
        res.status(406).send({
          message: 'Name not registered .Please Register',
        });
      }
    } else {
      res.send({
        message: 'Enter Name to Login',
      });
    }
  } catch (error) {
    res.send({
      message: error,
    });
  }
});

//Search Users
router.get('/search/:query', auth, async (req, res) => {
  try {
    let query = req.params.query;
    let searchQuery = `SELECT * FROM users WHERE name LIKE '%${query}%'`;
    let searchResults = await db.query(searchQuery);
    let results = searchResults.results;
    res.send({
      message: results,
    });
  } catch (error) {
    res.send({
      message: error,
    });
  }
});

//Logout User and Invalidate JWT

router.get('/logout', auth, async (req, res) => {
  try {
    let id = req.userId;
    let updateQuery = `UPDATE users SET islogged = 0 WHERE id = ${id}`;
    await db.query(updateQuery);
    res.send({
      message: 'Logged Out Successfully',
    });
  } catch (error) {
    res.send({
      message: error,
    });
  }
});

module.exports = router;
