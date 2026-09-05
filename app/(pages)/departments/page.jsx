"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ManageAccounts,
  Campaign,
  ConnectWithoutContact,
  DesignServices,
  Palette,
  Language,
  Mobile2,
  SportsEsports,
  Analytics,
  Cloud,
  Hub,
  Trophy,
} from "@material-symbols-svg/react/outlined";

const departments = [
  {
    id: "management",
    name: "Management",
    icon: ManageAccounts,
    description: "Oversees operations, project timelines, and logistical coordination across active initiatives.",
    category: "Non-Technical",
  },
  {
    id: "publicity",
    name: "Publicity",
    icon: Campaign,
    description: "Drives community engagement and outreach through strategic media campaigns.",
    category: "Non-Technical",
  },
  {
    id: "outreach",
    name: "Outreach",
    icon: ConnectWithoutContact,
    description: "Establishes external partnerships, sponsorships, and organizational opportunities.",
    category: "Non-Technical",
  },
  {
    id: "ui-ux-design",
    name: "UI/UX Design",
    icon: DesignServices,
    description: "Creates accessible, user-centric interfaces and interactive user flow experiences.",
    category: "Technical",
  },
  {
    id: "design",
    name: "Design",
    icon: Palette,
    description: "Crafts visual brand identity, marketing collateral, and digital media assets.",
    category: "Non-Technical",
  },
  {
    id: "web-development",
    name: "Web Development",
    icon: Language,
    description: "Designs and maintains responsive web applications and full-stack web platforms.",
    category: "Technical",
  },
  {
    id: "app-development",
    name: "App Development",
    icon: Mobile2,
    description: "Builds cross-platform mobile applications focused on seamless user experiences.",
    category: "Technical",
  },
  {
    id: "game-development",
    name: "Game Development",
    icon: SportsEsports,
    description: "Explores graphics engines, interactive mechanics, and game design principles.",
    category: "Technical",
  },
  {
    id: "data-science",
    name: "Data Science",
    icon: Analytics,
    description: "Applies machine learning, predictive analytics, and statistical algorithms.",
    category: "Technical",
  },
  {
    id: "cloud-devops",
    name: "Cloud & DevOps",
    icon: Cloud,
    description: "Manages containerization, automated deployment pipelines, and cloud infrastructure.",
    category: "Technical",
  },
  {
    id: "blockchain",
    name: "Blockchain",
    icon: Hub,
    description: "Builds smart contracts and decentralized Web3 applications.",
    category: "Technical",
  },
  {
    id: "competitive-programming",
    name: "Competitive Programming",
    icon: Trophy,
    description: "Focuses on algorithmic efficiency, data structures, and problem-solving strategies.",
    category: "Technical",
  },
];

export default function DepartmentSelectionPage() {
  const router = useRouter();
  const [selectedDepts, setSelectedDepts] = useState([]);

  const toggleDepartment = (id) => {
    if (selectedDepts.includes(id)) {
      setSelectedDepts(selectedDepts.filter((item) => item !== id));
    } else {
      if (selectedDepts.length < 2) {
        setSelectedDepts([...selectedDepts, id]);
      }
    }
  };

  // Routes to /join/id1/id2
  const handleContinue = () => {
    if (selectedDepts.length > 0) {
      const routePath = selectedDepts.join("/");
      router.push(`/join/${routePath}`);
    }
  };

  const isMaxReached = selectedDepts.length === 2;

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 p-6 md:p-12 font-sans">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Navigation Breadcrumbs */}
        <nav className="flex items-center space-x-2 text-sm text-neutral-400">
          <Link href="/departments" className="hover:text-white transition">
            Departments
          </Link>
          <span>/</span>
          <Link href="/auth/signin" className="hover:text-white transition">
            Sign In
          </Link>
        </nav>

        {/* Header Block */}
        <div className="border-b border-neutral-800 pb-6 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
            <span className="text-xs uppercase tracking-widest text-blue-400 font-semibold">
              Step 01 · Select
            </span>
            <h1 className="text-3xl md:text-4xl font-bold text-white mt-1">
              Pick your departments
            </h1>
            <p className="text-neutral-400 text-sm mt-1">
              Select up to <strong className="text-white">two</strong> departments you wish to apply for.
            </p>
          </div>

          <div className="bg-neutral-900 border border-neutral-800 rounded-xl px-5 py-3 flex items-center space-x-3 shadow-lg">
            <span className="text-sm text-neutral-400">Selected:</span>
            <span
              className={`text-2xl font-bold ${
                isMaxReached ? "text-emerald-400" : "text-blue-500"
              }`}
            >
              {selectedDepts.length} / 2
            </span>
          </div>
        </div>

        {/* Action Bar */}
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold text-neutral-200">
            Available Departments
          </h2>
          <button
            onClick={handleContinue}
            disabled={selectedDepts.length === 0}
            className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${
              selectedDepts.length > 0
                ? "bg-blue-600 hover:bg-blue-500 text-white cursor-pointer shadow-lg shadow-blue-600/20"
                : "bg-neutral-800 text-neutral-500 cursor-not-allowed"
            }`}
          >
            Continue to application &rarr;
          </button>
        </div>

        {/* Department Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {departments.map((dept) => {
            const isSelected = selectedDepts.includes(dept.id);
            const isDisabled = !isSelected && isMaxReached;
            const IconComponent = dept.icon;

            return (
              <div
                key={dept.id}
                onClick={() => !isDisabled && toggleDepartment(dept.id)}
                className={`relative group p-5 rounded-2xl border transition-all duration-200 flex flex-col justify-between ${
                  isSelected
                    ? "bg-blue-950/30 border-blue-500 shadow-md shadow-blue-500/10 cursor-pointer"
                    : isDisabled
                    ? "bg-neutral-900/30 border-neutral-800/50 opacity-40 cursor-not-allowed"
                    : "bg-neutral-900/60 border-neutral-800/80 hover:border-neutral-700 hover:bg-neutral-900 cursor-pointer"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 rounded-lg bg-neutral-800/80 text-blue-400">
                        <IconComponent className="w-5 h-5" />
                      </div>
                      <span className="font-semibold text-base text-white">
                        {dept.name}
                      </span>
                    </div>

                    <div
                      className={`w-5 h-5 rounded flex items-center justify-center border transition-all ${
                        isSelected
                          ? "bg-blue-600 border-blue-500 text-white"
                          : "border-neutral-600 bg-neutral-800"
                      }`}
                    >
                      {isSelected && (
                        <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 20 20">
                          <path d="M0 11l2-2 5 5L18 3l2 2L7 18z" />
                        </svg>
                      )}
                    </div>
                  </div>

                  <p className="text-xs text-neutral-400 leading-relaxed">
                    {dept.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-neutral-800/50 flex justify-between items-center text-[10px] text-neutral-500">
                  <span className="uppercase tracking-wider font-semibold">
                    {dept.category}
                  </span>
                  {isSelected && (
                    <span className="text-blue-400 font-medium">Selected</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <footer className="pt-8 border-t border-neutral-900 text-center text-xs text-neutral-500">
          Organization · Recruitment Portal 2026
        </footer>
      </div>
    </div>
  );
}