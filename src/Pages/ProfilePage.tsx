import ProfileContent from "@/components/profile-page/components/profile-content";
import ProfileHeader from "@/components/profile-page/components/profile-header";
import { useTaskContext } from "@/TaskContext/TaskContext";
const ProfilePage = () => {
  const { userData } = useTaskContext();

  return (
    <div className="container mx-auto space-y-6 px-4 py-10">
      <ProfileHeader user={userData} />
      <ProfileContent />
    </div>
  );
};

export default ProfilePage;
