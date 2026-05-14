import { LOGIN_USER, INVITE_USER, USER_ACCEPT_INVITE } from "../urls";
import universalRequest from "../universalRequest";

export interface LoginRequest {
    email: string;
    password: string;
}

export interface LoginResponse {
    access_token: string;
}

export async function loginUser(body: LoginRequest): Promise<string | null> {
    try {
        console.log("Request body: ", body)
        const response = await universalRequest<LoginRequest, LoginResponse>(
            LOGIN_USER,
            "POST",
            {body}
        );
        console.log("Raw API response: ", response)

        if(!response) {
            throw new Error('no response')
        }

        return response.access_token
    } catch(err) {
        console.error("Login error: ", err)
        return null
    }
}