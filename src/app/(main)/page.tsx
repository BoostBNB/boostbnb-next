import Hero from "@/components/homepage/Hero";
import Pricing from "@/components/payments/Pricing";
import GetAudit from "@/components/homepage/GetAudit";
import ProjectStats from "@/components/homepage/ProjectStats";
import TextSection from "@/components/homepage/TextSection";
import FeaturesSection from "@/components/homepage/FeaturesSection";
import OverviewSection from "@/components/homepage/OverviewSection";
/*
Useful Links
------------------------
	- NextJS Project Structure Docs: https://nextjs.org/docs/app/getting-started/project-structure
	- BoostBNB PDF Plan: https://mail-attachment.googleusercontent.com/attachment/u/0/?ui=2&ik=faf904aa90&attid=0.1&permmsgid=msg-f:1839020948823205830&th=198583cf351be7c6&view=att&disp=inline&realattid=f_mdp3bsge0&zw&sadnir=1&saddbat=ANGjdJ_5wHIbkkGpFdgF9Fy5x6Dz02b4qBYRrkKZHfqggRDSkRD6R-kQWxgTq7FitFIXMI7VZXBvKf6Y48B7V32vZGyyetrnrh_R_otr5Erw9NdJ-1Jce-mzw0Of8JSwIsqI8ungYyH2NgZoDPCV6GzoScgvMWBlrKtP-9xDPT1IDqIiKt9oI6G7zymkmB60JUVKxFxA06EoKZJ-isoChLZA1ISrG2C8wjP6fY4k6B7Vz7IjjmQZ2uF7Poi89kHp8b7yh_tuYYKRFa3A7RuyOly1HtpKfD8cpEHiIjoVOvLaciwT2ksYik6gOQdF5ue7qI7sRgR3VqKXD2UwaNA3uTX3p4cE8jzTs5V8Y2X1Za7GPESqtUJAKgCeAHKrv09cQCyA3OE5EZojgt0XDPdWGArw8ukCsL7gJyDJjKMT5NdhDHOCa172Z8kn-THixW_o7_kv1TUdLS_XQHRfZNMkP_ZsOlJ7fV42e-w-xEe4KXQKu4yp6fL2zI1PccFEbAROiOmDnl_IdsUDPfOhpUxIulFnC_Bb35NWfXgajVdrJPtW6gtmaog_LKeseetekfSmJIKTwru8EEVwMFBXvcAt_u4FgaStx_sb0M7y2A5BF7AnOjbQdzBVGnk4LQCrrgagUbrQbMUvPkHbEet_n3EdFeHFml2HlSR9hEyZbUAeOafu-6ALWK14tbKFwYjiJ0Um7MsYFo4IHShkOjy72fuM4e5kvUgAv1zHdHn9v1uO7j-jfLGDVtzlN6Ia4hUlEO_qFzzQpJKZ28vDCrz7mc5aUJ1EjegUIXRSGsZWMAnIqzCTu1LqWBVnoru-jxSXb1mv1JTBBsMpvIEVUctKVY4Jlt7-q0EQ1IfSRhn4Xh4V9mYjjgB_OUFwDsWrTOE3Vjx-qGZ9hWO2j2wPkycGESHV4T5hvhABZ_-yyUo2b4K3NY5HTCVc85bCy2Kq-ly4U88vzGOE6ZaYzzznMTo00dvEaOHDx-FC5HqCNjD_l5wtP-1REq5x85eLBplrUfme6ZPp-RRQq0g0wJo4YNmmnCEf
	- Property Management System API Documentations:
		- Hostaway:	https://api.hostaway.com/documentation#introduction 	(No OAuth; Requires the user's AcountID and API Key)
		- Guesty: 	https://open-api-docs.guesty.com/docs/getting-started 	(Uses Oauth 2.0; Requires Guesty Account)
		- Lodgify: 	https://docs.lodgify.com/reference/listproperties 		(No OAuth; Requires the user's Public API Key)
		- Smoobu: 	https://docs.smoobu.com/?shell#third-party-providers 	(Uses Oauth 2.0; Requires Calling Smoobu to get approval)
	- Possibly Look into a better AirBNB API (web scraper)
		- https://hasdata.com/apis/airbnb-api
	- StackOverflow on Upgrading/Downgrading Subscription: https://stackoverflow.com/questions/69181605/best-way-to-handle-stripe-subscription-upgrade-and-downgrade

Copying the Old Svelte Project
------------------------
	- Styling:
		1. Star Icon for OverviewSection.tsx
		2. Remove All DaisyUI Classes (eventually)
		3. Pollish looks of the app (probably with AI)
    - Ensure that every page is responsive (and navbar)
	- Ensure User Authentication Pages is working correctly (especially signup)
	- Ensure that Cohost Conversations are added to database


Core Features
------------------------
	- Finish Upgrade/Downgrade Plan Functionality

	
	- Use AirBNB Scraper API: https://hasdata.com/apis/airbnb-api
		- Setup Database listings table with JSON column for storing scraped data
		- Find a way to get pricing and calendar data

	- Upload code to GitHub and divide work with Adrian 
		- Frontend Work: (Dashboard, Listings, Profile, Settings, Preferences, Onboarding)
		- Backend Work: (Scraper, Listing Optimizer, Image Optimizer)

	- Listings Page
		- List all listings
		- Show a few details (title, photo, price, rating)
		- Creating New Listings (update audit.ts to use new scraper) possibly in the same page

	- Individual Listing Page
		- Title, Description, Photos, Guest Capacity, Location
		- Amenities, Safety Info, Host Info

	- Dashboard Page
		- Overview of all listings and some statistics

	- Profile Page
		- Add User Profile table to database
		- User Settings/Preferences

	- Create Optimization Tools
		1. Listing Optimizer (pricing/calendar, min-stay/gap-rule, title, description)
		2. Image Optimizer (image reording, Photo AI Addon)
	
	- Integrate with PMS Tools like Lodgify, Hostaway, Guesty, Smoobu
		- Add Appropriate Features for PMS Tools (calendar, syncing, pricing, etc.)

	- Redesign Website using AI
	- Add Onboarding for new users
	- Prompt for feedback after subscription cancellation
	- Send Success Email after successful Payment is made and after subscription cancellation
	- Add Error Handling for the many edge cases in
		- Log-in / Signup
		- Stripe Payment Processing
		- AirBNB Scraper API
	- Add RLS Policies to database tables
	- Weekly Insights Newsletter
	- Guardrails / Safety Check


Additional Improvements
------------------------
	- Improve Cohost AI Assistant
		- Use Langchain & Vector DB to add context and memory
		- Add support for multiple conversations
		- Add support for image messages and possibly other file uploads

Later Features
-----------------------------
	- EventIQ: Automatic pricing adjustment based on other events in the area (Dynamic Pricing)
	- A/B Testing: Compare different listing versions to see which performs better (automatically alternate between versions and track performance)
	- Drift Alerts: Notifies you when Airbnb is updated outside of boostbnb account
	- Portfolio Policies / Bulk Actions: ???
*/


export default function Home() {
	return (
			<main>
				<Hero />
				<ProjectStats />
				<FeaturesSection />
				<TextSection />
				<OverviewSection />
				<p className="size-0" id="about"></p>
				<p className="size-0" id="audit"></p>
				<GetAudit />
				<Pricing />
				<div className="bg-gray-300 text-center text-sm" id="*">
					* Credit card required for paid plans
				</div>
			</main>
	);
}
