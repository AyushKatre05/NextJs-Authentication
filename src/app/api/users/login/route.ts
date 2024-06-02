import {connect} from '@/dbConfig/dbConfig'
import User from '@/models/userModel'
import {NextRequest,NextResponse} from 'next/server'
import bcrypt from "bcryptjs"
import { use } from 'react'
import jwt from "jsonwebtoken"
connect()

export async function POST(request : NextRequest){
    try {
        const reqBody = await request.json()
        const {email,password} =reqBody
        console.log(reqBody);
        const user = await User.findOne({email})
        if(!user){
            return NextResponse.json({error:"User not exists"},{status:400})
        }
        const validPassword = await bcrypt.compare(password,user.password)
        if(!validPassword){
            return NextResponse.json({error:"Check your credentials"},{status:400})
        }

        const tokenData = {
            username : user.username,
            email : user.email
        }
        const token = jwt.sign(tokenData,process.env.TOKEN_SECRET!)

        const response = NextResponse.json({message : "Logged in Success"},{status:200})

        response.cookies.set("token",token,{
            httpOnly:true
        })

        return response


    } catch (error:any) {
        return NextResponse.json({error:error.message},{status:500})
    }
}