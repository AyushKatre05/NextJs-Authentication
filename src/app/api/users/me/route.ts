import {connect} from '@/dbConfig/dbConfig'
import User from '@/models/userModel'
import {NextRequest,NextResponse} from 'next/server'
import bcrypt from "bcryptjs"
import { use } from 'react'
import jwt from "jsonwebtoken"
import {getData} from "@/helpers/deldata"
connect()

export async function POST(request : NextRequest){
    const userId = await getData(request)
    const user = await User.findOne({_id:userId}).select("-password")
    return NextResponse.json({
        message : "User Found",
        data : user
    })
}