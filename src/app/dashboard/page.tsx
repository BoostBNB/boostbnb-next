import Header from "@/components/dashboard/Header";
import Stats from "@/components/dashboard/Stats";
import React from "react";
import { createClient } from "@/utils/supabase/server";
import Link from "next/link";

const DashboardPage = async () => {
	const supabase = await createClient();
	const {
		data: { user },
		error,
	} = await supabase.auth.getUser();

	if (error || !user) {
		console.error("Error authenticating user: ", error);
	}

	const { data: subData, error: subError } = await supabase
		.from("subscriptions")
		.select("*")
		.eq("user_id", user?.id)
		.single();

	let isActive: boolean;

	if (subError || !subData) {	
		console.error("Error fetching subscription data: ", subError);
		isActive = false
	}
	else {
		isActive = subData.is_active;
	}

	const apbv = user && user.email ? user.email.charAt(0).toUpperCase() : "U";

	return (
		<div className="w-full flex flex-col">
			<Header apbv={apbv} />
			{!isActive && (
				<div className="bg-red-100 text-red-800 p-4 rounded-md mb-4">
					Your subscription is not active. Please complete the payment process. by <Link className="underline" href={`/payments`}>Clicking Here</Link>
				</div>
			)}
			<Stats />
		</div>
	);
};

export default DashboardPage;
