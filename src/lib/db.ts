import {PrismaClient} from "@/generated/prisma/client"
import {PrismaPg} from "@prisma/adapter-pg"

// Extend connect timeout for Neon free-tier cold starts (default 5s is too short)
const dbUrl = process.env.DATABASE_URL || "";
const connectionString = dbUrl.includes("?")
    ? `${dbUrl}&connect_timeout=30`
    : `${dbUrl}?connect_timeout=30`;

const adapter=new PrismaPg({
    connectionString
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