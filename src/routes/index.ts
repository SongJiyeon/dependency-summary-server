import { Router } from 'express';

import UserRouter from './Users';
import { findModules } from '../../util/index';

const router = Router();

router.use('/users', UserRouter);

router.post('/module_usage', (req, res, next) => {
  const modules = findModules(req.body.path);

  res.json({ modules });
});
 
export default router;
