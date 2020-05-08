import { Router } from 'express';

const router = Router();

router.get('/', (req, res) => {
  res.render('index', { text: 'index page' });
});

export default router;
