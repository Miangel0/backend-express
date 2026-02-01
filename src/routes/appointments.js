const { Router } = require('express');
const authenticateToken = require('../middlewares/auth')
const appointmentController = require('../controllers/appointmentController')
const router = Router();

router.get('/:id/appointments', authenticateToken, appointmentController.getUserAppointment);

module.exports = router;