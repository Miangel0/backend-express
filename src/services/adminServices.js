const connectionString = `${process.env.DATABASE_URL}`;
const { PrismaPg } = require('@prisma/adapter-pg');
const { PrismaClient } = require('../../generated/prisma');
const { createECDH } = require('crypto');
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

const createTimeBlockService = async (startTime, endTime) => {
    const newTimeBlock = await prisma.timeBlock.create({
        data: {
            startTime: new Date(startTime),
            endTime: new Date(endTime)
        }
    });
    return newTimeBlock
}

const listReservationsService = async () => {
    const reservations = await prisma.appointment.findMany({
        include: {
            user: true,
            timeBlock: true
        }
    });
    return reservations

}

module.exports = {createTimeBlockService, listReservationsService};