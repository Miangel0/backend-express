const connectionString = `${process.env.DATABASE_URL}`;
const { PrismaPg } = require('@prisma/adapter-pg');
const { PrismaClient } = require('../../generated/prisma');
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

exports.getUserAppointment = async (userId) =>{
    try {
        const appointments = await prisma.appointment.findMany({
            where: {
                userId: parseInt(userId)
            },
            include: {
                timeBlock: true
            }
        });
        return appointments
    } catch (error) {
        throw new Error('Error al obtener el historial de ciitas');
    }
}