import { Router } from 'express';
import axios from 'axios';
import jwt from 'jsonwebtoken';

import User, { UserType } from '../models/User';

const router = Router();

router.get('/login/callback', (req, res) => {
  console.log(req);
  res.json({ 'result': 'ok' });
});

router.get('/login', (req, res, next) => {
  console.log(req.query.client_id);
  axios({
    method: 'get',
    url: 'https://github.com/login/oauth/authorize',
    params: {
      client_id: req.query.client_id,
      redirect_uri: 'http://localhost:8080/auth/login/callback'
    }
  });
  res.json({ 'result': 'ok' });
});

router.post('/login', async (req, res, next) => {
  console.log(req);
  const githubUser: UserType = (
    await axios({
      method: 'get',
      url: 'https://api.github.com/user',
      headers: { 'Authorization': 'token ' + req.body.access_token }
    })
  ).data;

  const user = (await User.exists({ node_id: githubUser.node_id })) ?
  await User.findOne({ node_id: githubUser.node_id })
  : await User.create({ ...githubUser });

  const secret: string | undefined = process.env.JWT_SECRET;
  const jwtToken = secret && jwt.sign({ user }, secret);
  
  res.header({ jwttoken: jwtToken }).json({ 'result': 'ok' });
});

export default router;
