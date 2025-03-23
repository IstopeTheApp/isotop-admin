import { calculateAge } from "@/utils/calculateAge";
import { FilterUser } from "@/types/filter.type";
import { userRes } from '@/types/users.type';

async function updateUserStatus(val) {
        const response = await fetch("/api/verifymanagement/update", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                uid:val.uid,
                is_verified:val.is_verified
            }),
        })
        const result = await response.json();
        if (!response.ok || result.data === "Something went wrong in a server.") {
            // Extract the error message from the response
            const errorMessage = result.data || "Unknown server error";
            throw new Error(errorMessage);
        }

       return response;
}

export default updateUserStatus;
