import express from 'express'
const router = express.Router()
import { v4 } from 'uuid'
import { PrismaClient } from "../../node_modules/.prisma/client/index";
import { AuthorizeAdmin } from '../middleware';

const prisma = new PrismaClient();

router.post('/effectivePrice', async (req, res) => {
    const { date } = req.body;

    try {
        const prevRate = await prisma.rates.findFirst({
            where: {
                effectiveDate: {
                    lte: new Date(date).toISOString()
                },
                deleted_at: null
            },
            orderBy: {
                effectiveDate: 'desc'
            },
            select: {
                annualExpenses: true,
                endowment: true,
                maintenance: true,
                miscellaneous: true,
                priestsHonorarium: true
            }
        });

        if (!prevRate) {
            return res.status(404).json({ error: 'No Rate exists before today`s date, please try again later.' });
        }

        const { annualExpenses, endowment, maintenance, miscellaneous, priestsHonorarium } = prevRate;
        const totalSum = annualExpenses + endowment + maintenance + miscellaneous + priestsHonorarium;

        console.log(prevRate, totalSum)

        res.status(200).json({ totalSum });
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while fetching the rate.' });
        console.log(error)
    }
});


router.post("/create", AuthorizeAdmin, async (req, res) => {
    const { effectiveDate, priestsHonorarium, annualExpenses, maintenance, endowment, miscellaneous } = req.body;
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0)
    console.log(currentDate, effectiveDate)

    if (new Date(effectiveDate) < currentDate) {
        return res.status(400).json({ error: 'Effective date must be in the future' });
    }

    try {
        const rate = await prisma.rates.create({
            data: {
                id: v4(),
                effectiveDate,
                priestsHonorarium,
                annualExpenses,
                maintenance,
                endowment,
                miscellaneous
            }
        });

        res.status(201).json(rate);
    } catch (error: any) {
        if (error.code === 'P2002') {
            res.status(400).json({ error: 'Email already exists' });
        } else {
            res.status(500).json({ error: 'Internal Server Error' });
            console.log(error);
        }
    }
});



router.post('/get', AuthorizeAdmin, async (req, res) => {
    const { page_number = 1, page_size = 10, sort, search } = req.body;

    const pageNumber = parseInt(page_number);
    const pageSize = parseInt(page_size);

    let orderBy = {};

    if (sort) {
        const { column_name, isAscending } = sort;
        orderBy = {
            [column_name]: isAscending ? 'asc' : 'desc'
        };
    }

    let where = {};

    if (search) {
        const { column_name, search_term } = search;
        where = {
            [column_name]: {
                contains: search_term
            }
        };
    }

    try {
        const rates = await prisma.rates.findMany({
            where,
            orderBy,
            skip: (pageNumber - 1) * pageSize,
            take: pageSize,
        });

        // Convert effectiveDate to string
        const ratesWithFormattedDate = rates.map(rate => ({
            ...rate,
            effectiveDate: rate.effectiveDate.toLocaleDateString()
        }));

        const totalRatesCount = await prisma.rates.count({ where });

        const results = {
            current_page: pageNumber,
            page_size: Math.ceil(totalRatesCount / pageSize),
            total_rows: totalRatesCount,
            data: ratesWithFormattedDate,
        };

        res.json(results);
    } catch (error) {
        console.error('Error fetching rates:', error);
        res.status(500).json({ error: 'Failed to fetch rates' });
    }
});


router.put('/update/:id', AuthorizeAdmin, async (req, res) => {
    const rateId = req.params.id;
    const { effectiveDate, priestsHonorarium, annualExpenses, maintenance, endowment, miscellaneous } = req.body;
    const currentDate = new Date()

    console.log(req.body)

    try {
        if (new Date(effectiveDate) > currentDate) {
            const updatedRate = await prisma.rates.update({
                where: { id: rateId },
                data: {
                    effectiveDate: new Date(effectiveDate),
                    priestsHonorarium,
                    annualExpenses,
                    maintenance,
                    endowment,
                    miscellaneous
                },
            });
            res.status(201).json(updatedRate);
        } else res.status(400).json({ error: 'Effective date must be in the future' })


    } catch (error) {
        console.error('Error updating rate:', error);
        res.status(500).json({ error: 'Failed to update rate' });
    }
});

router.delete('/delete/:id', AuthorizeAdmin, async (req, res) => {
    const rateId = req.params.id;
    const currentDateTime = new Date().toISOString()

    try {
        const updatedRate = await prisma.rates.update({
            where: { id: rateId },
            data: {
                deleted_at: currentDateTime
            },
        });

        res.status(201).json(updatedRate);
    } catch (error) {
        console.error('Error updating rate:', error);
        res.status(500).json({ error: 'Failed to update rate' });
    }
})

export default router;