"use client";

import {
	getSubscriptionDetails,
	getCustomerPaymentMethods,
	getCustomerPaymentIntents,
	getPriceDetails,
	upgradePlan,
	downgradePlan,
	cancelSubscription,
	stopCancellation,
	PaymentPlan,
	getPaymentPlans
} from "@/actions/payments/stripe";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

interface SubscriptionData {
	user_id: string;
	customer_id: string;
	subscription_id: string;
	is_complete: boolean;
}

interface StripeData {
	subscription: any;
	paymentMethods: any[];
	paymentIntents: any[];
	priceDetails: any;
}

const ManageSubscription = () => {
	const [subData, setSubData] = useState<SubscriptionData | null>(null);
	const [stripeData, setStripeData] = useState<StripeData | null>(null);
	const [switchPlanMenuOpen, setSwitchPlanMenuOpen] = useState(false);
	const [paymentPlans, setPaymentPlans] = useState<PaymentPlan[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [actionLoading, setActionLoading] = useState(false);
	const router = useRouter();

	useEffect(() => {
		fetchSubscriptionData();
	}, []);

	const fetchSubscriptionData = async () => {
		try {
			setLoading(true);
			const plans = await getPaymentPlans();
			setPaymentPlans(plans);

			const supabase = await createClient();
			const { data: { user }, error: userError } = await supabase.auth.getUser();

			if (!user || userError) {
				console.error(userError);
				router.push("/log-in");
				return;
			}

			const { data: subData, error: subError } = await supabase
				.from("subscriptions")
				.select("*")
				.eq("user_id", user.id)
				.single();

			if (subError || !subData) {
				console.error("Error fetching subscription data:", subError);
				throw new Error(
					"Failed to fetch subscription data: " + subError?.message
				);
			}

			setSubData(subData);

			// Fetch Stripe data
			const subscription = await getSubscriptionDetails(subData.subscription_id);
			const priceDetails = await getPriceDetails(subscription.items[0].price.id);

			const [paymentMethods, paymentIntents] = await Promise.all([
				getCustomerPaymentMethods(subData.customer_id),
				getCustomerPaymentIntents(subData.customer_id)
			]);

			setStripeData({ subscription, paymentMethods, paymentIntents, priceDetails });
		} catch (err: any) {
			console.error("Error fetching data:", err);
			setError(err.message || "Failed to fetch subscription data");
		} finally {
			setLoading(false);
		}
	};

	const formatDate = (timestamp: number) => {
		return new Date(timestamp * 1000).toLocaleDateString();
	};

	const formatAmount = (amount: number, currency: string) => {
		return new Intl.NumberFormat('en-US', {
			style: 'currency',
			currency: currency.toUpperCase(),
		}).format(amount / 100);
	};

	const handleCancelSubscription = async () => {
		if (!subData || actionLoading) return;
		
		try {
			setActionLoading(true);
			await cancelSubscription(subData.subscription_id);
			await fetchSubscriptionData(); // Refresh data
		} catch (err: any) {
			console.error("Error canceling subscription:", err);
			alert("Failed to cancel subscription. Please try again.");
		} finally {
			setActionLoading(false);
		}
	};

	const handleStopCancellation = async () => {
		if (!subData || actionLoading) return;
		
		try {
			setActionLoading(true);
			await stopCancellation(subData.subscription_id);
			await fetchSubscriptionData(); // Refresh data
		} catch (err: any) {
			console.error("Error canceling subscription:", err);
			alert("Failed to cancel subscription. Please try again.");
		} finally {
			setActionLoading(false);
		}
	};

	const handleUpgradePlan = async (newPriceId: string) => {
		if (!subData || actionLoading) return;
		
		try {
			setActionLoading(true);
			await upgradePlan(subData.subscription_id, newPriceId);
			await fetchSubscriptionData(); // Refresh data
		} catch (err: any) {
			console.error("Error upgrading plan:", err);
			alert("Failed to upgrade plan. Please try again.");
		} finally {
			setActionLoading(false);
		}
	};

	const handleDowngradePlan = async (newPriceId: string) => {
		if (!subData || actionLoading) return;
		
		try {
			setActionLoading(true);
			await downgradePlan(subData.subscription_id, newPriceId);
			await fetchSubscriptionData(); // Refresh data
		} catch (err: any) {
			console.error("Error downgrading plan:", err);
			alert("Failed to downgrade plan. Please try again.");
		} finally {
			setActionLoading(false);
		}
	};

	if (loading) {
		return (
			<div className="w-full max-w-6xl mx-auto p-6">
				<div className="text-center">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
					<p className="mt-4 text-gray-600">Loading subscription data...</p>
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="w-[90%] border border-red-500 rounded-lg p-4">
				<h1 className="text-bold text-2xl text-red-600">Error</h1>
				<p className="text-red-500 mt-2">{error}</p>
				<button 
					onClick={fetchSubscriptionData}
					className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
				>
					Retry
				</button>
			</div>
		);
	}

	if (!subData || !stripeData) {
		return (
			<div className="w-[90%] border border-yellow-500 rounded-lg p-4">
				<h1 className="text-bold text-2xl text-yellow-600">No Data</h1>
				<p className="text-yellow-500 mt-2">No subscription data found.</p>
			</div>
		);
	}

	const { subscription, paymentMethods, paymentIntents } = stripeData;

	return (
		<div className="w-full max-w-6xl mx-auto p-6 space-y-6">
			<h1 className="text-3xl font-bold text-gray-800">Manage Subscription</h1>
			
			{/* Subscription Details */}
			<div className="bg-white border rounded-lg p-6 shadow-sm">
				<h2 className="text-xl font-semibold mb-4">Current Subscription</h2>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<div>
						<p><strong>Status:</strong> <span className={`px-2 py-1 rounded text-sm ${subscription?.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>{subscription?.status}</span></p>
						<p><strong>Plan:</strong> {paymentPlans.find(p => p.priceId === stripeData.priceDetails.id)?.name}</p>
						<p><strong>Customer ID:</strong> {subscription?.customer}</p>
					</div>
					<div>
						<p><strong>Cancel at period end:</strong> {subscription?.cancel_at_period_end ? 'Yes' : 'No'}</p>
						{subscription?.cancel_at && <p><strong>Cancel at:</strong> {subscription?.cancel_at}</p>}
						{subscription?.canceled_at && <p><strong>Canceled at:</strong> {subscription?.canceled_at}</p>}
					</div>
				</div>
				
				{/* Subscription Items */}
				<div className="mt-6">
					<h3 className="text-lg font-medium mb-3">Plan Details</h3>
					{subscription?.items.map((item: any) => (
						<div key={item.id} className="border rounded p-4 mb-2">
							<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
								<div>
									<p><strong>Price:</strong> {formatAmount(item.price.unit_amount, item.price.currency)}</p>
									<p><strong>Quantity:</strong> {item.quantity}</p>
								</div>
								<div>
									<p><strong>Current Period:</strong></p>
									<p className="text-sm text-gray-600">
										{formatDate(item.current_period_start)} - {formatDate(item.current_period_end)}
									</p>
								</div>
								<div>
									<p><strong>Price ID:</strong> <code className="text-xs bg-gray-100 px-1 rounded">{item.price.id}</code></p>
								</div>
							</div>
						</div>
					))}
				</div>
			</div>

			{/* Plan Management Actions */}
			<div className="bg-white border rounded-lg p-6 shadow-sm">
				<h2 className="text-xl font-semibold mb-4">Plan Management</h2>
				<div className="space-y-4">
					<div className="flex flex-wrap gap-3">
						<button
							onClick={() => setSwitchPlanMenuOpen(true)}
							className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
							disabled={actionLoading}
						>
							Switch Subscription
						</button>
					</div>
					<button
						onClick={handleCancelSubscription}
						className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
						disabled={subscription?.cancel_at_period_end || actionLoading}
					>
						{actionLoading ? 'Processing...' : subscription?.cancel_at_period_end ? 'Cancellation Scheduled' : 'Cancel Subscription'}
					</button>
					<button
						onClick={handleStopCancellation}
						className="ml-5 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
						disabled={!subscription?.cancel_at_period_end || actionLoading}
					>
						{actionLoading ? 'Processing...' : 'Stop Cancellation'}
					</button>
				</div>
			</div>

			<div id="switch-plan-menu" className={switchPlanMenuOpen ? "shadow-lg overflow-y-scroll fixed top-[25%] right-10 w-200 h-[50%] bg-gray-300 border-1 rounded-lg" : "hidden"}>
					<div className="flex justify-around items-center p-3 border-b-1">
						<h1 className="text-2xl font-bold">Switch Subscription Plan</h1>
						<button className="p-3 border-1 rounded-md border-red-400 text-red-400 hover:bg-red-100" onClick={() => setSwitchPlanMenuOpen(false)}>Close</button>
					</div>
					<div>
						{paymentPlans.map((plan: PaymentPlan, index: number) => (
							<div key={index} className="m-4 p-4 border rounded-lg bg-white">
								<h2 className="text-xl font-semibold mb-2">{plan.name}</h2>
								<p className="mb-2">${plan.price} / month</p>
								<ul className="list-disc list-inside mb-4">
									{plan.features.map((feature, idx) => (
										<li key={idx}>{feature}</li>
									))}
								</ul>
								{plan.priceId === stripeData.priceDetails.id ? (
									<button className="px-4 py-2 bg-gray-400 text-white rounded cursor-not-allowed" disabled>Current Plan</button>
								) : (
									<button
										className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
										onClick={() => {
											if (plan.price! > stripeData.priceDetails.unit_amount / 100) {
												handleUpgradePlan(plan.priceId);
											} else {
												handleDowngradePlan(plan.priceId);
											}
										}}
										disabled={actionLoading}
									>
										{actionLoading ? 'Processing...' : plan.price! > stripeData.priceDetails.unit_amount / 100 ? 'Upgrade to this Plan' : 'Downgrade to this Plan'}
									</button>
								)}
							</div>
						))}
					</div>
			</div>

			{/* Payment Methods */}
			<div className="bg-white border rounded-lg p-6 shadow-sm">
				<h2 className="text-xl font-semibold mb-4">Payment Methods</h2>
				{paymentMethods && paymentMethods.length > 0 ? (
					<div className="space-y-4">
						{paymentMethods.map((method: any) => (
							<div key={method.id} className="border rounded-lg p-4 bg-gray-50">
								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									<div>
										<p className="mb-2">
											<strong>Method ID:</strong> 
											<code className="text-xs bg-gray-200 px-2 py-1 rounded ml-2">{method.id}</code>
										</p>
										<p className="mb-2">
											<strong>Type:</strong> 
											<span className="capitalize bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm ml-2">
												{method.type?.replace('_', ' ')}
											</span>
										</p>
										<p className="mb-2">
											<strong>Created:</strong> {formatDate(method.created)}
										</p>
									</div>
								</div>

								{/* Payment Method Specific Details */}
								<div className="mt-4 pt-4 border-t border-gray-200">
									{/* US Bank Account Details */}
									{method.us_bank_account && (
										<div className="bg-white rounded-lg p-4 border">
											<h4 className="font-medium text-gray-700 mb-3 flex items-center">
												<svg className="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
													<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3-3z" />
												</svg>
												US Bank Account Details
											</h4>
											<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
												<div>
													{method.us_bank_account.bank_name && (
														<p className="mb-2">
															<strong>Bank:</strong> {method.us_bank_account.bank_name}
														</p>
													)}
													{method.us_bank_account.account_type && (
														<p className="mb-2">
															<strong>Account Type:</strong> 
															<span className="capitalize bg-green-100 text-green-800 px-2 py-1 rounded text-sm ml-2">
																{method.us_bank_account.account_type}
															</span>
														</p>
													)}
													{method.us_bank_account.account_holder_type && (
														<p className="mb-2">
															<strong>Holder Type:</strong> 
															<span className="capitalize bg-purple-100 text-purple-800 px-2 py-1 rounded text-sm ml-2">
																{method.us_bank_account.account_holder_type}
															</span>
														</p>
													)}
												</div>
												<div>
													{method.us_bank_account.last4 && (
														<p className="mb-2">
															<strong>Account Number:</strong> 
															<code className="bg-gray-100 px-2 py-1 rounded ml-2">****{method.us_bank_account.last4}</code>
														</p>
													)}
													{method.us_bank_account.routing_number && (
														<p className="mb-2">
															<strong>Routing Number:</strong> 
															<code className="bg-gray-100 px-2 py-1 rounded ml-2">{method.us_bank_account.routing_number}</code>
														</p>
													)}
													{method.us_bank_account.fingerprint && (
														<p className="mb-2">
															<strong>Fingerprint:</strong> 
															<code className="text-xs bg-gray-100 px-2 py-1 rounded ml-2">{method.us_bank_account.fingerprint}</code>
														</p>
													)}
												</div>
											</div>

											{/* Networks Information */}
											{method.us_bank_account.networks && (
												<div className="mt-3 pt-3 border-t border-gray-100">
													<h5 className="font-medium text-gray-600 mb-2">Network Information</h5>
													{method.us_bank_account.networks.preferred && (
														<p className="mb-1">
															<strong>Preferred Network:</strong> 
															<span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm ml-2">
																{method.us_bank_account.networks.preferred.toUpperCase()}
															</span>
														</p>
													)}
													{method.us_bank_account.networks.supported && method.us_bank_account.networks.supported.length > 0 && (
														<div>
															<strong>Supported Networks:</strong>
															<div className="flex flex-wrap gap-1 mt-1">
																{method.us_bank_account.networks.supported.map((network: string, idx: number) => (
																	<span key={idx} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
																		{network.toUpperCase()}
																	</span>
																))}
															</div>
														</div>
													)}
												</div>
											)}

											{/* Status Details */}
											{method.us_bank_account.status_details && (
												<div className="mt-3 pt-3 border-t border-gray-100">
													<h5 className="font-medium text-gray-600 mb-2">Status Information</h5>
													{method.us_bank_account.status_details.blocked && (
														<div className="bg-red-50 border border-red-200 rounded p-3">
															<h6 className="font-medium text-red-800 mb-1">Account Blocked</h6>
															{method.us_bank_account.status_details.blocked.reason && (
																<p className="text-sm text-red-700 mb-1">
																	<strong>Reason:</strong> {method.us_bank_account.status_details.blocked.reason.replace(/_/g, ' ')}
																</p>
															)}
															{method.us_bank_account.status_details.blocked.network_code && (
																<p className="text-sm text-red-700">
																	<strong>Network Code:</strong> {method.us_bank_account.status_details.blocked.network_code}
																</p>
															)}
														</div>
													)}
												</div>
											)}

											{/* Financial Connections */}
											{method.us_bank_account.financial_connections_account && (
												<div className="mt-3 pt-3 border-t border-gray-100">
													<p className="text-sm text-gray-600">
														<strong>Financial Connections Account:</strong> 
														<code className="text-xs bg-gray-100 px-2 py-1 rounded ml-2">
															{method.us_bank_account.financial_connections_account}
														</code>
													</p>
												</div>
											)}
										</div>
									)}

									{/* Card Details */}
									{method.card && (
										<div className="bg-white rounded-lg p-4 border">
											<h4 className="font-medium text-gray-700 mb-3 flex items-center">
												<svg className="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
													<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3-3z" />
												</svg>
												Card Details
											</h4>
											<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
												<div>
													<p className="mb-2">
														<strong>Brand:</strong> 
														<span className="capitalize bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm ml-2">
															{method.card.brand}
														</span>
													</p>
													<p className="mb-2">
														<strong>Last 4:</strong> 
														<code className="bg-gray-100 px-2 py-1 rounded ml-2">****{method.card.last4}</code>
													</p>
													<p className="mb-2">
														<strong>Expires:</strong> {method.card.exp_month}/{method.card.exp_year}
													</p>
												</div>
												<div>
													{method.card.funding && (
														<p className="mb-2">
															<strong>Funding:</strong> 
															<span className="capitalize bg-green-100 text-green-800 px-2 py-1 rounded text-sm ml-2">
																{method.card.funding}
															</span>
														</p>
													)}
													{method.card.country && (
														<p className="mb-2">
															<strong>Country:</strong> {method.card.country.toUpperCase()}
														</p>
													)}
													{method.card.fingerprint && (
														<p className="mb-2">
															<strong>Fingerprint:</strong> 
															<code className="text-xs bg-gray-100 px-2 py-1 rounded ml-2">{method.card.fingerprint}</code>
														</p>
													)}
												</div>
											</div>
										</div>
									)}

									{/* Other Payment Method Types */}
									{method.type && !method.us_bank_account && !method.card && (
										<div className="bg-gray-50 rounded p-3">
											<p className="text-sm text-gray-600">
												Additional details for {method.type.replace('_', ' ')} payment method are available but not displayed in this interface.
											</p>
										</div>
									)}
								</div>
							</div>
						))}
					</div>
				) : (
					<div className="text-center py-8">
						<svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3-3z" />
						</svg>
						<p className="text-gray-500">No payment methods found.</p>
					</div>
				)}
			</div>

			{/* Payment History */}
			<div className="bg-white border rounded-lg p-6 shadow-sm">
				<h2 className="text-xl font-semibold mb-4">Payment History</h2>
				{paymentIntents && paymentIntents.length > 0 ? (
					<div className="overflow-x-auto">
						<table className="w-full table-auto">
							<thead>
								<tr className="border-b">
									<th className="text-left p-2">Date</th>
									<th className="text-left p-2">Amount</th>
									<th className="text-left p-2">Status</th>
									<th className="text-left p-2">Intent ID</th>
								</tr>
							</thead>
							<tbody>
								{paymentIntents.map((intent: any) => (
									<tr key={intent.id} className="border-b">
										<td className="p-2">{intent.created}</td>
										<td className="p-2">{formatAmount(intent.amount, intent.currency)}</td>
										<td className="p-2">
											<span className={`px-2 py-1 rounded text-sm ${
												intent.status === 'succeeded' ? 'bg-green-100 text-green-800' : 
												intent.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
												'bg-red-100 text-red-800'
											}`}>
												{intent.status}
											</span>
										</td>
										<td className="p-2">
											<code className="text-xs bg-gray-100 px-1 rounded">{intent.id}</code>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				) : (
					<p className="text-gray-500">No payment history found.</p>
				)}
			</div>
		</div>
	);
};

export default ManageSubscription;
