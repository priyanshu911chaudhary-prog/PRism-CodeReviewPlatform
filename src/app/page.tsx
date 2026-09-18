import {Button} from "@/components/ui/button"
import { requireAuth } from "@/modules/auth/utils/authUtils";
import Logout from "@/modules/auth/components/Logout";

export default async function Home() {
  await requireAuth();
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <Logout>
        Logout
      </Logout>
    </div>
  );
}
