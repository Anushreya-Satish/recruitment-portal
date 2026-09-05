"use client";

import React from "react";
import { BentoCard, BentoGrid } from "@/components/magicui/bento-grid";
import DeptHero from "./DeptHero";

import {
  PiBrainThin,
  PiPaintBrushBroadThin,
  PiCameraThin,
  PiMoneyWavyThin,
  PiCodeSimpleThin,
} from "react-icons/pi";

import { reviews } from "../constants/index";

export default function BentoGridComp() {
  // Map clean reviews to UI Cards
  const processedFeatures = reviews.map((review) => ({
    Icon: PiBrainThin,
    name: review.name,
    description: review.body,
    href: `/departments/${review.id}`,
    cta: "Join Department",
    className: "lg:col-span-1",
  }));

  const technicalFeatures = processedFeatures.slice(0, 5);
  const nonTechnicalFeatures = processedFeatures.slice(5, 10);

  return (
    <div className="flex flex-col gap-8 bg-black text-white p-4 md:p-6 rounded-xl">
      {/* Technical Departments Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DeptHero dept={{ name: "Technical Departments" }} />
        <div className="flex flex-col gap-4 justify-center">
          {technicalFeatures.map((feature) => (
            <BentoCard key={feature.name} {...feature} />
          ))}
        </div>
      </div>

      {/* Non-Technical Departments Section */}
      <div className="flex flex-col gap-6">
        <DeptHero dept={{ name: "Non-Technical Departments" }} />
        <BentoGrid className="grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {nonTechnicalFeatures.map((feature) => (
            <BentoCard key={feature.name} {...feature} />
          ))}
        </BentoGrid>
      </div>
    </div>
  );
}