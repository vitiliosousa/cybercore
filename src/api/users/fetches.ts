import { TeamMember } from "@/lib/store";
import { LIST_USERS } from "../urls";
import universalRequest from "../universalRequest";

export interface ApiUser {
    id: string;
    created_at: string;
    updated_at: string;
    email: string;
    full_name: string
    role: string;
    status: string;
    InviteToken: string;
}

//formatting date coming from backend
const formatTimestamp = (isoString: string) => {
    return new Date(isoString).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
};

export const mapApiUserToFrontend = (api: ApiUser): TeamMember => ({
    id: api.id,
    name: api.full_name,
    role: api.role,
    email: api.email,
    department: "",
    status: api.status as "active" | "away" | "offline",
    activeTasks: 0
})

export const fetchUsers = async(): Promise<ApiUser[] | null> => {
    try {
        const token = localStorage.getItem("cybercore_token");
        if (!token) return null;

        const response = await universalRequest<undefined, ApiUser[]>(
            LIST_USERS,
            "GET"
        )

        if (!response) {
            return null;
        }

        return response
    } catch(err) {
        console.error("Fetch error: ", err)
        return null;
    }
}