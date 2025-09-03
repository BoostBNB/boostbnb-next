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
	- Prebuilt AirBNB Web-Scraping API: https://hasdata.com/apis/airbnb-api
	- StackOverflow on Upgrading/Downgrading Subscription: https://stackoverflow.com/questions/69181605/best-way-to-handle-stripe-subscription-upgrade-and-downgrade
	- About the Flat-Rate Pricing Model: https://docs.stripe.com/products-prices/pricing-models#flat-rate

Payment Processing
------------------------
	- Finish Downgrade Plan Functionality
	- Allow user to update payment information for future payments (add a page for user to enter new payment method details (Another checkout form with PaymentElement))
	- Send Success Email after successful payment is made, after subscription cancellation, update, and renewal (see if we need to include invoice details)
	
	- Make a paywall page/component to redirect to whenever a user tries to access a premium feature without a valid subscription.
	- Get the Actual Payment Plans and the features they include from Daniel


SEO Optimization Functionality
------------------------------------------------
	- Create Optimization Tools
		1. Listing Optimizer (pricing/calendar, min-stay/gap-rule, title, description) (have copy-paste helpers)
			- Add a preview of this feature to the homepage (GetAudit.tsx) that uses the example-airbnb-response.json
		2. Image Optimizer (image re-ordering) + Photo AI Addon (image scoring)

	- Integrate with PMS Tools like Lodgify, Hostaway, Guesty, Smoobu
	- Add Appropriate Features for PMS Tools
		- Show Pricing/Calendar in Individual Listing Page
		- Calendar/Pricing Optimization
		- Syncing listings from provider
		- Edit listings
		- Add Listing Statistics in the Dashboard Page


The Last Stretch of MVP Development
--------------------------------------
	- Add Onboarding for new users
	- Add User Settings/Preferences if necessary
	- Database Updates
		- Add updated_at and created_at columns to listings and subscriptions
		- Change JSON columns to JSONB columns
		- Add RLS Policies to database tables
	- Ensure User Authentication Pages is working correctly (especially signup)
	- Re-style the Website using AI (from Daniel's pictures) (make sure everything is responsive)
	- Weekly Insights Newsletter
	- Guardrails / Safety Check


Future Improvements / Features
------------------------
	- EventIQ: Automatic pricing adjustment based on other events in the area (Dynamic Pricing)
	- A/B Testing: Compare different listing versions to see which performs better (automatically alternate between versions and track performance)
	- Drift Alerts: Notifies you when Airbnb is updated outside of boostbnb account
	- Portfolio Policies / Bulk Actions: ???
	- Redo Payment Processing with Stripe Webhooks (Possibly add a free trial)
	- Improve Cohost AI Assistant
		- Use Langchain & Vector DB to add context and memory
		- Add support for multiple conversations
		- Add support for image messages and possibly other file uploads
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
