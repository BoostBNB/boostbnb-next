import React from "react";
import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

const ListingPage = async () => {
	const supabase = await createClient();
	const {
		data: { user },
		error
	} = await supabase.auth.getUser();

	if (error || user == null) {
		console.error("Error getting user:", error?.message);
	}

	const { data: listingData, error: selectError } = await supabase
		.from("listings")
		.select("url, data")
		.eq("user_id", user?.id);

	if (!user) {
		redirect("/log-in");
	}

	if (selectError) {
		console.error("Error fetching listings:", selectError.message);
	}

	if (!listingData || listingData.length === 0) {
		return (
			<div className="flex flex-col items-center justify-center min-h-[400px] text-center">
				<div className="text-gray-400 mb-4">
					<svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="m8 7 4-4 4 4" />
					</svg>
				</div>
				<h3 className="text-xl font-semibold text-gray-700 mb-2">No listings yet</h3>
				<p className="text-gray-500 mb-6">Start by creating your first property listing</p>
				<Link 
					href="/dashboard/listing/create"
					className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
				>
					Create Listing
				</Link>
			</div>
		);
	}

	return (
		<div className="w-full max-w-7xl mx-auto px-4 py-6">
			<div className="mb-8">
				<h1 className="text-3xl font-bold text-gray-900 mb-2">Your Listings</h1>
				<p className="text-gray-600">{listingData.length} {listingData.length === 1 ? 'listing' : 'listings'} found</p>
			</div>
			
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				{listingData.map((listing, i) => (
					<Link
						key={i}
						href={`/dashboard/listing/${listing.data.requestMetadata.id}`}
						className="group block bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden"
					>
						<div className="relative h-48 w-full">
							<Image
								src={listing.data.property.photos[0]}
								alt={listing.data.property.title}
								fill
								className="object-cover group-hover:scale-105 transition-transform duration-300"
							/>
							<div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 flex items-center gap-1">
								<svg className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
									<path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
								</svg>
								<span className="text-sm font-medium text-gray-700">
									{listing.data.property.rating || '4.5'}
								</span>
							</div>
						</div>
						
						<div className="p-5">
							<h2 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
								{listing.data.property.title}
							</h2>
							<p className="text-gray-600 text-sm leading-relaxed line-clamp-3 mb-4">
								{listing.data.property.description}
							</p>
							
							<div className="flex items-center justify-between text-sm text-gray-500">
								<span className="flex items-center gap-1">
									<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
									</svg>
									{listing.data.property.location || 'Location'}
								</span>
								<span className="text-blue-600 font-medium group-hover:text-blue-700">
									View Details →
								</span>
							</div>
						</div>
					</Link>
				))}
			</div>
		</div>
	);
};

export default ListingPage;
