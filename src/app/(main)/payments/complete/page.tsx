"use client";

import React, { useState, useEffect } from "react";
import { confirmPaymentSuccess } from "@/actions/payments/stripe";
import { useRouter } from "next/navigation";
import Stripe from "stripe";

const PaymentCompletionPage = () => {
	const [stripeSession, setStripeSession] = useState<any>(null);
	const [loading, setLoading] = useState(true);
	const router = useRouter();

	const SuccessIcon = (
		<div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
			<svg
				width="24"
				height="20"
				viewBox="0 0 16 14"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
			>
				<path
					fillRule="evenodd"
					clipRule="evenodd"
					d="M15.4695 0.232963C15.8241 0.561287 15.8454 1.1149 15.5171 1.46949L6.14206 11.5945C5.97228 11.7778 5.73221 11.8799 5.48237 11.8748C5.23253 11.8698 4.99677 11.7582 4.83452 11.5681L0.459523 6.44311C0.145767 6.07557 0.18937 5.52327 0.556912 5.20951C0.924454 4.89575 1.47676 4.93936 1.79051 5.3069L5.52658 9.68343L14.233 0.280522C14.5613 -0.0740672 15.1149 -0.0953599 15.4695 0.232963Z"
					fill="white"
				/>
			</svg>
		</div>
	);

	const ErrorIcon = (
		<div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
			<svg
				width="24"
				height="24"
				viewBox="0 0 16 16"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
			>
				<path
					fillRule="evenodd"
					clipRule="evenodd"
					d="M1.25628 1.25628C1.59799 0.914573 2.15201 0.914573 2.49372 1.25628L8 6.76256L13.5063 1.25628C13.848 0.914573 14.402 0.914573 14.7437 1.25628C15.0854 1.59799 15.0854 2.15201 14.7437 2.49372L9.23744 8L14.7437 13.5063C15.0854 13.848 15.0854 14.402 14.7437 14.7437C14.402 15.0854 13.848 15.0854 13.5063 14.7437L8 9.23744L2.49372 14.7437C2.15201 15.0854 1.59799 15.0854 1.25628 14.7437C0.914573 14.402 0.914573 13.848 1.25628 13.5063L6.76256 8L1.25628 2.49372C0.914573 2.15201 0.914573 1.59799 1.25628 1.25628Z"
					fill="white"
				/>
			</svg>
		</div>
	);

	const LoadingSpinner = (
		<div className="w-16 h-16 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
	);

	useEffect(() => {
		confirmPaymentSuccess()
			.then((data) => {
				setStripeSession(data);
				console.log("Stripe Session Data:", data);
			})
			.catch((error) => {
				console.error("Error fetching payment session:", error);
			})
			.finally(() => {
				setLoading(false);
			});
	}, []);

	const handleRedirectToDashboard = () => {
		router.push("/dashboard");
	};

	const isSuccess = stripeSession?.status === "complete";
	const statusText = isSuccess ? "Payment Successful!" : "Payment Failed";
	const statusMessage = isSuccess 
		? "Your payment has been processed successfully." 
		: "Something went wrong with your payment. Please try again.";

	return (
		<div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
			<div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
				{/* Icon Section */}
				<div className="text-center">
					{loading ? LoadingSpinner : isSuccess ? SuccessIcon : ErrorIcon}
				</div>

				{/* Status Text */}
				<div className="text-center mb-6">
					<h1 className={`text-2xl font-bold mb-2 ${isSuccess ? 'text-green-600' : 'text-red-600'}`}>
						{loading ? "Processing..." : statusText}
					</h1>
					<p className="text-gray-600">
						{loading ? "Please wait while we confirm your payment..." : statusMessage}
					</p>
				</div>

				{/* Session Details */}
				{!loading && stripeSession && (
					<div className="bg-gray-50 rounded-lg p-4 mb-6">
						<h3 className="font-semibold text-gray-800 mb-3">Payment Details</h3>
						<div className="space-y-2 text-sm">
							<div className="flex justify-between">
								<span className="text-gray-600">Status:</span>
								<span className={`font-medium ${isSuccess ? 'text-green-600' : 'text-red-600'}`}>
									{stripeSession.status || 'Unknown'}
								</span>
							</div>
							<div className="flex justify-between">
								<span className="text-gray-600">Session ID:</span>
								<span className="font-mono text-xs text-gray-800 break-all">
									{stripeSession.id || 'N/A'}
								</span>
							</div>
							{stripeSession.customer && (
								<div className="flex justify-between">
									<span className="text-gray-600">Customer ID:</span>
									<span className="font-mono text-xs text-gray-800 break-all">
										{stripeSession.customer as string}
									</span>
								</div>
							)}
							{stripeSession.subscription && (
								<div className="flex justify-between">
									<span className="text-gray-600">Subscription ID:</span>
									<span className="font-mono text-xs text-gray-800 break-all">
										{stripeSession.subscription as string}
									</span>
								</div>
							)}
						</div>
					</div>
				)}

				{/* Action Button */}
				<button
					onClick={handleRedirectToDashboard}
					disabled={loading}
					className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-3 px-4 rounded-lg transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
				>
					{loading ? "Loading..." : "Go to Dashboard"}
				</button>
			</div>
		</div>
	);
};

export default PaymentCompletionPage;
