import Link from "next/link";
import LandingPageNavBar from "./_components/navbar";
import BeamsBackground from "./_components/beams-background";

export default async function LandingPage() {
  return (
    <main className="relative min-h-screen overflow-hidden text-white">
      {/* Beams Background */}
      <BeamsBackground />

      {/* Navbar */}
      <div className="absolute top-0 left-0 w-full z-20 p-10">
        <LandingPageNavBar />
      </div>

      {/* Hero Section */}
      <div className="flex items-center justify-center h-screen relative z-10 px-6 sm:text-center">
        <div className="space-y-6">
          <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
            One Video is Worth a Thousand Words
          </h1>
          <p className="text-lg lg:text-2xl font-semibold text-gray-300 max-w-[800px] mx-auto">
            Easily record and share AI-powered video messages with your
            teammates and customers to supercharge productivity
          </p>
          <div className="flex gap-4 sm:justify-center mt-6">
            <Link href="/auth/sign-up">
              {" "}
              <button className="px-6 py-3 bg-[#695bff] hover:bg-[#7320DD]/80 text-white font-semibold text-lg rounded-full">
                Get Started
              </button>
            </Link>

            <button className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white font-semibold text-lg rounded-full">
              Watch Demo
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
