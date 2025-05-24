import express from 'express'
const router = express.Router()
import Razorpay from '../../node_modules/razorpay/dist/razorpay';
import crypto from 'crypto'
import { PrismaClient } from '../../node_modules/.prisma/client/index';

const prisma = new PrismaClient()
//TODO: dotenv
var instance = new Razorpay({
    key_id: 'rzp_test_LRoMzlrK7O7ZzL',
    key_secret: 'sAMZa8F9fi2mcygaeTwGQIxB',
});

router.post('/create', async (req, res) => {
    const { amount } = req.body

    const utils = await prisma.utils.findMany()
    //increase the count by 1
    await prisma.utils.update({
        where: { id: "1" },
        data: {
            reciept_number_donation: (parseInt(utils[0].reciept_number_donation,10)+1).toString()
        }
    })

    var options = {
        amount: amount,
        currency: 'INR',
        receipt: utils[0].reciept_number_donation,
    }

    instance.orders.create(options, function (err, order) {
        console.log(order);
        res.status(201).json({ order: order })
    });

})

router.post('/validate', async (req, res) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body
    console.log(req.body)
    const sha = crypto.createHmac("sha256", "sAMZa8F9fi2mcygaeTwGQIxB")
    sha.update(`${razorpay_order_id}|${razorpay_payment_id}`)
    const digest = sha.digest("hex")
    console.log('digest: ', digest, 'rpsig', razorpay_signature)
    if (digest !== razorpay_signature) {
        return res.status(400).json({ message: "Transaction is not Legit" })
    }
    const details = await instance.payments.fetch(razorpay_payment_id)

    res.status(201).json({
        message: "Success!",
        order_id: razorpay_order_id,
        payment_id: razorpay_payment_id,
        details: details
    })
})

export default router