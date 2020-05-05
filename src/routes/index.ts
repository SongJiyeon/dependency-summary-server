import { Router } from 'express';
import jwt from 'jsonwebtoken';
import _ from 'lodash';

import User, { UserType } from '../models/User';
import Module from '../models/Module';
import { findModules } from '../../util/index';
import { JsonWebTokenError } from 'jsonwebtoken';

const router = Router();

router.post('/module_usage', (req, res, next) => {
  const modules = findModules(req.body.path);
  const secret: string | undefined = process.env.JWT_SECRET;

  const verifiedJWT: any = secret && jwt.verify(req.body.jwtToken, secret);

  _.uniq(modules).forEach(async module => {
    const user = (await Module.exists({ name: module })) ?
    await Module.findOneAndUpdate({ name: module },
    {
      $inc: { value: 1 }
    })
    : await Module.create({
      name: module,
      value: 1
    });

    await User.findByIdAndUpdate(verifiedJWT.user._id, {
      $push: {
        moduleUsed: {
          name: module,
          value: 1
        }
      }
    });
  });

  res.json({ modules });
});
 
export default router;
