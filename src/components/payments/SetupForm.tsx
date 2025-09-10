"use client";

import { PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js"

export default function SetupForm() {
    const elements = useElements();
    const stripe = useStripe();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!stripe || !elements) {
            console.error("Stripe.js has not loaded");
            return;
        }

        const { error } = await stripe.confirmSetup({
            elements,
            confirmParams: {
                // Return URL where the user will be redirected after authentication.
                return_url: `${window.location.origin}/payments/setup-complete`,
            },
        });

    }

    return (
        <form onSubmit={handleSubmit}>
            <PaymentElement />
            <button type="submit" className="m-3 p-3 border-1 bg-blue-200 hover:bg-blue-300">Submit</button>
        </form>
    )
}