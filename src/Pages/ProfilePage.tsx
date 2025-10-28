import ProfileContent from "@/components/profile-page/components/profile-content";
import ProfileHeader from "@/components/profile-page/components/profile-header";
import { useTaskContext } from "@/TaskContext/TaskContext";
import Loader from "@/components/Loader";
const ProfilePage = () => {
  const { userData, loading } = useTaskContext();

  return (
    <>
      {loading == true ? (
        <div className="flex justify-center items-center h-full py-20">
          <Loader />
        </div>
      ) : (
        <div className="container mx-auto space-y-6 px-4 py-10">
          <ProfileHeader user={userData} />
          <ProfileContent />
        </div>
      )}
    </>
  );
};

export default ProfilePage;
