import React from "react";
import AuthPage from "@/app/signin/AuthPage/AuthPage";

const SignInPage: React.FC = () => {
  return (
    <div className="relative h-screen w-full overflow-hidden font-sans">
      {/* Fullscreen Ocean Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src="/Ocean.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Overlay for readability */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Content Split */}
      <div className="relative z-20 flex h-full w-full">
        {/* Left Side - Heading */}
        <div className="hidden md:flex flex-col justify-center pl-16 w-1/2">
          <h2 className="text-white text-3xl md:text-5xl font-bold uppercase leading-tight drop-shadow-lg">
            SIGN IN TO <br />
            <span className="text-cyan-400">PROTECT THE COAST</span>
          </h2>
          <p className="mt-4 text-gray-200 max-w-md text-sm md:text-base">
            Join Samudra Prahari to report, verify, and monitor coastal hazards in real time.
          </p>
        </div>

        {/* Right Side - Auth Form (no card background) */}
        <div className="flex items-center justify-center w-full md:w-1/2 px-6 sm:px-10">
          <div className="w-full max-w-md p-6 rounded-2xl">
            <AuthPage />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignInPage;
