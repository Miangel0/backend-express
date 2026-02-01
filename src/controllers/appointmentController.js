const appointmentService = require('../services/appointmentService');

exports.getUserAppointment = async (req, res) => {
    try {
        const userId = req.params.id;
        const appointments = await appointmentService.getUserAppointment(userId);
        res.json(appointments)
    } catch (error) {
        return res.status(401).json({ error: 'Error al obtener el historial de citas' })
    }
}
