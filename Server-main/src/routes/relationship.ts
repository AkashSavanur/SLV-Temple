import express from 'express'
const router = express.Router()
import {v4} from 'uuid'
import { PrismaClient } from "../../node_modules/.prisma/client/index";
import { AuthorizeUser } from '../middleware';

const prisma = new PrismaClient();

router.post('/create', async(req, res) => {
    const {user_id, relation, details} = req.body;

    try{
        console.log('body', req.body)
        const relationship = await prisma.relationship.create({
            data: {
                id: v4(),
                user_id,
                relation,
                details
            }
        })

        res.status(201).json(relationship)
    }catch(error: any){
        res.status(500).json({ error: 'Internal Server Error' });
        console.log(error)
    }
})

router.post('/get', async (req, res) => {
    const { page_number = 1, page_size = 10, sort, search, user_id } = req.body;
    console.log(req.body)

    const pageNumber = parseInt(page_number, 10);
    const pageSize = parseInt(page_size, 10);

    let orderBy: { [key: string]: 'asc' | 'desc' } = {};

    if (sort) {
        const { column_name, isAscending } = sort;
        orderBy[column_name] = isAscending ? 'asc' : 'desc';
    }

    let where: { [key: string]: any } = { user_id };

    if (search) {
        const { column_name, search_term } = search;
        where[column_name] = {
            contains: search_term
        };
    }

    try {
        const relationships = await prisma.relationship.findMany({
            where,
            orderBy,
            skip: (pageNumber - 1) * pageSize,
            take: pageSize,
        });

        const totalRelationshipsCount = await prisma.relationship.count({ where });

        const results = {
            current_page: pageNumber,
            page_size: pageSize,
            total_rows: totalRelationshipsCount,
            data: relationships,
        };

        res.json(results);
    } catch (error) {
        console.error('Error fetching relationships:', error);
        res.status(500).json({ error: 'Failed to fetch relationships' });
    }
});

router.put('/update/:id', async (req, res) => {
    const relationId = req.params.id;
    const { user_id, relation, details} = req.body;

    try {
        const updatedRelationship = await prisma.relationship.update({
            where: { id: relationId },
            data: {
                user_id,
                relation,
                details
            },
        });

        res.status(201).json(updatedRelationship);
    } catch (error) {
        console.error('Error updating relationship:', error);
        res.status(500).json({ error: 'Failed to update relationship' });
    }
});

router.delete('/delete/:id', async(req, res) => {
    const relationshipId = req.params.id
    try{
        const deletedRelationship = await prisma.relationship.delete({
            where: {id: relationshipId}
        })
        res.status(201).json(deletedRelationship);
    }catch(error) {
        console.error('Error deleted relationship:', error);
        res.status(500).json({ error: 'Failed to delete relationship' });
    }
    
})

export default router