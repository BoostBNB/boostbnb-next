"use server";

import Stripe from "stripe";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { getUser } from "../auth";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export interface PaymentPlan {
	name: string;
	price: number | null;
	priceId: string;
	features: string[];
}


export async function createCheckoutSession(priceId: string): Promise<string> {
	const supabase = await createClient();
	const user = await getUser(supabase);

	const plans = await getPaymentPlans();
	const planName = plans.find((plan: any) => plan.priceId === priceId)?.name;

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
				session_id: session.id
			});

		if (insertError) {
			console.error("Error inserting subscription record:", insertError);
			throw new Error(
				"Failed to create subscription record: " + insertError?.message
			);
		}
	} else {
		// If a subscription already exists, update it
		// if (subData.is_complete) {
		// 	// If user is already subscribed and wants to update subscription, redirect to "Manage Subscription" page
		// 	console.error("Subscription already exists and is complete.");
		// 	redirect(`${process.env.NEXT_PUBLIC_SERVER_URL}/dashboard/profile`);
		// }

		const { error: insertError } = await supabase
			.from("subscriptions")
			.update({
				user_id: user.id,
				session_id: session.id
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
	const user = await getUser(supabase);

	const { data: subData, error: subError } = await supabase
		.from("subscriptions")
		.select("*")
		.eq("user_id", user.id)
		.single();

	if (subError || !subData) {
		console.error("Error fetching subscription data:", subError);
	}

	if (!subData.session_id || subData.is_complete == true) {
		console.error("No session ID found or plan is already set");
		// throw new Error("No session ID found or plan is already set");
		redirect(`${process.env.NEXT_PUBLIC_SERVER_URL}/dashboard/profile`);
	}

	const session = await stripe.checkout.sessions.retrieve(subData.session_id);
	console.log("Session retrieved:", session);

	const { error: updateError } = await supabase
		.from("subscriptions")
		.update({
			customer_id: session.customer,
			subscription_id: session.subscription,
			is_complete: session.status === "complete",
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


export async function getRelevantSubscriptionData(subscription: Stripe.Subscription) {
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

	const relevantData = await getRelevantSubscriptionData(subscription);
	return relevantData;
}


// Cancels the subscription so that it becomes inactive at the end of the period
export async function cancelSubscription(subscriptionId: string) {
	try {
		const subscription = await stripe.subscriptions.update(subscriptionId, {
			cancel_at_period_end: true,
		});

		const relevantData = await getRelevantSubscriptionData(subscription);
		return relevantData;
	} catch (error: any) {
		console.error("Error canceling subscription:", error);
		throw new Error("Failed to cancel subscription: " + error?.message);
	}
}


export async function stopCancellation(subscriptionId: string) {
	try {
		const subscription = await stripe.subscriptions.update(subscriptionId, {
			cancel_at_period_end: false,
		});

		const relevantData = await getRelevantSubscriptionData(subscription);
		return relevantData;
	} catch (error: any) {
		console.error("Error stopping cancellation:", error);
		throw new Error("Failed to stop cancellation: " + error?.message);
	}
}


// // Immediatly cancels a subscription 
// export async function cancelImmediately(subscriptionId: string) {
// 	try {
// 		const subscription = await stripe.subscriptions.cancel(subscriptionId);
// 		const relevantData = await getRelevantSubscriptionData(subscription);
// 		return relevantData;

// 	} catch (error: any) {
// 		console.error("Error canceling subscription:", error);
// 		throw new Error("Failed to cancel subscription: " + error?.message);
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
		// const updatedSubscription = await stripe.subscriptions.update(
		// 	subscriptionId,
		// 	{
		// 		items: [
		// 			{
		// 				id: currentItemId,
		// 				price: newPriceId,
		// 			},
		// 		],
		// 		// proration_behavior: "create_prorations", // Adjust proration behavior as needed
		// 	}
		// );
		const updatedSubscription = await stripe.subscriptions.update(
			subscriptionId,
			{
				items: [
					{
						id: currentItemId,
						deleted: true
					},
					{
						price: newPriceId
					}
				],
				// proration_behavior: "create_prorations", // Adjust proration behavior as needed
			}
		);

		const relevantData = await getRelevantSubscriptionData(updatedSubscription);
		return relevantData;
	} catch (error: any) {
		console.error("Error changing plan:", error);
		throw new Error("Failed to change plan: " + error);
	}
}


// Creates a subscription schedule that begins the new plan at the end of the current subscription period
export async function downgradePlan(subscriptionId: string, newPriceId: string): Promise<Stripe.SubscriptionSchedule> {
	try {
		// Creates subscription schedule
		const subscription = await stripe.subscriptions.retrieve(subscriptionId);

		const subscriptionSchedule = await stripe.subscriptionSchedules.create({
			from_subscription: subscriptionId,
			// end_behavior: "release",
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


export async function getPriceDetails(priceId: string) {
	const price = await stripe.prices.retrieve(priceId);

	if (!price) {
		throw new Error("Price not found: " + priceId);
	}

	return {
		id: price.id,
		unit_amount: price.unit_amount,
		currency: price.currency,
		product: price.product,
	};
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


export async function getPaymentPlans(): Promise<PaymentPlan[]> {
	let data: PaymentPlan[] = [
		{
			name: "Manual Mode",
			priceId: "price_1S2LNzIzxhp1ZvnG7rqMW42c",
			price: null,
			features: [
				"1 AirBNB listing",
				"Weekly audit reports",
				"Basic optimization tools",
				"Email Support",
				"Analytics Dashboard",
			]
		},
		{
			name: "Scrape Mode",
			priceId: "price_1S2LOFIzxhp1ZvnGWXRAw2Wz",
			price: null,
			features: [
				"Everything in Basic",
				"Up to 3 AirBNB listings",
				"Unlimited audit reports",
				"Advanced optimization tools",
				"Priority Support",
				"CoHost AI",
			]
		},
		{
			name: "PMS Starter",
			priceId: "price_1S2LP4Izxhp1ZvnGnsge8gKo",
			price: null,
			features: [
				"Everything in Pro",
				"24/7 VIP Support",
				"Dedicated manager",
				"Full competitor analysis",
			]
		},
		{
			name: "PMS Pro",
			priceId: "price_1S2LPGIzxhp1ZvnGzmJOod4a",
			price: null,
			features: ["Everything in Premium", "Unlimited listings"]
		},
	]

	for (let plan of data) {
		const priceDetails = await getPriceDetails(plan.priceId);
		plan.price = priceDetails.unit_amount ? priceDetails.unit_amount / 100 : 0;
	}
	
	return data;
}

