import { NextResponse,NextRequest } from "next/server";

export async function POST(request:NextRequest){
    try{
        const body=await request.json();
        const event=request.headers.get("x-github-event");
        if(event==="ping"){
            return NextResponse.json({ message: "Pong" }, { status: 200 });
        }

        //todo:handle later

        return NextResponse.json({message:"Event processed successfully"},{status:200});
    }catch(err){
        console.log("Error processing github webhook",err);
        return NextResponse.json({message:"Error processing webhook",error:String(err)},{status:500});
    }
   
}