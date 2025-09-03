"use client";

import { useState, useEffect } from "react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { createClient } from "@/utils/supabase/client";
import { createSetupIntent } from "@/actions/payments/stripe";
import { useRouter } from "next/navigation";
import SetupForm from "@/components/payments/SetupForm";

const stripePromise = loadStripe('pk_test_51S2LK3Izxhp1ZvnGzHBmQl49sDxeoYM4oXVAkeeOkc821JpUvQ0jJbrNTfITsCQZuFb5YiavyZ4eLFtiaUtlGmKI008LUk0Apx');


const AddPaymentMethod = () => {
    return (
        <Elements stripe={stripePromise}>
            <SetupForm />
        </Elements>
    );

};

export default AddPaymentMethod;