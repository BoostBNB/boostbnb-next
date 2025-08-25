import React from "react";
import Link from "next/link";
import Image from "next/image";

const Sidebar = () => {
	return (
		<aside className="drawer-side z-10">
			<label className="drawer-overlay"></label>
			<nav className="flex min-h-screen w-72 flex-col gap-2 overflow-y-auto bg-gray-100 px-6 py-10">
				<div className="mx-4 flex items-center gap-2 font-black">
					<Image
						alt="Logo"
						src="/favicon.png"
						width={20}
						height={20}
					/>
					BoostBNB
				</div>
				<ul className="menu">
					<li>
						<Link className="flex p-2 hover:bg-gray-300 rounded-lg" href="/dashboard">
							<Image
								width={20}
								height={20}
								alt="home"
								src="https://unpkg.com/heroicons/20/solid/home.svg"
								className="mx-2"
							/>
							Dashboard
						</Link>
					</li>
					<li>
						<details >
							<summary className="flex de p-2 hover:bg-gray-300 rounded-lg">
								<Image
									width={20}
									height={20}
									alt="squares"
									src="https://unpkg.com/heroicons/20/solid/squares-2x2.svg"
									className="mx-2"
								/>
								Listings
							</summary>
							<ul>
								<li className="pl-10 p-1 hover:bg-gray-300 rounded-lg cursor-pointer">
									<Link href="/dashboard/listing/all">
										All Listings
									</Link>
								</li>
								<li className="pl-10 p-1 hover:bg-gray-300 rounded-lg cursor-pointer">
									<Link href="/dashboard/listing/new">
										Add New
									</Link>
								</li>
							</ul>
						</details>
					</li>
					<li>
						<details>
							<summary className="flex de p-2 hover:bg-gray-300 rounded-lg">
								<Image
									width={20}
									height={20}
									alt="sparkles"
									src="https://unpkg.com/heroicons/20/solid/sparkles.svg"
									className="mx-2"
								/>
								Tools
							</summary>
							<ul>
								<li className="pl-10 p-1 hover:bg-gray-300 rounded-lg cursor-pointer">
									<Link href="/dashboard/chat">
										Cohost AI
									</Link>
								</li>
								<li className="pl-10 p-1 hover:bg-gray-300 rounded-lg cursor-pointer">
									<Link href="/dashboard/optimize-listing">
										Listing Optimizer
									</Link>
								</li>
								<li className="pl-10 p-1 hover:bg-gray-300 rounded-lg cursor-pointer">
									<Link href="/dashboard/optimize-image">
										Image Optimizer
									</Link>
								</li>
							</ul>
						</details>
					</li>
					<li>
						{/* <details>
							<summary className="flex de p-2 hover:bg-gray-300 rounded-lg">
								<Image
									width={20}
									height={20}
									alt="adjustments"
									src="https://unpkg.com/heroicons/20/solid/adjustments-vertical.svg"
									className="mx-2"
								/>
								Settings
							</summary>
							<ul>
								<li className="pl-10 p-1 hover:bg-gray-300 rounded-lg cursor-pointer">
									<Link href="##">Account</Link>
								</li>
								<li className="pl-10 p-1 hover:bg-gray-300 rounded-lg cursor-pointer">
									<Link href="##">Transactions</Link>
								</li>
							</ul>
						</details> */}
					</li>
				</ul>
			</nav>
		</aside>
	);
};

export default Sidebar;
