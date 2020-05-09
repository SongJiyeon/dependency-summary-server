import { Router } from 'express';
import jwt from 'jsonwebtoken';
import _ from 'lodash';

import User from '../models/User';
import Module from '../models/Module';

const router = Router();

router.post('/module_usage', (req, res, next) => {
  const modules: string[] = req.body.modules;
  const secret: string | undefined = process.env.JWT_SECRET;

  const verifiedUser: any = secret && jwt.verify(req.body.jwtToken, secret);

  _.uniq(modules).forEach(async (module: string) => {
    (await Module.exists({ name: module })) ?
    await Module.findOneAndUpdate({ name: module }, {
      $inc: {
        value: 1
      }
    })
    : await Module.create({ name: module, value: 1 });

    const moduleInUser = await User.findOne({
      '_id': verifiedUser.user._id,
      'moduleUsed.name': module
    });

    moduleInUser ?
    await User.findOneAndUpdate({
      '_id': verifiedUser.user._id,
      'moduleUsed.name': module
    }, {
      $inc: {
        'moduleUsed.$.value': 1
      }
    })
    : await User.findByIdAndUpdate(verifiedUser.user._id, {
      $push: {
        moduleUsed: {
          name: module,
          value: 1
        }
      }
    });
  });

  res.json({ 'result': 'ok' });
});

router.post('/top5', async (req, res, next) => {
  const secret: string | undefined = process.env.JWT_SECRET;

  const verifiedUser: any = secret && jwt.verify(req.body.jwttoken, secret);
  const user = await User.findById(verifiedUser.user._id);
  const userTop5 = _.take(_.orderBy(user?.moduleUsed, 'value', 'desc'), 5);
  const totalTop5 = await Module.find().sort({ value: -1 }).limit(5);
  
  res.json({ userTop5, totalTop5 });
});

router.get('/hello', (req, res) => {
  res.render('index', { text: 'hello' });
});

router.post('/hello', (req, res, next) => {
  console.log(req.body);

  res.json({ 'result': 'ok' });
});
 
export default router;
