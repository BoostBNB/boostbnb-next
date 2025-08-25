"use client";

import React, { useState } from "react";
import Link from "next/link";
import { logout } from "@/actions/auth";

interface HeaderProps {
	apbv: string;
}

const Header = ({ apbv }: HeaderProps) => {
	const [dropMenuVisible, setDropMenuVisible] = useState(false);
	return (
		<header className="flex items-center w-full mb-10">
			<div className="grow">
				<h1 className="lg:text-2xl lg:font-light">Dashboard</h1>
			</div>
			{/* <!-- dropdown --> */}
			<div onClick={() => setDropMenuVisible(() => !dropMenuVisible)} className="dropdown dropdown-end z-10">
				<div className="avatar btn btn-circle btn-ghost">
					<div className="w-10 rounded-full">
						<div className="relative size-full bg-neutral text-neutral-content">
							<span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-xl leading-none">
								{apbv}
							</span>
						</div>
					</div>
				</div>
				<ul className={(dropMenuVisible ? 'block' : 'hidden') + " absolute right-8 mt-3 w-52 border-1 rounded-lg bg-gray-100 p-2 shadow-lg"}>
					<li className="hover:bg-gray-300 p-2 rounded-md">
						<Link href="/dashboard/profile" className="">Profile</Link>
					</li>
					<li className="hover:bg-gray-300 p-2 rounded-md">
						<button onClick={() => logout()}>Log Out</button>
					</li>
				</ul>
			</div>
			{/* dropdown */}
		</header>
	);
};

export default Header;
