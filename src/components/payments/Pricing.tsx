import Link from "next/link";
import Image from "next/image";
import { getPaymentPlans } from "@/actions/payments/stripe";

function Feature({ content }: { content: string }) {
	return (
		<div className="flex items-center gap-2">
			<Image src="/icons/check_fill.svg" alt="mingcute:check_fill" width={24} height={24} />
			{content}
		</div>
	);
}

const Pricing = async () => {
	const paymentPlans = await getPaymentPlans();

	return (
		<div
			className="mt-8 flex w-full flex-col items-center gap-8 bg-gray-300 pb-16 pt-8"
			id="pricing"
		>
			<div className="flex flex-col gap-2 text-center">
				<h1 className="text-3xl font-bold">Pricing</h1>
				<span className="mx-3">
					Whatever your status, our offers evolve according to your
					needs
				</span>
			</div>

			<div className="grid grid-cols-1 items-start gap-8 px-2 md:grid-cols-4">
				{paymentPlans.map((plan: any, index: number) => (
					<div
						key={index}
						className="intersect-once relative flex h-fit min-h-[28rem] flex-col gap-6 rounded-2xl bg-gray-100 p-8 pb-32 shadow-lg"
					>
						<div className="flex flex-col gap-4">
							<h2 className="text-center text-xl">{plan.name}</h2>
							<h1 className="text-center text-5xl">
								<span className="w-fit font-bold leading-none">
									${plan.price}
								</span>
								<span className="text-2xl">/Month</span>
							</h1>
						</div>
						<div className="flex flex-col">
							{plan.features.map((feature: any, idx: number) => (
								<Feature key={idx} content={feature} />
							))}
						</div>
						<div className="absolute bottom-8 left-0 z-10 flex w-full justify-center">
							<Link href={`${process.env.NEXT_PUBLIC_SERVER_URL}/payments/checkout?plan=${index}`}>
								Get {plan.name}
							</Link>
						</div>
					</div>
				))}
			</div>
		</div>
	)
}

export default Pricing;