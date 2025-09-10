import { getUser } from '@/actions/auth'
import { getCustomerInfo, getCustomerPaymentMethods, getSubscriptionDetails } from '@/actions/payments/stripe';
import { createClient } from '@/utils/supabase/server';
import React from 'react'

const TestPage = async () => {
	const supabase = await createClient();
	const user = await getUser(supabase);

	const { data, error } = await supabase.from("subscriptions").select("*").eq("user_id", user?.id).single();
	console.log("Subscription Data: ", data, error);

	const subscription = await getSubscriptionDetails(data.subscription_id);
	console.log("Subscription Details: ", subscription);

	const paymentMethods = await getCustomerPaymentMethods(data.customer_id);
	console.log("Payment Methods: ", paymentMethods);

	const customer = await getCustomerInfo(data.customer_id);
	console.log("Customer Info: ", customer);

	return (
		<div>
			<h1>Test Page</h1>
			<pre>{JSON.stringify({ user, subscription, paymentMethods, customer }, null, 4)}</pre>
		</div>
	)
}

export default TestPage