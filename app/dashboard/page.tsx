// Force TS Server re-evaluation
import React from "react";
import WelcomeBanner from "./_components/WelcomeBanner";
import EnrollCourses from "./_components/EnrollCourses";
import ExploreMore from "./_components/ExploreMore";
import InviteFriend from "./_components/InviteFriend";
import UserStatus from "./_components/UserStatus";
import UpgradeToPro from "./_components/UpgradeToPro";

export default function Dashboard() {
  return (
    <div className="px-10 md:px-20 lg:px-32 xl:px-48 mt-10">
      <div className="grid md:grid-cols-3 gap-7">
        {/* Left Column — Main Content */}
        <div className="col-span-2 space-y-7">
          <WelcomeBanner />
          <EnrollCourses />
          <ExploreMore />
          <InviteFriend />
        </div>

        {/* Right Column — Sidebar Widgets */}
        <div>
          <UserStatus />
          <UpgradeToPro />
        </div>
      </div>
    </div>
  );
}
