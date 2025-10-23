import ProfileContent from "@/components/profile-page/components/profile-content";
import ProfileHeader from "@/components/profile-page/components/profile-header";
const ProfilePage = () => {
  const user = {
    name: "Hasnain Ahmad",
    email: "hasnain@example.com",
    location: "Lahore, Pakistan",
    joinedAt: "October 2025",
    role: "Full-Stack Developer",
    avatarUrl: "https://example.com/avatar.png",
    membership: "Pro Member",
  };

  return (
    <div className="container mx-auto space-y-6 px-4 py-10">
      <ProfileHeader user={user} />
      <ProfileContent />
    </div>
  );
};

export default ProfilePage;
