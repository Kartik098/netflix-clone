import { getServerSession } from "next-auth/next";

import authOptions from "./authOptions";
import prismadb from "./prismadb";

const serverAuth = async () => {
 const session = await getServerSession(authOptions);
console.log(session?.user)
 if(!session?.user?.email){
    throw new Error("Not signed in!");
 }
 const currentUser = await prismadb.user.findUnique({
    where: {
        email:session.user.email
    }
 })
 if(!currentUser) {
    throw new Error("Not signed in!");
 }
 return { currentUser }
}

export default serverAuth