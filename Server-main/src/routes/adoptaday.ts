import express from 'express'
const router = express.Router()
import { v4 } from 'uuid'
import { PrismaClient } from "../../node_modules/.prisma/client/index";
const prisma = new PrismaClient();
import { AuthorizeAdmin } from '../middleware';
import Papa from 'papaparse'
import { FlashOffRounded } from '../../../../node_modules/@mui/icons-material/index';


function flattenData(data: any) {
    if (!Array.isArray(data)) {
        throw new Error('Data is not an array');
    }
    return data.map((item) => {
        const {
            id, user_id, date, occasion, booking_status, recipient_name, rate_id,
            created_at, updated_at, deleted_at,
            transaction, user, rate
        } = item;

        return {
            adopt_a_day_id: id,
            user_id,
            date,
            occasion,
            booking_status,
            recipient_name,
            rate_id,
            transaction_id: transaction?.id,
            transaction_mode: transaction?.mode,
            bank_name: transaction?.details?.bank_name,
            receipt_url: transaction?.details?.receipt_url,
            payment_date: transaction?.details?.payment_date,
            cheque_number: transaction?.details?.cheque_number,
            receipt_number: transaction?.details?.receipt_number,
            adopt_a_day_created_at: created_at,
            adopt_a_day_updated_at: updated_at,
            adopt_a_day_deleted_at: deleted_at,
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
            rate_effective_date: rate?.effectiveDate,
            rate_priests_honorarium: rate?.priestsHonorarium,
            rate_annual_expenses: rate?.annualExpenses,
            rate_maintenance: rate?.maintenance,
            rate_endowment: rate?.endowment,
            rate_miscellaneous: rate?.miscellaneous,
            rate_created_at: rate?.created_at,
            rate_updated_at: rate?.updated_at,
            rate_deleted_at: rate?.deleted_at
        };
    });
}

router.post('/status', async(req, res) => {

})


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
        let adoptADay;
        if (pageNumber) {
            adoptADay = await prisma.adoptADay.findMany({
                where,
                orderBy,
                skip: (pageNumber - 1) * pageSize,
                take: pageSize,
                include: {
                    user: true,
                    rate: true,
                },
            });
        } else {
            adoptADay = await prisma.adoptADay.findMany({
                where,
                orderBy,
                include: {
                    user: true,
                    rate: true,
                },
            });
        }

        const totalAdoptADayCount = await prisma.adoptADay.count({ where });

        const results = {
            current_page: pageNumber || 1,
            page_size: pageNumber ? Math.ceil(totalAdoptADayCount / pageSize) : totalAdoptADayCount,
            total_rows: totalAdoptADayCount,
            data: adoptADay,
        };

        // Flatten data and convert to CSV format using Papaparse
        const flattenedData = flattenData(results.data); // Assuming flattenData is a function you have defined
        const csvData = Papa.unparse(flattenedData);

        res.send(csvData); // Send CSV data as response
    } catch (error) {
        console.error('Error fetching adopt a day listing:', error);
        res.status(500).json({ error: 'Failed to fetch adopt a day listings' });
    }
});


router.post("/create", async (req, res) => {
    const { user_id, date, booking_status, transaction, recipient_name, occasion, relationship_id } = req.body;
    try {
        const prevRate = await prisma.rates.findFirst({
            where: {
                effectiveDate: {
                    lt: new Date(date).toISOString()
                },
            },
            orderBy: {
                effectiveDate: 'desc'
            },
            select: {
                id: true
            }
        });

        const adoptADay = await prisma.adoptADay.create({
            data: {
                id: v4(),
                user_id,
                date: new Date(date).toISOString(),
                booking_status,
                occasion,
                transaction,
                recipient_name,
                rate_id: prevRate ? prevRate.id : 'undefined',
                relationship_id
            }
        });

        const user: any = await prisma.users.findFirst({
            where: {
                id: user_id
            }
        })


        await prisma.users.update({
            where: { id: user_id },
            data: {
                roles: {

                    isAdmin: user?.roles?.isAdmin,
                    isAdoptor: true,
                    isDonor: user?.roles?.isDonor
                }
            },
        });

        console.log(adoptADay);
        res.status(201).json(adoptADay);
    } catch (error: any) {
        if (error.code == 'P2003') {
            res.status(501).json({ error: 'No Rate exists before today`s date, please try again later.' });
            console.log(error);
        } else if (error.code == 'P2002') {
            res.status(502).json({ error: 'Date already booked' });
        } else {
            res.status(500).json({ error: 'Internal Server Error' });
            console.log(error);
        }
    }
});

router.get('/getAll', async (req, res) => {
    try {
        const adoptADay = await prisma.adoptADay.findMany({
            where: {
                isDeleted: false,
                deleted_at: null
            },
            include: {
                user: true,
                rate: true,
                relationship: true
            }
        });

        const results = {
            data: adoptADay,
        };
        res.status(201).json(results)
    } catch (error) {
        console.error('Error fetching adopt a day listing:', error);
        res.status(500).json({ error: 'Failed to fetch adopt a day listings' });
    }

})

router.get('/today/:date', async (req, res) => {
    const requestedDate = req.params.date;
    const dateParts = requestedDate.split('-');
    const year = dateParts[0];
    const month = dateParts[1];
    const day = dateParts[2];
    const startDate = new Date(`${year}-${month}-${day}`);
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 1);

    const startDateISO = startDate.toISOString();
    const endDateISO = endDate.toISOString();
    console.log("starting: ", startDateISO, "ending: ", endDateISO)
    try {


        const matches = await prisma.adoptADay.findMany({
            where: {
                date: {
                    gte: startDateISO,
                    lte: endDateISO
                }
            },
            include: {
                user: true,
                rate: true,
                relationship: true
            }
        });

        if (matches.length > 0) {
            res.json(matches);
        } else {
            res.status(404).json({ error: 'No matching adopt a day listings found for the specified date'});
        }
    } catch (error) {
        console.error('Error fetching adopt a day listings:', error);
        res.status(500).json({ error: 'Failed to fetch adopt a day listings' });
    }
});


router.post('/get', async (req, res) => {
    const { page_number = 1, page_size = 10, sort, search } = req.body;

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

        if (typeof column_name === 'string') {
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
        }

    }

    try {
        const adoptADay = await prisma.adoptADay.findMany({
            where,
            orderBy,
            skip: (pageNumber - 1) * pageSize,
            take: pageSize,
            include: {
                user: true,
                rate: true,
                relationship: true
            },
        });

        const totalAdoptADayCount = await prisma.adoptADay.count({ where });

        const results = {
            current_page: pageNumber,
            page_size: Math.ceil(totalAdoptADayCount / pageSize),
            total_rows: totalAdoptADayCount,
            data: adoptADay,
        };

        res.json(results);
    } catch (error) {
        console.error('Error fetching adopt a day listing:', error);
        res.status(500).json({ error: 'Failed to fetch adopt a day listings' });
    }
});

router.put('/update/:id', AuthorizeAdmin, async (req, res) => {
    const adoptADayId = req.params.id;
    const { user_id, date, booking_status, transaction, recipient_name, relationship_id } = req.body;

    try {
        console.log('req body', req.body)

        const prevRate = await prisma.rates.findFirst({
            where: {
                effectiveDate: {
                    lt: date
                },
            },
            orderBy: {
                effectiveDate: 'desc'
            },
            select: {
                id: true
            }
        });

        const updatedAdoptADay = await prisma.adoptADay.update({
            where: { id: adoptADayId },
            data: {
                user_id,
                date,
                booking_status,
                transaction,
                recipient_name,
                rate_id: prevRate ? prevRate.id : 'undefined',
                relationship_id
            },
        });


        console.log(updatedAdoptADay)
        res.status(201).json(updatedAdoptADay);
    } catch (error) {
        console.error('Error updating adopt a day listing:', error);
        res.status(500).json({ error: 'Failed to update adopt a day listing' });
    }
});

router.put('/delete/:id', async (req, res) => {
    const adoptADayId = req.params.id;
    const currentDateTime = new Date().toISOString()

    try {

        const updatedAdoptADay = await prisma.adoptADay.update({
            where: { id: adoptADayId },
            data: {
                deleted_at: currentDateTime,
                isDeleted: true
            },
        });

        res.status(201).json(updatedAdoptADay);
    } catch (error) {
        console.error('Error updating adopt a day listing:', error);
        res.status(500).json({ error: 'Failed to update adopt a day listing' });
    }
})




export default router;