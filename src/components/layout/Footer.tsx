import React from "react";
import Image from "next/image";

const Footer = () => {
	return (
		<footer className="text-gray-100">
			<aside className="flex w-full flex-wrap items-center justify-between gap-2 bg-gray-300 px-8 py-4 text-sm">
				<a className="btn btn-ghost text-lg text-black" href="/">
					<Image alt="Logo" src="/favicon.png" width={32} height={32} className="w-8" />
					BoostBNB
				</a>
				<p>
					Copyright © 2023-{new Date().getFullYear()} - All rights
					reserved
				</p>
			</aside>
		</footer>
	);
};

export default Footer;
