import User from "@/models/userModel";
import nodemailer from "nodemailer"
import bcrypt from "bcryptjs"
export const sendMail = async({email,emailType,userId} : any)=>{
    try {
        const hashedToken = await bcrypt.hash(userId.toString(),10)
        if(emailType === 'VERIFY'){
            await User.findByIdAndUpdate(userId,{
                verifyToken:hashedToken,
                verifyTokenExpiry : Date.now()+3600000
            })
        }
        else if(emailType==='RESET'){
            await User.findByIdAndUpdate(userId,{
                forgotPasswordToken:hashedToken,
                forgotPasswordTokenExpiry : Date.now()+3600000
            })
        }

        var transport = nodemailer.createTransport({
            host: "sandbox.smtp.mailtrap.io",
            port: 2525,
            auth: {
                user: "bd98a08c7ff248",
                pass: "057062d8898142"
            }
            });
          const mailOptions = {
            from: "ayushkatre1801@gmail.com", // sender address
            to: email, // list of receivers
            subject: emailType==='VERIFY'? "Verify Email":"Reset Password", // Subject line
            text: "Hello world?", // plain text body
            html: `<p>Click <a href="${process.env.DOMAIN}/verifyemail?token=${hashedToken}">here</a> to ${emailType==='VERIFY'?"verify your email":"reset your password"} or copy and paste the link below in your browser.<br>${process.env.DOMAIN}/verifyemail?token=${hashedToken}</p>`, // html body
          }
          const mailResponse = await transport.sendMail(mailOptions)
          return mailOptions
    } catch (error:any) {
        throw new Error(error.message)
    }
}