const { Router } = require('express');
const authRouter = require('./auth')
const adminRouter = require('./admin')
const translationsRouter = require('./translations')
const router = Router();

router.use('/auth', authRouter);
router.use('/admin', adminRouter)
router.use('/translations', translationsRouter)

module.exports = router;