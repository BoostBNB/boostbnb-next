import React from "react";
import { createListing } from "@/actions/listing";
import { redirect } from "next/navigation";

const NewListingPage = () => {

	const handleSubmit = async (formData: FormData) => {
		"use server";

		const newListing = await createListing(formData);
		redirect("/dashboard/listing/all");
	}

	return (
		<div className="relative size-full">
			<div
				className="absolute left-1/2 top-1/2 flex size-1/2 -translate-x-1/2 -translate-y-1/2 flex-col
    items-center justify-center rounded-md border border-gray-300"
			>
				<h1 className="text-center text-2xl md:text-3xl">
					Add a new Listing
				</h1>
				<form
					action={handleSubmit}
					className="flex w-2/3 flex-col items-center gap-1"
				>
					<input
						name="bnburl"
						type="url"
						placeholder="Your Airbnb URL here"
						className="input input-bordered w-full md:w-3/4"
					/>
					<button className="btn btn-primary w-full md:w-3/4">
						Create Listing
					</button>
				</form>
			</div>
		</div>
	);
};

export default NewListingPage;
