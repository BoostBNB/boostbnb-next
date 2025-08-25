"use server";
// Hostaway API Documentation: https://api.hostaway.com/documentation#introduction

export type SortOption = "name" | "nameReversed" | "order" | "orderReversed" | "contactName" | "contactNameReversed" | "latestActivity" | "latestActivityDesc";

export interface ListingParams {
    limit?: number;
    offset?: number;
    sortOrder?:  SortOption;
    city?: string;
    match?: string;
    country?: string;
    contactName?: string;
    propertyTypeId?: number;
}

export interface ReservationParams {
    limit?: number;
    offset?: number;
    order?: string;
    channelId?: string;
    listingId?: string;
    arrivalStartDate?: string;
    arrivalEndDate?: string;
    departureStartDate?: string;
    departureEndDate?: string;
    hasUnreadConversationMessages?: boolean;
}


export async function getAccessToken(clientId: string, clientSecret: string) {
    const response = await fetch("https://api.hostaway.com/v1/accessTokens", {
        method: "POST",
        headers: {
            "Cache-control": "no-cache",
            "Content-type": "application/x-www-form-urlencoded"
        },
        body: new URLSearchParams({
            grant_type: "client_credentials",
            client_id: clientId,
            client_secret: clientSecret,
            scope: "general"
        })
    })

    const data = await response.json();
    // {
    //     "token_type": "Bearer",
    //     "expires_in": 15897600,
    //     "access_token": "yournewaccesstoken"
    // }

    return data;
}


export async function revokeAccessToken(accessToken: string) {
    const response = await fetch(`https://api.hostaway.com/v1/accessTokens?token=${accessToken}`, {
        method: "DELETE",
        headers: {
            "Content-type": "application/x-www-form-urlencoded"
        }
    });

    const data = await response.json();
    // {
    //     "status": "success",
    //     "result": []
    // }

    return data;
}


export async function getListingList(accessToken: string, options: ListingParams) {
    const params = new URLSearchParams(options as Record<string, string>).toString();

    const response = await fetch(`https://api.hostaway.com/v1/listings?${params}`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${accessToken}`,
            "Cache-control": "no-cache"
        }
    });

    const data = await response.json();
    return data;
}


export async function getListing(accessToken: string, listingId: string) {
    const response = await fetch(`https://api.hostaway.com/v1/listings/${listingId}`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${accessToken}`,
            "Cache-control": "no-cache"
        }
    });

    const data = await response.json();
    return data;
}


export async function updateListing(accessToken: string, listingId: string, newData: any) {
    const response = await fetch(`https://api.hostaway.com/v1/listings/${listingId}`, {
        method: "PUT",
        headers: {
            "Authorization": `Bearer ${accessToken}`,
            "Cache-control": "no-cache",
            "Content-type": "application/json"
        },
        body: JSON.stringify(newData)
    });

    const data = await response.json();
    return data;
}


export async function exportToAirbnb(accessToken: string, listingId: string) {
    const response = await fetch(`https://api.hostaway.com/v1/listings/${listingId}/export/airbnb`, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${accessToken}`,
            "Cache-control": "no-cache",
            "Content-type": "application/json"
        }
    });

    const data = await response.json();
    return data;
}


export async function getReservationList(accessToken: string, options: ReservationParams) {
    const params = new URLSearchParams(options as Record<string, string>).toString();

    const response = await fetch(`https://api.hostaway.com/v1/reservations?${params}`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${accessToken}`,
            "Cache-control": "no-cache",
        }
    });

    const data = await response.json();
    return data;
}


export async function getReservation(accessToken: string, reservationId: string) {
    const response = await fetch(`https://api.hostaway.com/v1/reservations/${reservationId}`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${accessToken}`,
            "Cache-control": "no-cache",
        }
    });

    const data = await response.json();
    return data;
}