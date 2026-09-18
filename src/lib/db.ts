import {PrismaClient} from "@/generated/prisma/client"
import {PrismaPg} from "@prisma/adapter-pg"
import dotenv from "dotenv"

dotenv.config()

const adapter=new PrismaPg({
    connectionString:process.env.DATABASE_URL
})

const prismaClientSingleton=()=>{
    return new PrismaClient({
        adapter
    })
}

declare const globalThis:{
    prismaGlobal:ReturnType<typeof prismaClientSingleton>
}& typeof global

export const prisma=globalThis.prismaGlobal || prismaClientSingleton()

if(process.env.NODE_ENV!=='production') globalThis.prismaGlobal=prisma

export default prisma