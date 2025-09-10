"use client";

import { useState, useEffect } from "react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { createClient } from "@/utils/supabase/client";
import { createSetupIntent } from "@/actions/payments/stripe";
import { useRouter } from "next/navigation";
import SetupForm from "@/components/payments/SetupForm";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);


const AddPaymentMethod = () => {
    const router = useRouter();
    const [clientSecret, setClientSecret] = useState<string | null>(null);

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


    return clientSecret && (
        <Elements stripe={stripePromise} options={{ clientSecret: clientSecret as string }}>
            <SetupForm />
        </Elements>
    );

};

export default AddPaymentMethod;