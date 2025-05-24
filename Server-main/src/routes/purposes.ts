import express from 'express'
const router = express.Router()
import {v4} from 'uuid'
import { PrismaClient } from "../../node_modules/.prisma/client/index";
import { AuthorizeAdmin } from '../middleware';

const prisma = new PrismaClient();

router.post("/create", AuthorizeAdmin, async (req, res) => {
    const { name, description } = req.body;
    try {
        const purpose = await prisma.purposes.create({
            data: {
                id: v4(),
                name,
                description
            }
        })
        res.status(201).json(purpose)
    } catch (error: any) {
        res.status(500).json({ error: 'Internal Server Error' });
        console.log(error)
    }
});


router.post('/get', async (req, res) => {
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
        const purposes = await prisma.purposes.findMany({
            where,
            orderBy,
            skip: (pageNumber - 1) * pageSize,
            take: pageSize,
        });

        const totalPurposesCount = await prisma.purposes.count({ where });

        const results = {
            current_page: pageNumber,
            page_size: Math.ceil(totalPurposesCount / pageSize),
            total_rows: totalPurposesCount,
            data: purposes,
        };

        res.json(results);
    } catch (error) {
        console.error('Error fetching purposes:', error);
        res.status(500).json({ error: 'Failed to fetch purposes' });
    }
});

router.put('/update/:id', AuthorizeAdmin, async (req, res) => {
    const purposeId = req.params.id;
    const { name, description } = req.body;

    try {
        const updatedPurpose = await prisma.purposes.update({
            where: { id: purposeId },
            data: {
                name,
                description,
            },
        });

        res.status(201).json(updatedPurpose);
    } catch (error) {
        console.error('Error updating purpoes:', error);
        res.status(500).json({ error: 'Failed to update purpose' });
    }
});

router.put('/delete/:id', AuthorizeAdmin, async(req, res) => {
    const purposeId = req.params.id;
    const currentDateTime = new Date().toISOString()

    try {
        const updatedPurpose = await prisma.purposes.update({
            where: { id: purposeId },
            data: {
                deleted_at: currentDateTime
            },
        });

        res.status(201).json(updatedPurpose);
    } catch (error) {
        console.error('Error updating purpoes:', error);
        res.status(500).json({ error: 'Failed to update purpose' });
    }
})

export default router;