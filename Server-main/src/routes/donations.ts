import express from 'express'
const router = express.Router()
import {v4} from 'uuid'
import { PrismaClient } from "../../node_modules/.prisma/client/index";
import Papa from 'papaparse'

const prisma = new PrismaClient();

function flattenData(data:any) {
    if (!Array.isArray(data)) {
        throw new Error('Data is not an array');
    }
    return data.map((item) => {
        const { 
            id, user_id, comments, amount, status, recipient_name, purpose_id, 
            created_at, updated_at, deleted_at, 
            transaction, user, purpose 
        } = item;

        return {
            donation_id: id,
            user_id,
            comments,
            amount,
            status,
            recipient_name,
            purpose_id,
            transaction_id: transaction?.id,
            transaction_mode: transaction?.mode,
            bank_name: transaction?.details?.bank_name,
            receipt_url: transaction?.details?.receipt_url,
            payment_date: transaction?.details?.payment_date,
            cheque_number: transaction?.details?.cheque_number,
            receipt_number: transaction?.details?.receipt_number,
            donation_created_at: created_at,
            donation_updated_at: updated_at,
            donation_deleted_at: deleted_at,
            user_first_name: user?.first_name,
            user_last_name: user?.last_name,
            user_DOB: user?.DOB,
            user_email: user?.email,
            user_phone_number: user?.phone_number,
            user_nakshatra: user?.nakshatra,
            user_rashi: user?.rashi,
            user_gothra: user?.gothra,
            user_isAdmin: user?.roles?.isAdmin,
            user_isDonor: user?.roles?.isDonor,
            user_isAdoptor: user?.roles?.isAdoptor,
            user_created_at: user?.created_at,
            user_updated_at: user?.updated_at,
            user_deleted_at: user?.deleted_at,
            purpose_name: purpose?.name,
            purpose_description: purpose?.description,
            purpose_created_at: purpose?.created_at,
            purpose_updated_at: purpose?.updated_at,
            purpose_deleted_at: purpose?.deleted_at
        };
    });
}


router.post('/csv', async (req, res) => {
    const { page_number, page_size = 10, sort, search } = req.body;

    const pageNumber = page_number ? parseInt(page_number) : null;
    const pageSize = parseInt(page_size);

    let orderBy = {};

    if (sort) {
        const { column_name, isAscending } = sort;

        // Check if the column_name indicates a nested relation
        if (column_name.includes('.')) {
            const [relation, field] = column_name.split('.');
            orderBy = {
                [relation]: {
                    [field]: isAscending ? 'asc' : 'desc',
                },
            };
        } else {
            orderBy = {
                [column_name]: isAscending ? 'asc' : 'desc',
            };
        }
    }

    let where = {};

    if (search) {
        const { column_name, search_term } = search;

        // Check if the column_name indicates a nested relation
        if (column_name.includes('.')) {
            const [relation, field] = column_name.split('.');
            where = {
                [relation]: {
                    [field]: {
                        contains: search_term,
                    },
                },
            };
        } else {
            where = {
                [column_name]: {
                    contains: search_term,
                },
            };
        }
    }

    try {
        let donation;
        if (pageNumber) {
            donation = await prisma.donations.findMany({
                where,
                orderBy,
                skip: (pageNumber - 1) * pageSize,
                take: pageSize,
                include: {
                    user: true,
                    purpose: true,
                },
            });
        } else {
            donation = await prisma.donations.findMany({
                where,
                orderBy,
                include: {
                    user: true,
                    purpose: true,
                },
            });
        }

        const totalDonationCount = await prisma.donations.count({ where });

        const results = {
            current_page: pageNumber || 1,
            page_size: pageNumber ? Math.ceil(totalDonationCount / pageSize) : totalDonationCount,
            total_rows: totalDonationCount,
            data: donation,
        };

        // Flatten data and convert to CSV format using Papaparse
        const flattenedData = flattenData(results.data); // Assuming flattenData is a function you have defined
        const csvData = Papa.unparse(flattenedData);

        res.send(csvData); // Send CSV data as response
    } catch (error) {
        console.error('Error fetching donations:', error);
        res.status(500).json({ error: 'Failed to fetch donations', message: error });
    }
});


router.post('/create', async(req, res) => {
    const {user_id, comments, amount, purpose_id, status, transaction, recipient_name} = req.body;

    try{
        const donation = await prisma.donations.create({
            data: {
                id: v4(),
                user_id,
                comments,
                amount,
                status,
                purpose_id,
                transaction,
                recipient_name
            }
        })

        const user:any = await prisma.users.findFirst({
            where: {
                id: user_id
            }
        })

        await prisma.users.update({
            where: { id: user_id },
            data: {
                roles: {
                    isAdmin: user?.roles?.isAdmin,
                    isAdoptor: user?.roles?.isAdoptor,
                    isDonor: true
                }
            },
        });

        res.status(201).json(donation)  
    }catch(error: any){
        res.status(500).json({ error: 'Internal Server Error' });
        console.log(error)
    }
})


router.post('/get', async (req, res) => {
    const { page_number = 1, page_size = 10, sort, search } = req.body;
    console.log(req.body); // Print request body for debugging

    const pageNumber = parseInt(page_number);
    const pageSize = parseInt(page_size);

    let orderBy = {};

    if (sort) {
        const { column_name, isAscending } = sort;

        // Check if the column_name indicates a nested relation
        if (typeof column_name === 'string' && column_name.includes('.')) {
            const [relation, field] = column_name.split('.');
            orderBy = {
                [relation]: {
                    [field]: isAscending ? 'asc' : 'desc'
                }
            };
        } else {
            orderBy = {
                [column_name]: isAscending ? 'asc' : 'desc'
            };
        }
    }

    let where = {};

    if (search) {
        const { column_name, search_term } = search;

        // Check if the column_name is defined and is a string
        if (typeof column_name === 'string') {
            // Check if the column_name is 'first_name' or 'last_name'
            if (column_name === 'first_name' || column_name === 'last_name') {
                where = {
                    user: {
                        [column_name]: {
                            contains: search_term
                        }
                    }
                };
            } else {
                // Handle other search cases here if needed
                where = {
                    [column_name]: {
                        contains: search_term
                    }
                };
            }
        }
    }

    try {
        const donations = await prisma.donations.findMany({
            where,
            orderBy,
            skip: (pageNumber - 1) * pageSize,
            take: pageSize,
            include: {
                user: true,
                purpose: true,
            },
        });

        // Count total donations based on the search criteria
        const totalDonationCount = await prisma.donations.count({ where });

        const donationsWithFormattedDate = donations.map(donation => ({
            ...donation,
            DOB: donation.user.DOB?.toLocaleDateString()
        }));

        // Constructing the response object
        const results = {
            current_page: pageNumber,
            page_size: pageSize,
            total_rows: totalDonationCount,
            data: donationsWithFormattedDate,
        };

        res.json(results);
        console.log(results)
    } catch (error) {
        console.error('Error fetching donations:', error);
        res.status(500).json({ error: 'Failed to fetch donations' });
    }
});





router.put('/update/:id', async (req, res) => {
    const donationId = req.params.id;
    const { user_id, comments, amount, purpose_id, status, transaction, recipient_name } = req.body;

    try {
        console.log('req body', req.body)
        const updatedDonation = await prisma.donations.update({
            where: { id: donationId },
            data: {
                user_id,
                comments,
                amount,
                purpose_id,
                status,
                transaction,
                recipient_name
            },
        });

        res.status(201).json(updatedDonation);
    } catch (error:any) {
        console.error('Error updating donation:', error);
        res.status(500).json({ error: 'Failed to update donation' });
        if(error.code == 'P2025') res.status(500).json({ error: 'Record to update not found' });
    }
});

router.delete('/delete/:id', async(req, res) => {
    const donationId = req.params.id;
    const currentDateTime = new Date().toISOString()

    try {
        const updatedDonation = await prisma.donations.update({
            where: { id: donationId },
            data: {
                deleted_at: currentDateTime
            }
        });

        res.status(201).json(updatedDonation);
    } catch (error) {
        console.error('Error updating donation:', error);
        res.status(500).json({ error: 'Failed to update donation' });
    }
})

export default router;