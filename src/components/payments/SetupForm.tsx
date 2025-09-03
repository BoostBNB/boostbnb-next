"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js"
import { createSetupIntent } from "@/actions/payments/stripe";

export default function SetupForm() {
    const elements = useElements();
    const stripe = useStripe();
    const router = useRouter();
    const [clientSecret, setClientSecret] = useState<string>("");

    const fetchClientSecret = async (): Promise<string> => {
        const supabase = await createClient();
        const { data: { user }, error } = await supabase.auth.getUser();

        if (error || !user) {
            router.push('/log-in');
            return '';
        }

        const { data: subData, error: subError } = await supabase
            .from('subscriptions')
            .select('customer_id')
            .eq('user_id', user.id)
            .single();

        if (subError || !subData) {
            throw new Error('Failed to retrieve subscription data');
        }

        const _clientSecret = await createSetupIntent(subData.customer_id);

        if (!_clientSecret) {
            throw new Error('Failed to create setup intent');
        }

        setClientSecret(_clientSecret);
        return _clientSecret;
    }

    useEffect(() => {
        fetchClientSecret();
    }, []);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!clientSecret) {
            console.error('Client secret is not available');
            return;
        }

        if (!stripe || !elements) {
            console.error("Stripe.js has not loaded");
            return;
        }

        const { error } = await stripe.confirmSetup({
            elements,
            clientSecret,
            confirmParams: {
                // Return URL where the user will be redirected after authentication.
                return_url: `${window.location.origin}/setup-complete`,
            },
        });

    }

    return (
        <form onSubmit={handleSubmit}>
            <PaymentElement />
            <button type="submit">Submit</button>
        </form>
    )
}