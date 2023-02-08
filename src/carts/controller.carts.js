import { Router } from 'express';

const router = Router();

router.get('/', (req, res) => {
    res.send('Hi from carts');
})

export default router;