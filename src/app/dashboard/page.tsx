import Header from "@/components/dashboard/Header";
import Stats from "@/components/dashboard/Stats";
import React from "react";
import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import { getUser } from "@/actions/auth";
import { getUserSubscription } from "@/actions/payments/stripe";

const DashboardPage = async () => {
	const supabase = await createClient();
	const user = await getUser(supabase);
	const subData = await getUserSubscription(supabase, user);

	const isActive: boolean = subData.is_active || false;
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
