"use server";

import { scrapeAirbnbListing } from "./old-scraper";
import { getPropertyInfo } from "./scraper";
import { askChatGPT } from "./chat";
import { createClient } from "@/utils/supabase/server";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const urlRegex = /^https:\/\/www\.airbnb\.com\/rooms\/.+$/;

export async function createListing(formData: FormData) {
	const supabase = await createClient();
	const url = formData.get("bnburl");

	const {
		data: { user },
		error: userError,
	} = await supabase.auth.getUser();

	if (userError) {
		console.error(userError);
		return;
	}

	// Validate the URL
	if (!url || typeof url !== "string") {
		console.error({ success: false, error: "Invalid URL format" });
		return;
	}

	let scrapedData;
	try {
		scrapedData = await getPropertyInfo(url); //await scrapeAirbnbListing(url);
	} catch (error) {
		console.error("Scraping failed:", error);
		return;
	}

	const { data, error } = await supabase
		.from("listings")
		.insert([{ user_id: user?.id, url, data: scrapedData }]) //  Save scraped JSON
		.select();

	if (error) {
		if (error.code === "23505") {
			// Duplicate entry (violates UNIQUE constraint)
			console.error("Duplicate Entry");
			return;
		}
		console.error(`Error ${error?.code} in adding listing`);
		return;
	}

	return scrapedData;
}


export async function analyzeListing(formData: FormData) {
	const url = formData.get("url") as string;
	const email = formData.get("email") as string;

	if (!emailRegex.test(email)) {
		throw new Error("Invalid email format");
	}

	if (!urlRegex.test(url)) {
		throw new Error("Invalid URL format");
	}

	// Adds Email To The Database
	const supabase = await createClient();
	const { error } = await supabase.from("emails").insert({ email });

	if (error) {
		if (error.code == "23505") {
			console.log("Warning: User entered a duplicate email");
		} else {
			console.error(error);
			throw new Error("Failed to insert new email into the database");
		}
	}

	try {
		// Scrape the listing details
		const listing_details = await scrapeAirbnbListing(url);
		console.log(listing_details);

		console.log(listing_details);
		// Construct ChatGPT prompt with scraped data
		const prompt = `
You are an expert in Airbnb listing optimization. Your task is to 
analyze the following listing data and provide a comprehensive audit, 
including an overall score and actionable feedback to improve the 
listing's performance. Focus on key areas: Title & Description, 
Pricing, Photos, Reviews, Amenities, and SEO:
--Listing Details--
- Title: ${listing_details.title}
- Description: ${listing_details.description}
- Property Type: ${listing_details.propertyType}
- Room Type: ${listing_details.roomType}
- Location: ${listing_details.location}
- Guest Capacity: ${listing_details.guestCapacity}
--Pricing--
- Nightly Rate: $${listing_details.pricing?.nightlyRate}
- Cleaning Fee: $${listing_details.pricing?.cleaningFee}
- Dynamic Pricing: ${listing_details.pricing?.dynamicPricing}
- Minimum Stay: ${listing_details.pricing?.minimumStay} nights
--Photos--
- Photo Count: ${listing_details.photos?.photoCount}
- Captions: ${listing_details.photos?.captions}
--Reviews--
- Review Count: ${listing_details.reviews?.reviewCount}
- Rating: ${listing_details.reviews?.rating}
- Recent Reviews: ${listing_details.reviews?.recentReviews}
--Amenities--
- Provided Amenities: ${listing_details.amenities?.provided.join(", ")}
- Missing Amenities: ${listing_details.amenities?.missing.join(", ")}
--SEO--
-keywords: ${listing_details.seo?.keywordsInTitle}
-description: ${listing_details.seo?.keywordsInDescription}

Provide:
1. An overall score out of 100 with reasoning.
2. Feedback on each category.
3. Top 3 action items to improve this listing.

Return the result as JSON.
`;

		const result = await askChatGPT(prompt);

		console.log("Audit Result: ", result);
		//return result;
	} catch (error) {
		console.error("Error auditing listing:", error);
		throw new Error("Failed to audit Airbnb listing");
	}
}


export async function getCohostResponse(initialState: any, formData: FormData) {
	const supabase = await createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();

	// Fail if the user object dosen't exist
	if (!user) {
		console.log("No User Found");
		return { success: false, error: "User is undefined" };
	}

	console.log("Requesting ChatGPT");

	// Fetch Existing Listings on Current User
	const { data: listingContext, error } = await supabase
		.from("listings")
		.select("url, data")
		.eq("user_id", user.id);

	if (error) {
		console.log(error);
		return { success: false, error };
	}

	// Get User Prompt
	const prompt = formData.get("prompt") as string;

	if (!prompt) {
		console.log("No prompt Present");
		return { success: false, error: "No prompt given" };
	}

	//Format listing data and user message into Prompt Engineered text
	const structuredPrompt = `
    You are Cohost AI, an intelligent assistant specialized in helping Airbnb hosts optimize their listings and manage guest interactions.
    Your primary tasks include:
    - Improving listing descriptions for better search ranking and guest appeal.
    - Providing responses to guest inquiries and reviews in a professional, engaging manner.
    - Suggesting pricing and amenities improvements based on similar top-performing listings.
    - Assisting with host messaging and automation strategies.
   
    User's Listings:
    ${JSON.stringify(listingContext)}
   
    User's Request:
    ${prompt}
   
    Provide a clear, concise, and optimized response or suggestion.
    `;

	//console.log('Prompt: ', structuredPrompt);

	const result = await askChatGPT(structuredPrompt);
	//console.log('Response: ', result);

	// Save User Prompt and ChatGPT response to Database

	const { data: userDataOrNull, error: dbError } = await supabase
		.from("cohost_conversations")
		.select("chats")
		.eq("user_id", user.id);
	let userData = userDataOrNull;

	if (dbError) {
		console.error("DB Error: ", dbError);
		return { success: false, error: dbError };
	}

	// If user is not yet registered in cohost_conversations table
	if (userData?.length == 0 || userData == null) {
		const { error: insErr } = await supabase
			.from("cohost_conversations")
			.insert({
				user_id: user.id,
				chats: [],
			});

		if (insErr) {
			console.error(insErr);
			return { success: false, error: insErr };
		}

		const res = await supabase
			.from("cohost_conversations")
			.select("chats")
			.eq("user_id", user.id);

		if (res.error || res.data == null) {
			console.error(res.error);
			return { success: false, error: res.error };
		}

		userData = res.data;
	}

	//console.log("User Data: ", userData);

	const chats = [...userData[0].chats];

	chats.push({
		user_prompt: prompt,
		chat_response: result,
		timestamp: new Date(Date.now()).toString(),
	});

	console.log("Chats: ", chats);

	const { error: insError } = await supabase
		.from("cohost_conversations")
		.update({ chats })
		.eq("user_id", user.id);

	if (insError) {
		console.error("Insertion Error: ", insError);
		return { success: false, error: insError };
	}

	return { success: true, result };
}
