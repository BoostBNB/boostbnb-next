import React from "react";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/utils/supabase/server";

const NavBar = async () => {
	const supabase = await createClient();
	const { data: { user }, error } = await supabase.auth.getUser();
    console.log("User from NavBar: ", user);

	const aboutLink: string = "/#about";
	const pricingLink: string = "/#pricing";
	const loginLink: string = user ? "/dashboard" : "/log-in";

	return (
		<nav
			id="navbar"
			className="backdrop-filter backdrop-blur-md navbar fixed left-0 top-0 z-[100] justify-between shadow-lg"
		>
			<Link className="btn btn-ghost text-lg" href="/">
				<Image alt="Logo" src="/favicon.png" width={30} height={30}/>
				BoostBNB
			</Link>

			{/*  Mobile Menu */}
			<div className="dropdown dropdown-end sm:hidden">
				<button className="btn btn-ghost" aria-label="open menu">
					<i className="fa-solid fa-bars text-lg"></i>
				</button>

				<ul className="menu dropdown-content z-[101] w-56 gap-2 rounded-box bg-base-200 p-6 shadow">
					<li>
						<a href={aboutLink}>About</a>
					</li>
					<li>
						<a href={pricingLink}>Pricing</a>
					</li>
					<li>
						<Link href={loginLink} className="btn btn-primary btn-sm">
							{user ? "Dashboard" : "Log In"}
						</Link>
					</li>
				</ul>
			</div>

			{/* Menu for desktop */}
			<ul className="menu hidden gap-2 sm:inline-flex sm:flex-row items-center">
				<li>
					<a href={aboutLink} className="mx-2 hover:bg-gray-300 rounded-sm p-2">About</a>
				</li>
				<li>
					<a className="mx-2 hover:bg-gray-300 rounded-sm p-2" href={pricingLink}>Pricing</a>
				</li>
				<li>
					<Link className="btn btn-primary btn-sm" href={loginLink}>
						{user ? "Dashboard" : "Log In"}
					</Link>
				</li>
			</ul>
		</nav>
	);
};

export default NavBar;
