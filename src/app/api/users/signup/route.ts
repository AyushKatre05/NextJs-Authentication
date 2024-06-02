import {connect} from '@/dbConfig/dbConfig'
import User from '@/models/userModel'
import {NextRequest,NextResponse} from 'next/server'
import bcrypt from "bcryptjs"
import {sendMail} from '@/helpers/mailer'
connect()

export async function POST(request : NextRequest){
    try {
        const reqBody = await request.json()
        const {username,email,password} =reqBody
        console.log(reqBody);
        const user = await User.findOne({email})
        if(user){
            return NextResponse.json({error:"User already exists"},{status:400})
        }

        const salt = await bcrypt.genSaltSync(10)
        const hashedPassword = await bcrypt.hash(password,salt)
        const newUser = new User({
            username,email,password:hashedPassword
        })

        const saveUser = await newUser.save();
        console.log(saveUser);

        await sendMail({email,emailType:'VERIFY',userId:saveUser._id})
        return NextResponse.json({
            message : "User Registered Successfully",
            success:true,
            saveUser
        })


    } catch (error:any) {
        return NextResponse.json({error:error.message},{status:500})
    }
}