import { reviewPullRequest } from "@/modules/ai/actions";
import { NextResponse,NextRequest } from "next/server";

export async function POST(request:NextRequest){
    try{
        const body=await request.json();
        const event=request.headers.get("x-github-event");
        if(event==="ping"){
            return NextResponse.json({ message: "Pong" }, { status: 200 });
        }

        if(event==="pull_request"){
            const action=body.action;
            const repo=body.repository.full_name;
            const prNumber=body.number;

            const [owner,repoName]=repo.split("/");

            if(action==="opened" || action ==="synchronize"){
                reviewPullRequest(owner,repoName,prNumber)
                .then(()=>{
                    console.log(`PR reviewed successfully for ${owner}/${repoName}#${prNumber}`)
                })
                .catch((err)=>{
                    console.log(`Error reviewing PR for ${owner}/${repoName}#${prNumber}`,err)
                })
            }
            

        }

        return NextResponse.json({message:"Event processed successfully"},{status:200});
    }catch(err){
        console.log("Error processing github webhook",err);
        return NextResponse.json({message:"Error processing webhook",error:String(err)},{status:500});
    }
   
}