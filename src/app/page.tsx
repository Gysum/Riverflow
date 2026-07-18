import HeroSection from "./components/HeroSection";
import LatestQuestions from "./components/LatestQuestion";
import TopContributers from "./components/TopContributors";
import React, { Suspense } from "react";

export default function Home() {
  return (
    <main>
      <HeroSection />
      <div className="container mx-auto px-4 pb-20">
        <div className="flex flex-col gap-8 lg:flex-row">
          <div className="w-full lg:w-2/3">
            <h2 className="mb-4 text-2xl font-bold">Latest Questions</h2>
            <Suspense fallback={<div>Loading questions...</div>}>
              <LatestQuestions />
            </Suspense>
          </div>
          <div className="w-full lg:w-1/3">
            <h2 className="mb-4 text-2xl font-bold">Top Contributors</h2>
            <Suspense fallback={<div>Loading contributors...</div>}>
              <TopContributers />
            </Suspense>
          </div>
        </div>
      </div>
    </main>
  );
}