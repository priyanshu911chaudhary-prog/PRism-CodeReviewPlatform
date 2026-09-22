"use server";

import {auth} from "@/lib/auth"
import {headers} from "next/headers"
import {redirect} from "next/navigation"

export const requireAuth=async()=>{

    let session;
    try {
        session=await auth.api.getSession({
            headers:await headers()
        })
    } catch (err) {
        console.error("[requireAuth] Failed to get session:", err);
        session = null;
    }

    if(!session){
        redirect("/login")
    }

    return session;
}

export const requireUnAuth=async()=>{
    
    let session;
    try {
        session=await auth.api.getSession({
            headers:await headers()
        })
    } catch (err) {
        console.error("[requireUnAuth] Failed to get session:", err);
        session = null;
    }

    if(session){
        redirect("/")
    }

    return session;
}