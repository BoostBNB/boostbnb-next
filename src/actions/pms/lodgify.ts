"use server";
// Lodgify API Documentation: https://docs.lodgify.com/reference/listproperties


export interface ListingParams {
    includeCount?: boolean;
    includeInOut?: boolean;
    page?: number;
    size?: number;
}

export interface BookingParams {
    page?: number;
    size?: number;
    includeCount?: boolean;
    includeTransactions?: boolean;
    includeExternal?: boolean;
    includeQuoteDetails?: boolean;
}


export async function getListingList(apiKey: string, options: ListingParams) {
    const params = new URLSearchParams(options as Record<string, string>).toString();

    const response = await fetch(`https://api.lodgify.com/v2/properties?${params}`, {
        method: "GET",
        headers: {
            "X-ApiKey": apiKey,
            "Accept": "application/json",
        }
    });

    const data = await response.json();
    return data;
}

export async function getListing(apiKey: string, propertyId: string) {
    const response = await fetch(`https://api.lodgify.com/v2/properties/${propertyId}`, {
        method: "GET",
        headers: {
            "X-ApiKey": apiKey,
            "Accept": "application/json",
        }
    });

    const data = await response.json();
    return data;
}


export async function getAvailableRooms(apiKey: string, propertyId: string) {
    const response = await fetch(`https://api.lodgify.com/v2/properties/${propertyId}/rooms`, {
        method: "GET",
        headers: {
            "X-ApiKey": apiKey,
            "Accept": "application/json",
        }
    });

    const data = await response.json();
    return data;
}


export async function getPropertyAvailability(apiKey: string, propertyId: string) {
    const response = await fetch(`https://api.lodgify.com/v2/availability/${propertyId}`, {
        method: "GET",
        headers: {
            "X-ApiKey": apiKey,
            "Accept": "application/json",
        }
    });

    const data = await response.json();
}


export async function getRoomAvailability(apiKey: string, propertyId: string, roomId: string) {
    const response = await fetch(`https://api.lodgify.com/v2/availability/${propertyId}/${roomId}`, {
        method: "GET",
        headers: {
            "X-ApiKey": apiKey,
            "Accept": "application/json",
        }
    });

    const data = await response.json();
    return data;
}


export async function getBookings(apiKey: string, options: BookingParams) {
    const params = new URLSearchParams(options as Record<string, string>).toString();

    const response = await fetch(`https://api.lodgify.com/v2/reservations/bookings/?${params}`, {
        method: "GET",
        headers: {
            "X-ApiKey": apiKey,
            "Accept": "application/json",
        }
    });

    const data = await response.json();
    return data;
}