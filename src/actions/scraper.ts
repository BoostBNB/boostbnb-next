"use server";

export async function getPropertyInfo(url: string) {
    // const response = await fetch(`https://api.hasdata.com/scrape/airbnb/property?url=${url}`, {
    //     method: "GET",
    //     headers: {
    //         "Content-Type": "application/json",
    //         "X-Api-Key": process.env.NEXT_PUBLIC_HASDATA_API_KEY!
    //     }
    // });

    // const data = await response.json();

    const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/example-airbnb-response.json`);
    const data = await response.json();

    return data;

}