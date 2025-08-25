import React from "react";
import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

const ListingPage = async () => {
	const supabase = await createClient();
	const {
		data: { user },
		error,
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

	if (!listingData) {
		return <p>You have no listings</p>
	}

	return (
		<div className="flex flex-col w-full">
			{listingData.map((listing, i) => (
				<Link
					key={i}
					className="bg-gray-100 my-2 shadow-xl hover:scale-[1.01] flex"
					href="##"
				>
					<Image
						// src="/assets/pexels-nextvoyage-3051551.webp"
						src={listing.data.property.photos[0]}
						alt="Property IMG"
						width={150}
						height={100}
						className=""
					/>
					<div className="card-body p-5">
						<h2 className="text-lg font-bold">{ listing.data.property.title }</h2>
						<p>{ listing.data.property.description.substring(0, 300) }</p>
					</div>
				</Link>
			))}
		</div>
	);
};

export default ListingPage;
