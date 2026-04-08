"use client";

import React from "react";
import WelcomeBanner from "./_components/WelcomeBanner";
import EnrollCourses from "./_components/EnrollCourses";
import ExploreNewQuests from "./_components/ExploreNewQuests";
import ExploreMore from "./_components/ExploreMore";
import InviteFriend from "./_components/InviteFriend";
import UserStatus from "./_components/UserStatus";
import UpgradeToPro from "./_components/UpgradeToPro";
import Leaderboard from "./_components/Leaderboard";

export default function Dashboard() {
  return (
    <div className="px-6 md:px-12 lg:px-24 xl:px-32 mt-10 mb-20 max-w-[1600px] mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10">
        {/* Left Column — Primary Learning Content */}
        <div className="md:col-span-2 space-y-8">
          <WelcomeBanner />
          
          {/* Section 1: Active user enrollments */}
          <EnrollCourses />
          
          {/* Section 2: Dynamic course discovery (2 courses + Browse button) */}
          <ExploreNewQuests />
          
          {/* Section 3: Static feature discovery (Quizz Pack, Projects, etc.) */}
          <ExploreMore />
          
          {/* Section 4: Community engagement */}
          <InviteFriend />
        </div>

        {/* Right Column — Sidebar Widgets & Global Rankings */}
        <div className="space-y-8">
          {/* User Status & XP Summary */}
          <UserStatus />
          
          {/* Global Platform Leaderboard */}
          <Leaderboard />
          
          {/* Upsell / Community Widgets */}
          <UpgradeToPro />
        </div>
      </div>
    </div>
  );
}
