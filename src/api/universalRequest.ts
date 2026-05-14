import { NextResponse } from "next/server";

type RequestMethod = "GET" | "POST" | "PUT" | "DELETE"

interface RequestOptions<T = undefined> {
    body?: T;
    headers?: HeadersInit;
}

interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
}

export default async function universalRequest<TRequest = undefined, TReponse = unknown>(
    url: string,
    method: RequestMethod,
    options: RequestOptions<TRequest> = {}
): Promise<TReponse|null> {
    try {
        const token = localStorage.getItem("cybercore_token");
        const response = await fetch(url, {
            method,
            headers: {
                "Content-Type": "application/json",
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
                ...options.headers,
            },
            body: options.body ? JSON.stringify(options.body) : undefined,
        });

        if(!response.ok) {
            console.log("Response: ",
                await response.text()
            )
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = (await response.json()) as TReponse;
        return data
    } catch (error) {
        return null
    }
}