
import ProfileDeatils from "@/components/profile/ProfileDeatils";
import ProfileVerification from "@/components/profile/ProfileVerification";

const ProfilePage = async () => {
  return (
    <>
      <div className="container mx-auto py-30 px-4">
        <ProfileDeatils />
        <ProfileVerification />
      </div>
    </>
  );
};

export default ProfilePage;
