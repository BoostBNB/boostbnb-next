"use server";

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

const emailRegex = /^[\w-\.+]+@([\w-]+\.)+[\w-]{2,8}$/;


export const logout = async () => {
    const supabase = await createClient();
	
    const { error } = await supabase.auth.signOut();
    if (!error) {
      window.location.href = '/log-in';
    } else {
      console.error(error);
    }
  };

export async function signup(initialState: any, formData: FormData) {
	const supabase = await createClient();
	const email = formData.get("email") as string;
	const password = formData.get("password") as string;

	// eslint-disable-next-line no-useless-escape
	const validEmail = emailRegex.test(email);
	if (!validEmail) {
		return {
			errors: { email: "Please enter a valid email address" },
			email,
		};
	}

	// ✅ Step 1: Sign up the user
	const { data, error } = await supabase.auth.signUp({
		email,
		password,
		options: {
			emailRedirectTo: `${process.env.NEXT_PUBLIC_SERVER_URL}/auth/callback`,
		},
	});

	if (error) {
		return {
			success: false,
			email,
			message: `There was an issue, Please contact support.`,
		};
	}

	// ✅ Step 2: Ensure the user exists before adding them to `user_data`
	if (data.user) {
		const { error: insertError } = await supabase.from("user_data").insert([
			{ user_id: data.user.id, listings: [] }, // ✅ Empty array for listings
		]);

		if (insertError) {
			console.error("Insert error:", insertError.message);
		}
	}

	return {
		success: true,
		message: "Please check your email to finish setting up your account.",
	};
}

export async function login(initialState: any, formData: FormData) {
	const email = formData.get("email") as string;
	const password = formData.get("password") as string;

	const validEmail = emailRegex.test(email);

	if (!validEmail) {
		return {
			errors: { email: "Please enter a valid email address" },
			email,
		};
	}

	const supabase = await createClient();
	const {
		data: { user },
		error,
	} = await supabase.auth.getUser();

	if (user) {
		redirect("/dashboard");
	}

	const { error: signInError } = await supabase.auth.signInWithPassword({
		email,
		password,
	});

	if (signInError) {
		return {
			success: false,
			email,
			message: `There was an issue, Please contact support.`,
		};
	}

	redirect("/dashboard");
	return {
		success: true,
		message: "Creating account...",
	};
}
