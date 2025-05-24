import express from 'express'
const router = express.Router()
import { v4 } from 'uuid'
import { PrismaClient } from "../../node_modules/.prisma/client/index";
import jwt from 'jsonwebtoken'

const prisma = new PrismaClient();


//TODO: add phone number validation
router.post('/generate', async (req, res) => {
    const { phone_number } = req.body
    const currentDate = new Date()
    const expiresAt = new Date(currentDate.getTime() + 5 * 60 * 1000);
    const otp = Math.floor(100000 + Math.random() * 900000);

    try {


        const OTP = await prisma.oTP.create({
            data: {
                id: v4(),
                phone_number: phone_number,
                OTP: otp,
                expiresAt: expiresAt
            }
        })

        const user = await prisma.users.findFirst({
            where: {
                phone_number: phone_number
            }
        })


        res.status(201).json({ confirmation_message: "OTP sent, Do not share this number with anyone. Code expires in 5 minutes", data: OTP })


        console.log(OTP.OTP)
    } catch (error) {
        res.status(500).json({ confirmation_message: "error sending OTP" })
        console.log(error)
    }
})

router.post('/validate', async (req, res) => {
    const { phone_number, otp } = req.body;
    const currentDate = new Date()
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
            const user = await prisma.users.findFirst({
                where: {
                    phone_number: phone_number
                }
            })
            if (!user) res.status(403).json({ message: 'User does not Exist' })
            else {
                const token = jwt.sign(JSON.stringify(user), "secret")
                console.log('token', token)
                res.status(200).header('auth_token', token).json({ message: "token sent" })
            }
        }
        else {
            res.status(400).json({ message: "Invalid OTP" })
        }
    } catch (error) {
        console.error('Error validating OTP:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
})

router.post('/resend', async (req, res) => {
    const { phone_number } = req.body
    const currentDate = new Date()
    const expiresAt = new Date(currentDate.getTime() + 5 * 60 * 1000);
    const otp = Math.floor(100000 + Math.random() * 900000);

    try {
        const OTPExistsAndValid = await prisma.oTP.findFirst({
            where: {
                phone_number: phone_number,
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
        if (OTPExistsAndValid) {
            const updatedOTP = await prisma.oTP.update({
                where: { id: OTPExistsAndValid.id },
                data: {
                    expiresAt
                }
            })
            //send same otp
            res.status(201).json({ confirmation_message: "OTP Sent, Do not share this number with anyone. Code expires in 5 minutes", data: updatedOTP })
        } else {
            const OTP = await prisma.oTP.create({
                data: {
                    id: v4(),
                    phone_number: phone_number,
                    OTP: otp,
                    expiresAt: expiresAt
                }
            })

            const tempOTPResponse = JSON.stringify(OTP, (_, v) => typeof v === 'bigint' ? v.toString() : v)
            const OTPToSend = JSON.parse(tempOTPResponse)
            //send new otp to user
            res.status(201).json({ confirmation_message: "OTP sent, Do not share this number with anyone. Code expires in 5 minutes", data: OTPToSend })
        }
    } catch (error) {
        res.status(500).json({ confirmation_message: "error sending OTP" })
        console.log(error)
    }
})


export default router;