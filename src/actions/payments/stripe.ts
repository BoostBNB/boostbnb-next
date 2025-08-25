"use server";

import Stripe from "stripe";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

function getPlanFromPriceId(priceId: string) {
	const plans: { [key: string]: string } = {
		price_1Rx6ewEl7NEhfNbPpIfwigfP: "Manual Mode",
		price_1Rx7KOEl7NEhfNbPzOu3MWsu: "Scrape Mode",
		// Add other priceId to plan name mappings here
	};

	return plans[priceId] || "none";
}

export async function createCheckoutSession(priceId: string): Promise<string> {
	const supabase = await createClient();
	const {
		data: { user },
		error,
	} = await supabase.auth.getUser();

	if (error || !user) {
		console.error("User not authenticated or error fetching user:", error);
		redirect("/log-in");
	}

	const session = await stripe.checkout.sessions.create({
		ui_mode: "custom",
		payment_method_types: ["card"],
		line_items: [
			{
				price: priceId,
				quantity: 1,
			},
		],
		customer_email: user.email,
		metadata: {
			userId: user.id,
		},
		mode: "subscription",
		return_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/payments/complete?session_id={CHECKOUT_SESSION_ID}`,
	});

	const { data: subData, error: subError } = await supabase
		.from("subscriptions")
		.select("*")
		.eq("user_id", user.id)
		.single();

	if (subError || !subData) {
		// If no subscription exists, create a new one
		const { error: insertError } = await supabase
			.from("subscriptions")
			.insert({
				user_id: user.id,
				session_id: session.id,
				plan: getPlanFromPriceId(priceId),
			});

		if (insertError) {
			console.error("Error inserting subscription record:", insertError);
			throw new Error(
				"Failed to create subscription record: " + insertError?.message
			);
		}
	} else {
		// If a subscription already exists, update it
		if (subData.is_active) {
			// If user has already verified their subscription, redirect them to the dashboard
			console.error("Subscription already exists and is active.");
			redirect(`${process.env.NEXT_PUBLIC_SERVER_URL}/dashboard`);
		}

		const { error: insertError } = await supabase
			.from("subscriptions")
			.update({
				user_id: user.id,
				session_id: session.id,
				plan: getPlanFromPriceId(priceId),
			})
			.eq("user_id", user.id);

		if (insertError) {
			console.error("Error inserting subscription record:", insertError);
			throw new Error(
				"Failed to create subscription record: " + insertError?.message
			);
		}
	}

	return session.client_secret as string;
}

export async function confirmPaymentSuccess() {
	const supabase = await createClient();
	const {
		data: { user },
		error,
	} = await supabase.auth.getUser();

	if (error || !user) {
		console.error("User not authenticated or error fetching user:", error);
		redirect("/log-in");
	}

	console.log("Current User ID: ", user.id);

	const { data: subData, error: subError } = await supabase
		.from("subscriptions")
		.select("*")
		.eq("user_id", user.id)
		.single();

	if (subError || !subData) {
		console.error("Error fetching subscription data:", subError);
		throw new Error(
			"Failed to fetch subscription data: " + subError?.message
		);
	}

	if (!subData.session_id || subData.is_active == true) {
		console.error("No session ID found or plan is already set");
		throw new Error("No session ID found or plan is already set");
	}

	const session = await stripe.checkout.sessions.retrieve(subData.session_id);
	console.log("Session retrieved:", session);

	const { error: updateError } = await supabase
		.from("subscriptions")
		.update({
			customer_id: session.customer,
			subscription_id: session.subscription,
			is_active: session.status === "complete",
		})
		.eq("user_id", user.id);

	if (updateError) {
		console.error("Error updating subscription record:", updateError);
		throw new Error(
			"Failed to update subscription record: " + updateError.message
		);
	}

	return {
		id: session.id,
		status: session.status,
		customer: session.customer,
		subscription: session.subscription,
	};
}

export async function getSubscriptionDetails(subscriptionId: string) {
	const subscription = await stripe.subscriptions.retrieve(subscriptionId);

	if (!subscription) {
		console.error(
			"No subscription found for the given ID: " + subscriptionId
		);
		throw new Error(
			"No subscription found for the given ID: " + subscriptionId
		);
	}

	return {
		id: subscription.id,
		status: subscription.status,
		customer: subscription.customer as string,
		items: subscription.items.data.map((item) => ({
			id: item.id,
			current_period_end: item.current_period_end,
			current_period_start: item.current_period_start,
			price: {
				id: item.price.id,
				nickname: item.price.nickname,
				unit_amount: item.price.unit_amount,
				currency: item.price.currency,
			},
			quantity: item.quantity,
		})),

		cancel_at_period_end: subscription.cancel_at_period_end,
		cancel_at: subscription.cancel_at
			? new Date(subscription.cancel_at * 1000).toISOString()
			: null,
		canceled_at: subscription.canceled_at
			? new Date(subscription.canceled_at * 1000).toISOString()
			: null,
		cancellation_details: subscription.cancellation_details,
	};
}

export async function cancelSubscription(subscriptionId: string) {
	try {
		const supabase = await createClient();
		const { data: { user }, error } = await supabase.auth.getUser();

		if (error || !user) {
			console.error("User not authenticated or error fetching user:", error);
			throw new Error("User not authenticated or error fetching user:" + error?.message);
		}

		const { error: updateError } = await supabase
			.from("subscriptions")
			.update({
				is_active: false,
			})
			.eq("user_id", user?.id);
		
		if (updateError) {
			console.error("Error updating subscription record:", updateError);
			throw new Error(
				"Failed to update subscription record: " + updateError?.message
			);
		}

		const subscription = await stripe.subscriptions.cancel(subscriptionId);
		return subscription;

	} catch (error: any) {
		console.error("Error canceling subscription:", error);
		throw new Error("Failed to cancel subscription: " + error?.message);
	}
}

// export async function stopCancellation(subscriptionId: string) {
// 	try {
// 		const subscription = await stripe.subscriptions.update(subscriptionId, {
// 			cancel_at_period_end: false,
// 		});

// 		return subscription;
// 	}
// 	catch (error: any) {
// 		console.error("Error stopping cancellation:", error);
// 		throw new Error("Failed to stop cancellation: " + error?.message);
// 	}
// }

// Simply updates the subscription to immediately replace the old plan with the new one
export async function upgradePlan(subscriptionId: string, newPriceId: string) {
	try {
		// Retrieve the subscription to get the current subscription item ID
		const subscription = await stripe.subscriptions.retrieve(
			subscriptionId
		);
		const currentItemId = subscription.items.data[0].id;

		// Update the subscription with the new price
		const updatedSubscription = await stripe.subscriptions.update(
			subscriptionId,
			{
				items: [
					{
						id: currentItemId,
						price: newPriceId,
					},
				],
				// proration_behavior: "create_prorations", // Adjust proration behavior as needed
			}
		);

		return updatedSubscription;
	} catch (error: any) {
		console.error("Error changing plan:", error);
		throw new Error("Failed to change plan: " + error);
	}
}

// Creates a subscription schedule that begins the new plan at the end of the current subscription period
export async function downgradePlan(
	subscriptionId: string,
	newPriceId: string
) {
	try {
		// Creates subscription schedule
		const subscription = await stripe.subscriptions.retrieve(subscriptionId);

		const subscriptionSchedule = await stripe.subscriptionSchedules.create({
			from_subscription: subscriptionId,
			end_behavior: "release",
		});

		const newSubscriptionSchedule = await stripe.subscriptionSchedules.update(
			subscriptionSchedule.id,
			{
			  phases: [
				{
				  items: [
					{
					  price: subscription.items.data[0].price.id,
					  quantity: 1,
					},
				  ],
				  iterations: 1
				},
				{
				  items: [
					{
					  price: newPriceId,
					  quantity: 1,
					},
				  ],
				},
			  ],
			}
		)

		return newSubscriptionSchedule;
	} catch (error: any) {
		console.error("Failed to downgrade plan: " + error);
		throw new Error("Failed to downgrade plan: " + error);
	}
}

export async function getCustomerPaymentMethods(customerId: string) {
	const paymentMethods = await stripe.paymentMethods.list({
		customer: customerId,
		type: "card",
	});

	if (!paymentMethods || paymentMethods.data.length === 0) {
		console.error(
			"No payment methods found for the given customer ID: " + customerId
		);
		throw new Error(
			"No payment methods found for the given customer ID: " + customerId
		);
	}

	return paymentMethods.data.map((method) => ({
		id: method.id,
		created: new Date(method.created * 1000).toISOString(),
		us_bank_account: method.us_bank_account,
		metadata: method.metadata,
	}));
}

export async function getCustomerPaymentIntents(customerId: string) {
	const paymentIntents = await stripe.paymentIntents.list({
		customer: customerId,
		limit: 10,
	});

	if (!paymentIntents || paymentIntents.data.length === 0) {
		console.error(
			"No payment intents found for the given customer ID: " + customerId
		);
		throw new Error(
			"No payment intents found for the given customer ID: " + customerId
		);
	}

	return paymentIntents.data.map((intent) => ({
		id: intent.id,
		amount: intent.amount,
		currency: intent.currency,
		status: intent.status,
		created: new Date(intent.created * 1000).toISOString(),
	}));
}

export async function getUserSubscriptionData() {
	const supabase = await createClient();
	const {
		data: { user },
		error: userError,
	} = await supabase.auth.getUser();

	if (userError || !user) {
		console.error("User not authenticated or error fetching user:", userError);
		return null;
	}

	const { data: subData, error: subError } = await supabase
		.from("subscriptions")
		.select("*")
		.eq("user_id", user.id)
		.single();

	if (subError || !subData) {
		console.error("Error fetching subscription:", subError);
		throw new Error("Failed to fetch subscription data: " + subError?.message);
	}

	return subData;
}
