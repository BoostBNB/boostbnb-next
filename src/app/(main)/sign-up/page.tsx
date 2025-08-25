"use client";

import React, { useActionState, useState } from "react";
import Link from "next/link";
import { signup } from "@/actions/auth";

const initialState = {
	success: false,
	message: "",
};

const SignupPage = () => {
	const [pw, setPw] = useState("");
	const [pwverify, setPwVerify] = useState("");
	const [form, formAction, loading] = useActionState(signup, initialState);

	return (
		<div className="h-screen w-screen bg-gradient-to-br from-white to-blue-200">
			<div className="flex items-center justify-center size-full bg-nav backdrop-blur-md backdrop-filter">
				<form
					className="relative bottom-20 flex w-3/4 flex-col rounded-md bg-gray-200 shadow-lg p-6 text-center md:w-1/3"
					action={formAction}
				>
					<h1 className="mb-2 text-2xl font-bold">Sign Up</h1>
					<input
						type="email"
						id="email"
						name="email"
						className="input input-bordered bg-white"
						placeholder="janedoe@example.com"
						defaultValue={form?.email ?? ""}
					/>
					{form?.errors?.email ? (
						<span className="error mt-2 flex items-center text-sm text-error">
							{form?.errors?.email}
						</span>
					) : (
						""
					)}
					<input
						type="password"
						id="password"
						name="password"
						className="input input-bordered my-2 bg-white"
						placeholder="Password"
						onChange={(e) => setPw(e.target.value)}
						value={pw}
					/>
					<input
						type="password"
						id="password-verify"
						name="password-verify"
						className="input input-bordered mb-2 bg-white"
						placeholder="Verify Password"
						value={pwverify}
						onChange={(e) => setPwVerify(e.target.value)}
					/>
					{pw !== pwverify ? (
						<div className="error mb-2 text-left text-sm text-error">
							Passwords do not match
						</div>
					) : (
						""
					)}
					<button className="btn btn-primary bg-blue-400">
						{loading ? "Loading..." : "Sign Up"}
					</button>
					{form?.message !== undefined ? (
						<div className={`success mt- text-center text-sm text-success ${form?.success ? '' : 'fail'}`}>
							{form?.message}
						</div>
					) : (
						""
					)}
					<p className="mt-2">
						Already have an account?{" "}
						<Link href="/log-in" className="underline">
							Log In
						</Link>
						.
					</p>
				</form>
			</div>
		</div>
	);
};

export default SignupPage;
