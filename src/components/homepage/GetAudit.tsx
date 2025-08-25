'use client';
import { analyzeListing } from "@/actions/listing";

export default function GetAudit() {
  return (
    <div className="my-8 w-full text-center">
      <h1 className="text-2xl md:text-3xl">
        Optimize your listing <span className="font-bold text-primary">For Free</span>
      </h1>
      <form action={analyzeListing} className="mx-auto flex w-2/3 flex-col items-center gap-1">
        <input name="bnburl" type="url" placeholder="Your Airbnb URL here" className="input input-bordered w-full md:w-3/4" />
        <input name="email" type="email" placeholder="Your email URL here" className="input input-bordered w-full md:w-3/4" />
        <button className="btn btn-primary w-full md:w-1/4">Optimize now</button>
      </form>
    </div>
  );
}
