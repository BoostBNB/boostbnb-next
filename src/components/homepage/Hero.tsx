"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export default function Hero() {
	const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
	const [mainHeight, setMainHeight] = useState(0);

	return (
		<section className="hero flex min-h-fit flex-col bg-linear-to-b from-gray-100 to-blue-300" id="hero">
			{/*
            This CSS calc() determines the amount of margin
            needed on the top in order to have the text be 
            centered vertically onscreen 
            */}
			<div
				className="mb-8 flex w-full flex-col justify-center px-4 align-middle"
				// bind:clientHeight={mainClientHeight}
				// style={`margin-top: calc((100vh - ${mainClientHeight}px ) / 2)`}
			>
				<h1 className="w-full text-center font-header text-4xl font-bold leading-none md:text-7xl lg:mx-auto lg:w-2/5">
					Supercharge Your AirBnB Listings with <span className="text-blue-400">AI-Powered</span> Tools
				</h1>
				<span>
					<hr className="mx-auto mt-4 w-3/5 border-neutral lg:w-2/5" />
				</span>
				<span className="mx-auto w-full text-center text-lg my-4 font-semibold italic">
					Unlock Your Property's Full Potential with Expert Insights
					and Cutting-Edge Technology
				</span>
				<div className="flex justify-center gap-2">
					<div className="flex w-full justify-center gap-2">
						<span className="size-fit">
							<a className="btn btn-primary bg-blue-400 hover:bg-blue-500" href="/#about">
								Learn more
							</a>
						</span>
						<span className="size-fit">
							<a className="btn btn-secondary bg-blue-300 hover:bg-blue-500" href="/#audit">
								Get your free AI audit
							</a>
						</span>
					</div>
				</div>
				<span className="w-full text-center text-sm text-neutral-600 mt-2">
					No Credit Card Required<a href="#*">*</a> • Get results
					instantly
				</span>
			</div>

			<div className="motion-preset-slide-up h-fit w-full motion-delay-1500">
				<img
					src="/assets/hero-image.png"
					alt="Boostbnb Dashboard"
					className="relative z-10 mx-auto aspect-video w-11/12 rounded-lg border-2 border-neutral shadow-hero md:w-1/2"
				/>
			</div>
		</section>
	);
}

{
	/* <div
  className="absolute left-4 top-4 -z-10 hidden rounded-lg bg-gradient-to-b from-white to-blue-200 align-middle md:block"
  style={`height: ${heroDimesnions.height}px; width: ${heroDimesnions.width}px;`}
></div>
<div
  className="absolute left-0 top-0 -z-10 block w-full rounded-lg bg-gradient-to-b from-white to-blue-200 align-middle md:hidden"
  style={`height: ${heroHeight + 8}px;`}
></div> */
}
