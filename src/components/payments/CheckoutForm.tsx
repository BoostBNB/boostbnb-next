"use client";
// Lots of help from : https://docs.stripe.com/checkout/custom/quickstart?lang=node&client=react

import React, { useState } from "react";
import { useCheckout, PaymentElement } from "@stripe/react-stripe-js";

const CheckoutForm = ({ plan }: { plan: any }) => {
	const checkout = useCheckout();

	const [message, setMessage] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(false);

	const handleSubmit = async (e: any) => {
		e.preventDefault();

		setIsLoading(true);

		if (!checkout.canConfirm) {
			console.error("Unable to confirm checkout");
		}

		console.log("Confirming Checkout...");
		const confirmResult = await checkout.confirm();

		// This point will only be reached if there is an immediate error when
		// confirming the payment. Otherwise, your customer will be redirected to
		// your `return_url`. For some payment methods like iDEAL, your customer will
		// be redirected to an intermediate site first to authorize the payment, then
		// redirected to the `return_url`.
		if (confirmResult.type === "error") {
			setMessage(confirmResult.error.message);
		}

		setIsLoading(false);
	};

	return (
		<form
			onSubmit={handleSubmit}
			className="w-full border-2 flex flex-col items-center"
		>
			<div className="w-[50vw] ">
				<h1 className="font-bold text-3xl">
					BoostBNB {plan.name} Subsciption
				</h1>
				<h3 className="text-lg font-bold mb-5 bg-gray-300 p-2 w-fit">
					${plan.price} /month
				</h3>

				<h4>Payment</h4>
				<PaymentElement id="payment-element" />
				{isLoading ? (
					<h1 className="text-center w-full my-4 p-2 bg-blue-300 rounded-md animate-pulse">
						Loading...
					</h1>
				) : (
					<button
						disabled={isLoading}
						id="submit"
						className="bg-blue-300 w-full p-2 text-center my-4 font-bold hover:bg-blue-400"
					>
						Subscribe
					</button>
				)}

				{/* Show any error or success messages */}
				{message && <div id="payment-message">{message}</div>}
			</div>
		</form>
	);
};

export default CheckoutForm;
