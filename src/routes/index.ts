import { Router } from 'express';
import _ from 'lodash';

import Module from '../models/Module';
import { findModules } from '../../util/index';

const router = Router();

router.post('/module_usage', (req, res, next) => {
  const modules = findModules(req.body.path);

  _.uniq(modules).forEach(async module => {
    (await Module.exists({ name: module })) ?
    await Module.findOneAndUpdate({ name: module }, { $inc: { value: 1 } })
    : await Module.create({ name: module, value: 1 });
  });

  res.json({ modules });
});
 
export default router;
