interface HeaderCardProps {
  num: string;
  text: string;
}

function HeaderCard({ num, text }: HeaderCardProps) {
  return (
    <div className="flex h-40 w-full flex-col items-center rounded-md border-1 border-gray-300 md:w-1/3">
      <div className="my-auto h-fit text-center">
        <h2 className="text-4xl font-bold">{num}</h2>
        <p className="font-bold text-slate-600">{text}</p>
      </div>
    </div>
  );
}

export default function ProjectStats() {
  return (
    <div className="mx-auto mt-16 w-11/12">
      <h1 className="mx-auto w-full text-center text-2xl font-bold md:w-2/3 md:text-4xl">
        Unlock Your Airbnb Hosting Potential with BoostBNB's AI-Powered Solutions
      </h1>
      <div className="mx-auto mt-4 flex w-full flex-col gap-2 md:w-2/3 md:flex-row">
        <HeaderCard num="500+" text="Listings Optimized" />
        <HeaderCard num="100+" text="Happy Hosts" />
        <HeaderCard num="96%" text="Satisfaction Rate" />
      </div>
    </div>
  );
}
