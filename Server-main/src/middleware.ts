import { PrismaClient } from "../node_modules/.prisma/client/index";
import jwt from 'jsonwebtoken'
import express from 'express'


const app = express()
const prisma = new PrismaClient();



const AuthenticateUser = (req: any, res: any, next: any) => {
    const excludedRoutes = ['/user/login', '/user/register', '/otp/generate', '/otp/validate', '/otp/resend', "/user/me"]
    const isExcluded = excludedRoutes.some(route => req.path.startsWith(route));
    if (isExcluded) return next()
    if (!req.headers.authorization) {
        res.status(401).json({ message: "unauthenticated" })
    } else {
        next()
    }
}

//check if the signed-in user has the same id as the user he updates through /users/update/:id (does not apply to admin as they can update any user freely), and they cannot change their roles
export const AuthorizeUser = async (req: any, res: any, next: any) => {
    const paramID = req.params.id
    if (!req.headers.authorization) res.status(401).json({ message: "unauthenticated" })
    else {
        const decodedUser: any = jwt.verify(req.headers.authorization, 'secret');
        const currentUser: any = await prisma.users.findFirst({
            where: {
                id: decodedUser.id
            }
        })
        if (currentUser && currentUser.roles?.isAdmin) next()
        else if (paramID == decodedUser.id) next()
        else {
            res.status(201).json({ message: 'unauthorized user' })
        }
    }
}

export const AuthorizeAdmin = async (req: any, res: any, next: any) => {

    if (!req.headers.authorization) {
        res.status(401).json({ message: "unauthenticated" })
    }
    else {
        try {
            const decodedUser: any = jwt.verify(req.headers.authorization, 'secret');
            const currentUser: any = await prisma.users.findFirst({
                where: {
                    id: decodedUser.id
                }
            })
            if (currentUser && currentUser?.roles?.isAdmin) next()
            else {
                res.status(201).json({ message: 'unauthorized user' })
            }
        } catch (error) {
            console.error('Error authenticating user:', error);
            res.status(500).json({ error: 'Failed to authorize user' })
        }
    }
}

app.use(AuthenticateUser)
