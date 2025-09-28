"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { loadStripe } from "@stripe/stripe-js";
import { CheckoutProvider } from "@stripe/react-stripe-js";
import { createCheckoutSession, getPaymentPlans } from "@/actions/payments/stripe";
import CheckoutForm from "@/components/payments/CheckoutForm";

const stripePromise = loadStripe(
	process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

const CheckoutPage = ({ searchParams }: { searchParams: any }) => {
	// const searchParams = useSearchParams();
	const [isLoading, setIsLoading] = useState(true);
	const [plan, setPlan] = useState<any>(null);

	// This is a simplified example; in a real app, you might listen to element ready events
	useEffect(() => {
		const fetchPlan = async () => {
				const planIndex = searchParams.get("plan") as string;
				const paymentPlans = await getPaymentPlans();
				const selectedPlan = paymentPlans[parseInt(planIndex) || 0];
				setPlan(selectedPlan);
		}

		fetchPlan().then(() => stripePromise.then(() => setIsLoading(false))); // Set loading to false once Stripe is loaded and ready
	}, []);

	return (isLoading ? (
		<div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
			<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
			<h2 className="text-xl font-semibold text-gray-800 mb-2">Setting up your checkout session</h2>
			<p className="text-gray-600">Please wait while we prepare the checkout...</p>
		</div>
	) : (
		<CheckoutProvider
			stripe={stripePromise}
			options={{
				fetchClientSecret: async () =>
					createCheckoutSession(plan.priceId),
				elementsOptions: { appearance: { theme: "stripe" } },
			}}
		>
			<CheckoutForm plan={plan} />
		</CheckoutProvider>
	));
};

export default CheckoutPage;
