import { Router } from 'express';

const jwt = require('jsonwebtoken')
const User = require('../models/User');

import axios from 'axios';

const router = Router();

router.get('/login', (req, res, next) => {
  axios({
    method: 'post',
    url: 'https://github.com/login/oauth/access_token',
    headers: { 'Accept': 'application/json' },
    params: {
      'client_id': process.env.GITHUB_CLIENT_ID,
      'client_secret': process.env.GITHUB_CLIENT_SECRET,
      'code': req.query.code
    }
  })
  .then(response => {
    axios({
      method: 'get',
      url: 'https://api.github.com/user',
      headers: { 'Authorization': 'token ' + response.data.access_token }
    })
    .then(async response => {
      let user = await User.findOne({ node_id: response.data.node_id });

      if (!user) {
        user = await User.create({ ...response.data });
      }

      const token = jwt.sign({ user }, process.env.JWT_SECRET);
      console.log(token);
      return res.json({ "result": "ok", token });
    })
    .catch(error => console.log(error));
  })
  .catch(error => {
    console.log('error ' + error);
  });
});

// Export the base-router
export default router;
