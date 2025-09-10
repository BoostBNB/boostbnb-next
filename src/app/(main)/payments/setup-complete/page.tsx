import Link from "next/link";
import React from 'react';
import { setDefaultPaymentMethod } from "@/actions/payments/stripe";
import { getUser } from "@/actions/auth";
import { createClient } from "@/utils/supabase/server";

export default async function SetupCompletePage({ params, searchParams }: { params: any; searchParams: any }) {
    const setupIntentId = searchParams.setup_intent;
    // const setupIntentClientSecret = searchParams.get('setup_intent_client_secret');
    const redirectStatus = searchParams.redirect_status;

    if (!setupIntentId || setupIntentId === '') {
        throw new Error('Missing setup_intent in query parameters');
    }
    
    const supabase = await createClient();
    const user = await getUser(supabase);
    const { data, error } = await supabase.from("subscriptions").select("*").eq("user_id", user?.id).single();

    if (error || !data) {
        throw new Error('Failed to retrieve subscription data');
    }

    await setDefaultPaymentMethod(data.customer_id, data.subscription_id, setupIntentId);

    return (
        <div
            style={{
                minHeight: '80vh',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'linear-gradient(135deg, #f0f4ff 0%, #e0ffe8 100%)',
                borderRadius: 16,
                boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
                padding: 32,
                margin: 24,
            }}
        >
                    <svg
                        width="72"
                        height="72"
                        viewBox="0 0 72 72"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        style={{ marginBottom: 16 }}
                    >
                        <circle cx="36" cy="36" r="36" fill="#22c55e" />
                        <path
                            d="M51 27L32.25 49L21 37.5"
                            stroke="#fff"
                            strokeWidth="4"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
            <h1 style={{ fontSize: 32, fontWeight: 700, marginBottom: 8 }}>Payment Method Added!</h1>
            <p style={{ fontSize: 18, color: '#4b5563', marginBottom: 16 }}>
                Your new payment method has been set up successfully.
            </p>
            {redirectStatus && (
                <div style={{ color: '#16a34a', fontWeight: 500, marginBottom: 24 }}>
                    Status: {redirectStatus}
                </div>
            )}
            <Link href="/dashboard/profile" className="bg-blue-500 text-white font-semibold py-2 px-4 rounded shadow hover:bg-blue-600 transition">
                Go Back to Profile
            </Link>
        </div>
    );
}
