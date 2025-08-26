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
	- BoostBNB PDF Plan: See ProjectOverview.pdf
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
		3. Polish looks of the app (probably with AI)
    - Ensure that every page is responsive (and navbar)
	- Ensure User Authentication Pages is working correctly (especially signup)


Payment Processing
------------------------
	- Finish Upgrade/Downgrade Plan Functionality
	- Get the Actual Payment Plans and the features they give access to from Daniel

	- Prompt for feedback after subscription cancellation
	- Send Success Email after successful Payment is made and after subscription cancellation


Backend Integration & Functionality
------------------------------------------------
	- Use AirBNB Scraper API: https://hasdata.com/apis/airbnb-api
		- Setup Database listings table with JSON column for storing scraped data
		- Find a way to get pricing and calendar data
	
	- Create Optimization Tools
		1. Listing Optimizer (pricing/calendar, min-stay/gap-rule, title, description) (have copy-paste helpers)
		2. Image Optimizer (image re-ordering) + Photo AI Addon (image scoring)

	- Integrate with PMS Tools like Lodgify, Hostaway, Guesty, Smoobu
	- Add Appropriate Features for PMS Tools (calendar, syncing, pricing, etc.)


UI/UX Frontend Stuff
-------------------------------
	- Individual Listing Page
		- Add functionality to the "Show All Amenities" Button
		- Get and use pricing and calendar information (Wait for PMS Tool Accounts)

	- Dashboard Page
		- Overview of all listings and some statistics (Wait for PMS Tool Accounts)
		- Add Onboarding for new users

	- Profile Page
		- Add User Profile table to database
		- User Settings/Preferences


The Last Stretch of MVP Development
--------------------------------------
	- Re-style the Website using AI
	- Add Error Handling for the many edge cases in
		- Log-in / Signup
		- Stripe Payment Processing
		- AirBNB Scraper API
		- All Other Pages
	- Add RLS Policies to database tables
	- Weekly Insights Newsletter
	- Guardrails / Safety Check


Future Improvements / Features
------------------------
	- Improve Cohost AI Assistant
		- Use Langchain & Vector DB to add context and memory
		- Add support for multiple conversations
		- Add support for image messages and possibly other file uploads
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
