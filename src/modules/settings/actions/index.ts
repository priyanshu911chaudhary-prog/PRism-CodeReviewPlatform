"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";
import { deleteWebhook } from "@/modules/github/lib/github";

export async function getUserProfile(){
    try{
        const session = await auth.api.getSession({
            headers:await headers(),
        })
        if(!session?.user){
            throw new Error("Unauthorized")
        }
        const user = await prisma.user.findUnique({
            where:{
                id:session.user.id,
            },
            select:{
                id:true,
                name:true,
                image:true,
                email:true,
                createdAt:true,
                
            }
        })
        return user
    }catch(err){
        console.log(err)
        throw new Error("Failed to fetch user profile")
    }
}

export async function updateUserProfile(
    data:{
        name?:string;
        email?:string;
        image?:string;
    }
){
    try{
        const session = await auth.api.getSession({
            headers:await headers(),
        })
        if(!session?.user){
            throw new Error("Unauthorized")
        }
        const updatedUser = await prisma.user.update({
            where:{
                id:session.user.id,
            },
            data:{
                name:data.name,
                email:data.email
            },
            select:{
                id:true,
                name:true,
                email:true,
            }
        })
        revalidatePath("dashboard/settings","layout")
        return{
            success:true,
            message:"User profile updated successfully",
            user:updatedUser
        }
    }catch(err){
        console.log(err)
        throw new Error("Failed to update user profile")
    }
}

export async function getConnectedRepositories(){
    try{
        const session=await auth.api.getSession({
            headers:await headers()
        })
        if(!session?.user){
            throw new Error("Unauthorized");
        }
        const repositories = await prisma.repository.findMany({
            where:{
                userId:session.user.id,
            },
            select:{
                id:true,
                name:true,
                owner:true,
                url:true,
                createdAt:true,
                updatedAt:true
            },
            orderBy:{
                createdAt:"desc"
            }
        })
        return repositories
    }catch(err){
        console.log(err)
        return []
    }
}

export async function disconnectRepository(repositoryId:string){
    try{
        const session=await auth.api.getSession({
            headers:await headers()
        })
        if(!session?.user){
            throw new Error("Unauthorized");
        }
        const repository = await prisma.repository.findUnique({
            where:{
                id:repositoryId,
                userId:session.user.id,
            }
        })
        if(!repository){
            throw new Error("Repository not found")
        }
        await deleteWebhook(repository.owner,repository.name);

        await prisma.repository.delete({
            where:{
                id:repositoryId,
                userId:session.user.id
            }
        })
        revalidatePath("dashboard/settings","page")
        revalidatePath("dashboard/repository","page")
        return {
            success:true,
            message:"Repository disconnected successfully",
        }
    }catch(err){
        console.log(err)
        throw new Error("Failed to disconnect repository")
    }
}


export async function disconnectAllRepositories(){
    try{
        const session=await auth.api.getSession({
            headers:await headers()
        })
        if(!session?.user){
            throw new Error("Unauthorized");
        }
        const repositories = await prisma.repository.findMany({
            where:{
                userId:session.user.id,
            }
        })
        await Promise.all(repositories.map(async(repo)=>{
            try{
                await deleteWebhook(repo.owner,repo.name);
            }catch(err){
                console.log(`Failed to delete webhook for ${repo.name}`,err);
            }
        }))
        await prisma.repository.deleteMany({
            where:{
                userId:session.user.id
            }
        })
        revalidatePath("dashboard/settings","page")
        revalidatePath("dashboard/repository","page")
        return {
            success:true,
            message:"All repositories disconnected successfully",
        }
    }catch(err){
        console.log(err)
        throw new Error("Failed to disconnect all repositories")
    }
}
