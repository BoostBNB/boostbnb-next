"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

function base64encode(text: string): string {
	const encoder = new TextEncoder();
	const encodedBytes = encoder.encode(text);
	const binaryStringForBtoa = String.fromCharCode(...encodedBytes);
	const base64Encoded = btoa(binaryStringForBtoa);
	return base64Encoded;
}

function Feature({ content }: { content: string }) {
	return (
		<div className="flex items-center gap-2">
			<img src="/icons/check_fill.svg" alt="mingcute:check_fill" />
			{content}
		</div>
	);
}

export default function Pricing() {
	const router = useRouter();
	const [plans, setPlans] = useState([
		{
			name: "Manual Mode",
			price: 12,
			priceId: "price_1Rx6ewEl7NEhfNbPpIfwigfP",
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
			price: 15,
			priceId: "price_1Rx7KOEl7NEhfNbPzOu3MWsu",
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
			price: 19,
			priceId: "",
			features: [
				"Everything in Pro",
				"24/7 VIP Support",
				"Dedicated manager",
				"Full competitor analysis",
			]
		},
		{
			name: "PMS Pro",
			price: 39,
			priceId: "",
			features: ["Everything in Premium", "Unlimited listings"]
		},
	]);

	return (
		<div
			className="mt-8 flex w-full flex-col items-center gap-8 bg-gray-300 pb-16 pt-8"
			id="pricing"
		>
			<div className="flex flex-col gap-2 text-center">
				<h1 className="text-3xl font-bold">Pricing</h1>
				<span className="mx-3">
					Whatever your status, our offers evolve according to your
					needs
				</span>
			</div>

			<div className="grid grid-cols-1 items-start gap-8 px-2 md:grid-cols-4">
				{plans.map((plan, index) => (
					<div
						key={index}
						className="intersect-once relative flex h-fit min-h-[28rem] flex-col gap-6 rounded-2xl bg-gray-100 p-8 pb-32 shadow-lg"
					>
						<div className="flex flex-col gap-4">
							<h2 className="text-center text-xl">{plan.name}</h2>
							<h1 className="text-center text-5xl">
								<span className="w-fit font-bold leading-none">
									${plan.price}
								</span>
								<span className="text-2xl">/Month</span>
							</h1>
						</div>
						<div className="flex flex-col">
							{plan.features.map((feature, idx) => (
								<Feature key={idx} content={feature} />
							))}
						</div>
						<div className="absolute bottom-8 left-0 z-10 flex w-full justify-center">
							<button className="btn btn-neutral w-3/4" onClick={() => router.push(`/payments/checkout?plan=${base64encode(JSON.stringify(plan))}`)}>
								Get {plan.name}
							</button>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
