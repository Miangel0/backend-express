const connectionString = `${process.env.DATABASE_URL}`;
const { PrismaPg } = require('@prisma/adapter-pg');
const { PrismaClient } = require('../../generated/prisma');
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

exports.createReservation = async data => {
    const conflict = await prisma.appointment.findFirst({
        where: {
            date: data.date,
            timeBlockId: data.timeBlockId
        }
    });
    if (conflict) {
        throw new Error('El horario ya estaba reservado');
    }
    return prisma.appointment.create({ data });
}

exports.getReservation = (id) => {
    return prisma.appointment.findUnique({
        where: { id: parseInt(id, 10) }
    });
}

exports.updateReservation = async (id, data) => {
    const conflict = await prisma.appointment.findFirst({
        where: {
            date: data.date,
            timeBlockId: data.timeBlockId,
            id: { 
                not: parseInt(id, 10) 
            }
        }
    });
    if (conflict) {
        throw new Error('El horario ya estaba reservado');
    }
    return prisma.appointment.update({
        where: {
            id: parseInt(id,10),
        },
        data
    });
}

exports.deleteReservation = (id) =>{
    return prisma.appointment.delete({ 
        where: {
            id: parseInt(id, 10)
        }
    });
}