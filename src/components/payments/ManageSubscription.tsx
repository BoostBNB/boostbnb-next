"use client";

import {
	getSubscriptionDetails,
	getCustomerPaymentMethods,
	getCustomerPaymentIntents,
	upgradePlan,
	downgradePlan,
	cancelSubscription,
	getUserSubscriptionData
} from "@/actions/payments/stripe";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface SubscriptionData {
	user_id: string;
	customer_id: string;
	subscription_id: string;
	plan: string;
	is_active: boolean;
}

interface StripeData {
	subscription: any;
	paymentMethods: any[];
	paymentIntents: any[];
}

const ManageSubscription = () => {
	const [subData, setSubData] = useState<SubscriptionData | null>(null);
	const [stripeData, setStripeData] = useState<StripeData | null>(null);
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
			const userData = await getUserSubscriptionData();
			
			if (!userData) {
				router.push("/log-in");
				return;
			}

			setSubData(userData);

			// Fetch Stripe data
			const [subscription, paymentMethods, paymentIntents] = await Promise.all([
				getSubscriptionDetails(userData.subscription_id),
				getCustomerPaymentMethods(userData.customer_id),
				getCustomerPaymentIntents(userData.customer_id)
			]);

			setStripeData({ subscription, paymentMethods, paymentIntents });
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
						<p><strong>Plan:</strong> {subData.plan}</p>
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
							onClick={() => handleUpgradePlan('price_1Rx7KOEl7NEhfNbPzOu3MWsu')}
							className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
							disabled={subData.plan === 'Scrape Mode' || actionLoading}
						>
							{actionLoading ? 'Processing...' : subData.plan === 'Scrape Mode' ? 'Current Plan: Scrape Mode' : 'Upgrade to Scrape Mode'}
						</button>
						<button
							onClick={() => handleDowngradePlan('price_1Rx6ewEl7NEhfNbPpIfwigfP')}
							className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
							disabled={subData.plan === 'Manual Mode' || actionLoading}
						>
							{actionLoading ? 'Processing...' : subData.plan === 'Manual Mode' ? 'Current Plan: Manual Mode' : 'Downgrade to Manual Mode'}
						</button>
					</div>
					<button
						onClick={handleCancelSubscription}
						className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
						disabled={subscription?.cancel_at_period_end || actionLoading}
					>
						{actionLoading ? 'Processing...' : subscription?.cancel_at_period_end ? 'Cancellation Scheduled' : 'Cancel Subscription'}
					</button>
				</div>
			</div>

			{/* Payment Methods */}
			<div className="bg-white border rounded-lg p-6 shadow-sm">
				<h2 className="text-xl font-semibold mb-4">Payment Methods</h2>
				{paymentMethods && paymentMethods.length > 0 ? (
					<div className="space-y-3">
						{paymentMethods.map((method: any) => (
							<div key={method.id} className="border rounded p-4">
								<p><strong>Method ID:</strong> <code className="text-xs bg-gray-100 px-1 rounded">{method.id}</code></p>
								<p><strong>Created:</strong> {method.created}</p>
								{method.us_bank_account && (
									<p><strong>Bank Account:</strong> {method.us_bank_account}</p>
								)}
							</div>
						))}
					</div>
				) : (
					<p className="text-gray-500">No payment methods found.</p>
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
