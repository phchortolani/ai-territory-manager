export async function ApiServerFetch<T>(url: string, req?: RequestInit) {
    const response = await fetch(process.env.NEXT_PUBLIC_API_URL + url, req)
    return response.json() as T
}