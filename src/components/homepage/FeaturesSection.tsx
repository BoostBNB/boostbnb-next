
interface BoxProps {
    src: string;
    alt: string;
    title: string;
    text: string;
}

function Feature({ content }: { content: string }) {
  return (
<span className="flex items-center gap-1 rounded-full bg-gray-200 px-4 py-2 text-gray-700"
  ><img src="/icons/check_fill.svg" alt="mingcute:check_fill" /> {content}</span>
)}

function Box(input: BoxProps) {
  return (
<div className="rounded-lg border-1 border-gray-300 p-6 shadow-sm">
  <div className="inline-block size-14 rounded-lg bg-black p-3 text-center text-white">
    <img src={input.src} alt={input.alt} className="m-auto aspect-square w-11/12" />
  </div>
  <h3 className="mt-4 text-lg font-semibold">{input.title}</h3>
  <p className="mt-2 text-gray-600">{input.text}</p>
</div>
)}


export default function FeaturesSection() {
  return (  
  <section className="bg-gray-100 px-6 py-12 md:px-16">
    <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-2">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Box
          src='/icons/sparkles_line.svg'
          alt='mingcute:sparkles_line'
          title='AI-Powered Insights'
          text='Smarter recommendations to optimize pricing, descriptions, and booking strategies.'
        />
        <Box
          src='/icons/heart_hand_line.svg'
          alt='mingcute:heart_hand_line'
          title='Seamless Collaboration'
          text='Effortlessly coordinate with co-hosts or property managers in real-time.'
          />
        <Box
          src='/icons/sandglass_2_line.svg'
          alt='mingcute:sandglass_2_line'
          title='Time-Saving Tools'
          text='Organize your day with AI-automated scheduling and task prioritization.'
          />
        <Box
          src='/icons/bell_ringing_line.svg'
          alt='mingcute:bell_ringing_line'
          title='Automated Reminders'
          text='Never miss a pricing update or guest communication with smart notifications.'
          />
      </div>
      <div>
        <h2 className="text-3xl font-bold">Maximize Your Hosting Potential with BoostBNB</h2>
        <p className="mt-4 text-gray-600">
          Experience unparalleled efficiency with tailored AI-driven features, seamless collaboration tools, and smart automation designed to elevate
          your Airbnb listings.
        </p>
        <div className="mt-6 flex flex-wrap gap-2">
          <Feature content='24/7 Customer Support'/>
          <Feature content='Real-Time Sync'/>
          <Feature content='Offline Access'/>
          <Feature content='Quick Listing Updates'/>
        </div>
      </div>
    </div>
  </section>
  )
}
