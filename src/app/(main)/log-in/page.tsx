"use client";

import React, { useActionState } from "react";
import Link from "next/link";
import { login } from "@/actions/auth";

const initialState = { success: false, message: "" };

const LoginPage = () => {
	const [form, formAction, loading] = useActionState(
		login,
		initialState
	);

	return (
		<div className="h-screen w-screen bg-gradient-to-br from-white to-blue-200">
			<div className="size-full bg-nav backdrop-blur-md backdrop-filter flex items-center justify-center">
				<form
					className="relative bottom-20 flex w-3/4 shadow-lg flex-col rounded-md bg-gray-200 p-6 text-center md:w-1/3"
					action={formAction}
				>
					<h1 className="mb-2 text-2xl font-bold">Login</h1>
					<input
						type="email"
						id="email"
						name="email"
						className="input bg-white mb-2"
						placeholder="janedoe@example.com"
						defaultValue={form?.email ?? ''}
					/>
					{form?.errors?.email ? (
						<span className="error flex items-center text-sm">
							{form?.errors?.email}
						</span>
					) : (
						""
					)}
					<input
						type="password"
						id="password"
						name="password"
						className="input input-bordered bg-white mb-2"
						placeholder="Password"
					/>
					<button className="btn btn-primary bg-blue-400">
						{loading ? "Loading..." : "Log In"}
					</button>
					{form?.message !== undefined ? (
						<div
							className={`success ${form?.success ? "" : "fail"}`}
						>
							{form?.message}
						</div>
					) : (
						""
					)}
					<p className="mt-2">
						Don't have an account?{" "}
						<Link href="/sign-up" className="underline">
							Sign Up
						</Link>
						.
					</p>
				</form>
			</div>
		</div>
	);
};

export default LoginPage;
