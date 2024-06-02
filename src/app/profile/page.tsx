'use client'
import React, { useState } from 'react'
import axios from "axios"
import Link from 'next/link'
import {toast} from "react-hot-toast"
import { useRouter } from 'next/navigation'

export default function page (){
    const router = useRouter()
    const [data,setData] = useState("nothing")
    const getUserDetails = async()=>{
        const res = await axios.post("/api/users/me")
        setData(res.data.data._id);

    }
    const logout = async()=>{
        try {
            await axios.post('/api/users/logout')
            toast.success("Logout Successful")
            router.push("/login")

        } catch (error:any) {
            console.log(error.message)
            toast.error(error.message)
        }
    }
  return (
    <div className='flex flex-col min-h-screen py-2 itemas-center justify-center'> 
        <h1>
            Profile Page
        </h1>
        <hr />
        <h2>{data==="nothing"?"Nothing": <Link href={`/profile/${data}`}>{data}</Link>}</h2>
        <hr />
        <button className='bg-red-500 p-2 m-2' onClick={logout}>Logout</button>
        <button className='bg-green-500 p-2 m-2' onClick={getUserDetails}>User Details</button>
    </div>
  )
}
