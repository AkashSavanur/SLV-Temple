import express from 'express'
const router = express.Router()
import { v4 } from 'uuid'
import { PrismaClient } from "../../node_modules/.prisma/client/index";
import jwt from 'jsonwebtoken'
import { AuthorizeAdmin, AuthorizeUser } from '../middleware';
import Papa from 'papaparse'

const prisma = new PrismaClient();

function flattenData(data: any) {
    if (!Array.isArray(data)) {
        throw new Error('Data is not an array');
    }
    return data.map((item: any) => {
        const { roles, address, ...rest } = item;
        return {
            ...rest,
            isAdmin: roles?.isAdmin,
            isDonor: roles?.isDonor,
            isAdoptor: roles?.isAdoptor,
            city: address?.city,
            state: address?.state,
            street: address?.street,
            zip_code: address?.zip_code
        };
    });
}

router.post('/csv', AuthorizeAdmin, async (req, res) => {
    const { page_number, page_size = 10, sort, search } = req.body;

    const pageNumber = page_number ? parseInt(page_number) : null;
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
        let users;
        if (pageNumber) {
            users = await prisma.users.findMany({
                where,
                orderBy,
                skip: (pageNumber - 1) * pageSize,
                take: pageSize,
            });
        } else {
            users = await prisma.users.findMany({
                where,
                orderBy,
            });
        }

        const totalUsersCount = await prisma.users.count({ where });

        const results = {
            current_page: pageNumber || 1,
            page_size: pageNumber ? Math.ceil(totalUsersCount / pageSize) : totalUsersCount,
            total_rows: totalUsersCount,
            data: users,
        };
        const flattenedData = flattenData(results.data)
        const csvData = Papa.unparse(flattenedData)
        res.json(csvData);
    } catch (error) {
        console.error('Error generating csv:', error);
        res.status(500).json({ error: 'Failed to generate csv' });
    }
});


router.post('/register', async (req, res) => {
    const { first_name, last_name, phone_number, otp, roles } = req.body
    const currentDate = new Date()
    console.log(req.body)

    //validate the otp first
    try {
        const otpEntry = await prisma.oTP.findFirst({
            where: {
                phone_number: phone_number,
                OTP: otp,
                expiresAt: {
                    gt: currentDate
                },
            },
            orderBy: {
                expiresAt: 'desc'
            },
            select: {
                id: true
            }
        })

        if (otpEntry) {
            const user: any = await prisma.users.create({
                data: {
                    id: v4(),
                    first_name: first_name,
                    last_name: last_name,
                    phone_number: phone_number,
                    roles: roles
                }
            })

            //TODO: create env variable for secret
            const token = jwt.sign(JSON.stringify(user), "secret")
            console.log('token', token)
            res.status(200).header('auth_token', token).json({ message: "account created" })
        }
        else {
            res.status(400).json({ message: "Invalid OTP" })
        }
    } catch (error:any) {
        console.error('Error validating OTP:', error);
        if (error.status === 'P2002') {
            res.status(500).json({ error: `${error.meta.target === "phone_number" ? 'Phone_number': "Email"} is already taken` });
        }else {
            res.status(500).json({ error: 'Internal server error' });
        }
    }
})

router.get('/me', (req, res) => {
    const authToken = req.headers.authorization;

    if (!authToken) {
        return res.status(401).json({ message: "Authorization header is missing" });
    }


    try {
        const decoded: any = jwt.verify(authToken, 'secret');

        res.status(200).json(decoded);
    } catch (error: any) {
        console.error('Error decoding token:', error.message);
        res.status(401).json({ error: 'Invalid token' });
    }
});

router.post("/create", async (req, res) => {
    const { first_name, last_name, DOB, email, phone_number, nakshatra, rashi, gothra, roles, address } = req.body;
    try {
        const user = await prisma.users.create({
            data: {
                id: v4(),
                first_name,
                last_name,
                DOB: new Date(DOB),
                email,
                phone_number,
                nakshatra,
                rashi,
                gothra,
                roles,
                address,
            }
        })


        res.status(201).json(user)
    } catch (error: any) {
        if (error.code === 'P2002') {
            res.status(400).json({ error: `${error.meta.target == "phone_number" ? "Phone Number" : "Email"} already exists` });
            console.log(error)
        } else {
            res.status(500).json({ error: 'Internal Server Error' });
            console.log(error)
        }
    }
});


router.post('/get', async (req, res) => {
    const { page_number = 1, page_size = 10, sort, search } = req.body;
    console.log(req.body)

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
        const users = await prisma.users.findMany({
            where,
            orderBy,
            skip: (pageNumber - 1) * pageSize,
            take: pageSize,
        });


        const totalUsersCount = await prisma.users.count({ where });

        const results = {
            current_page: pageNumber,
            page_size: Math.ceil(totalUsersCount / pageSize),
            total_rows: totalUsersCount,
            data: users,
        };

        res.json(results);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ error: 'Failed to fetch users' });
    }
});

router.put('/admin/:id', AuthorizeAdmin, async (req, res) => {
    const userId = req.params.id

    try {
        const updatedUser = await prisma.users.update({
            where: { id: userId },
            data: {
                roles: {
                    isAdmin: true,
                    isDonor: false,
                    isAdoptor: false
                }
            }
        })

        const token = jwt.sign(updatedUser, "secret")
        res.status(201).header('auth_token', token).json(updatedUser);
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ error: 'Failed to update user' });
    }
})

router.put('/removeAdmin/:id', AuthorizeAdmin, async (req, res) => {
    const userId = req.params.id

    try {
        const updatedUser = await prisma.users.update({
            where: { id: userId },
            data: {
                roles: {
                    isAdmin: false
                }
            }
        })


        const token = jwt.sign(updatedUser, "secret")
        res.status(201).header('auth_token', token).json(updatedUser);
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ error: 'Failed to update user' });
    }
})

router.put('/update/:id', AuthorizeUser, async (req, res) => {
    const userId = req.params.id;
    const { first_name, last_name, email, phone_number, nakshatra, rashi, gothra, roles, address, DOB } = req.body;
    console.log(req.body)


    try {
        const updatedUser = await prisma.users.update({
            where: { id: userId },
            data: {
                first_name,
                last_name,
                DOB: new Date(DOB),
                email,
                phone_number,
                nakshatra,
                rashi,
                gothra,
                roles,
                address,
            },
        });


        const token = jwt.sign(updatedUser, "secret")
        res.status(201).header('auth_token', token).json(updatedUser);
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ error: 'Failed to update user' });
    }
});

router.delete('/delete/:id', AuthorizeAdmin, async (req, res) => {
    const userId = req.params.id;
    const currentDateTime = new Date().toISOString()
    try {
        const updatedUser = await prisma.users.update({
            where: { id: userId },
            data: {
                deleted_at: currentDateTime
            },
        });


        const token = jwt.sign(updatedUser, "secret")
        res.status(201).header('auth_token', token).json(updatedUser);
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ error: 'Failed to update user' });
    }
})

export default router;