import React from "react";
import { createListing } from "@/actions/listing";
import { redirect } from "next/navigation";
import Link from "next/link";

const NewListingPage = () => {
	const handleSubmit = async (formData: FormData) => {
		"use server";

		const newListing = await createListing(formData);

		if (!newListing.error) {
			redirect("/dashboard/listing/all");
		}
		else {
			console.error("Error creating listing:", newListing.error, newListing.info);
			// You might want to handle different error types here and show user-friendly messages
		}
	}

	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
			<div className="max-w-2xl mx-auto px-4 py-12">
				{/* Header Section */}
				<div className="text-center mb-12">
					<div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-6">
						<svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
						</svg>
					</div>
					<h1 className="text-4xl font-bold text-gray-900 mb-4">
						Create New Listing
					</h1>
					<p className="text-lg text-gray-600 max-w-md mx-auto">
						Add your Airbnb property URL to automatically import listing details and start managing your property.
					</p>
				</div>

				{/* Form Card */}
				<div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
					<div className="px-8 py-10">
						<form action={handleSubmit} className="space-y-8">
							{/* URL Input Section */}
							<div className="space-y-4">
								<label htmlFor="bnburl" className="block text-sm font-semibold text-gray-700 mb-2">
									Airbnb Property URL
								</label>
								<div className="relative">
									<div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
										<svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.102m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
										</svg>
									</div>
									<input
										id="bnburl"
										name="bnburl"
										type="url"
										placeholder="https://www.airbnb.com/rooms/..."
										className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
										required
									/>
								</div>
								<p className="text-sm text-gray-500 flex items-start gap-2">
									<svg className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
									</svg>
									<span>
										Copy and paste the full URL of your Airbnb listing. We'll automatically import the property details, photos, and description.
									</span>
								</p>
							</div>

							{/* Submit Button */}
							<div className="pt-4">
								<button 
									type="submit"
									className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold py-4 px-6 rounded-xl hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-4 focus:ring-blue-500/20 transform hover:scale-[1.02] transition-all duration-200 shadow-lg hover:shadow-xl"
								>
									<span className="flex items-center justify-center gap-2">
										<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
										</svg>
										Create Listing
									</span>
								</button>
							</div>
						</form>
					</div>

					{/* Footer Section */}
					<div className="bg-gray-50 px-8 py-6 border-t border-gray-100">
						<div className="flex items-center justify-between text-sm">
							<div className="flex items-center gap-2 text-gray-600">
								<svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
								</svg>
								<span>Secure and automated import</span>
							</div>
							<Link 
								href="/dashboard/listing/all"
								className="text-blue-600 hover:text-blue-700 font-medium hover:underline transition-colors"
							>
								← Back to listings
							</Link>
						</div>
					</div>
				</div>

				{/* Help Section */}
				<div className="mt-12 text-center">
					<h3 className="text-lg font-semibold text-gray-900 mb-4">Need help finding your Airbnb URL?</h3>
					<div className="grid md:grid-cols-3 gap-6 max-w-3xl mx-auto">
						<div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
							<div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
								<span className="text-blue-600 font-bold">1</span>
							</div>
							<h4 className="font-semibold text-gray-900 mb-2">Go to Airbnb</h4>
							<p className="text-sm text-gray-600">Navigate to your property listing on Airbnb.com</p>
						</div>
						<div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
							<div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
								<span className="text-blue-600 font-bold">2</span>
							</div>
							<h4 className="font-semibold text-gray-900 mb-2">Copy URL</h4>
							<p className="text-sm text-gray-600">Copy the complete URL from your browser's address bar</p>
						</div>
						<div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
							<div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
								<span className="text-blue-600 font-bold">3</span>
							</div>
							<h4 className="font-semibold text-gray-900 mb-2">Paste Here</h4>
							<p className="text-sm text-gray-600">Paste the URL in the form above and click create</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default NewListingPage;
