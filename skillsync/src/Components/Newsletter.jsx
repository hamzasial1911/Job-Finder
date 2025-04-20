import React from "react";
import { FaEnvelopeOpenText, FaRegEnvelopeOpen, FaRocket } from "react-icons/fa6";

const Newsletter = () => {
  return (
    <div>
      <div>
        <h3 className="text-lg font-bold mb-2 flex items-center gap-2">
          <FaEnvelopeOpenText />
          Email me for Jobs
        </h3>
        <p className="text-secondary/75 text-base mb-4">
          Subscribe to our Newsletter to get best suggested jobs according to the Location.
        </p>
        <div className="w-full space-y-4">
          <input
            type="email"
            name="email"
            id="email"
            placeholder="name@email.com"
            className="w-full block py-2 pl-3 border focus:outline-none"
          />
          <input
            type="submit"
            value={"Subscribe"}
            className="w-full block py-2 pl-3 border focus:outline-none bg-secondary rounded-sm text-white cursor-pointer font-semibold"
          />
        </div>
      </div>

      {/* Second */}
      <div className="mt-20 ">
        <h3 className="text-lg font-bold mb-2 flex items-center gap-2">
          <FaRocket/>
          Get Noticed Faster
        </h3>
        <p className="text-secondary/75 text-base mb-4">
          Upload your resume to get notified faster with the jobs according to your skills.
        </p>
        <div className="w-full space-y-4">
          <input
            type="email"
            name="email"
            id="email"
            placeholder="name@email.com"
            className="w-full block py-2 pl-3 border focus:outline-none"
          />
          <input
            type="submit"
            value={"Upload Your Resume"}
            className="w-full block py-2 pl-3 border focus:outline-none bg-secondary rounded-sm text-white cursor-pointer font-semibold"
          />
        </div>
      </div>
    </div>
  );
};

export default Newsletter;
