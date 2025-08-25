"use server";
// Guesty API Documentation: https://open-api-docs.guesty.com/docs/getting-started

// ?active=true&pmsActive=true&listed=true&available=&ignoreFlexibleBlocks=false&sort=title&limit=25&skip=0
export interface ListingParams {
	active?: boolean;
	pmsActive?: boolean;
	listed?: boolean;
	available?: boolean;
	ignoreFlexibleBlocks?: boolean;
	sort?: "title" | "titleReversed" | "order" | "orderReversed"; // Find the actual sort options from docs
	limit?: number;
	skip?: number;
}


export async function getAccessToken(clientId: string, clientSecret: string) {
	let requestBody = new URLSearchParams({
		grant_type: "client_credentials",
		scope: "open-api",
		client_secret: clientSecret,
		client_id: clientId,
	});

	const response = await fetch("https://open-api.guesty.com/oauth2/token", {
		method: "POST",
		headers: {
			Accept: "application/json",
			"Content-Type": "application/x-www-form-urlencoded",
		},
		body: requestBody.toString(),
	});

	const data = await response.json();
	// {
	// 	"token_type": "Bearer",
	// 	"expires_in": 86400,
	// 	"access_token": "yournewaccesstoken",
	// 	"scope": "open-api"
	// }

	return data;
}


export async function getListingList(accessToken: string, options: ListingParams) {
	const params = new URLSearchParams(options as Record<string, string>).toString();

	const response = await fetch(`https://open-api.guesty.com/v1/listings?${params}`, {
		method: "GET",
		headers: {
			Authorization: `Bearer ${accessToken}`,
			Accept: "application/json",
		},
	});

	const data = await response.json();
	return data;
}


export async function getListing(accessToken: string, listingId: string) { 
	const response = await fetch(`https://open-api.guesty.com/v1/listings/${listingId}`, {
		method: "GET",
		headers: {
			Authorization: `Bearer ${accessToken}`,
			Accept: "application/json",
		},
	});

	const data = await response.json();
	return data;
}


export async function updateListing(accessToken: string, listingId: string, updateData: Record<string, any>) {
	const response = await fetch(`https://open-api.guesty.com/v1/listings/${listingId}`, {
		method: "PUT",
		headers: {
			Authorization: `Bearer ${accessToken}`,
			"Content-Type": "application/json",
			Accept: "application/json",
		},
		body: JSON.stringify(updateData),
	});

	const data = await response.json();
	return data;
}


// Find the query parameters from the docs
export async function getReservationList(accessToken: string) {
	const response = await fetch(`https://open-api.guesty.com/v1/reservations`, {
		method: "GET",
		headers: {
			Authorization: `Bearer ${accessToken}`,
			Accept: "application/json",
		},
	});

	const data = await response.json();
	return data;
}


export async function getReservation(accessToken: string, reservationId: string) {
	const response = await fetch(`https://open-api.guesty.com/v1/reservations/${reservationId}`, {
		method: "GET",
		headers: {
			Authorization: `Bearer ${accessToken}`,
			Accept: "application/json",
		},
	});

	const data = await response.json();
	return data;
}