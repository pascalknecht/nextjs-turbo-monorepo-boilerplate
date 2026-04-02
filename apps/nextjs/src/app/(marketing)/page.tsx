import React from "react";
import { PricingSection } from "./pricing";
import { HeroSection } from "./hero";
import { FeaturesSection } from "./features";
import { CallToAction } from "./call-to-action";
import { SocialProof } from "./social-proof";

export default async function Home() {
  return (
    <div>
      <HeroSection />
      <SocialProof />
      <FeaturesSection />
      <PricingSection />
      <CallToAction />
    </div>
  );
}
