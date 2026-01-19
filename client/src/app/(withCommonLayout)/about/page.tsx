
import ProfessionalAboutPage from "@/components/about/ProfessionalAboutPage";
import MissionVisionSection from "@/components/MissionVisionSection/MissionVission";
// import TeamMembers from "@/components/team/TeamMembers";
import React from "react";

const about = () => {
  return (
    <div>
      <ProfessionalAboutPage />
      {/* <TeamMembers /> */}
      <MissionVisionSection />

    </div>
  );
};

export default about;
