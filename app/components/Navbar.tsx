"use client"
import Image from "next/image";
import { useRouter } from "next/navigation";


const Navbar = () => {

    const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("schoolDetails");
    // optional: redirect user after logout
    router.push("/");
  };
  return (
    <div className="flex items-center justify-between px-4 py-3 bg-white/70 backdrop-blur-md border-b border-gray-200 ">
      
      {/* Search */}
      <div className="hidden md:flex items-center gap-2 text-sm px-3 py-[6px] rounded-full bg-gray-100 hover:bg-gray-200 transition-all">
        <Image src="/search.png" alt="Search" width={16} height={16} />
        <input
          type="text"
          placeholder="Search..."
          className="w-[200px] bg-transparent outline-none text-gray-700 placeholder-gray-500"
        />
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-5 ml-auto">

        {/* Message */}
         <div className="relative bg-gray-100 p-2 rounded-full hover:bg-gray-200 cursor-pointer transition">
      <button onClick={handleLogout} className="flex items-center">
        <Image src="/logout.png" alt="logout" width={20} height={20} />
      </button>
     </div>
        <div className="relative bg-gray-100 p-2 rounded-full hover:bg-gray-200 cursor-pointer transition">
          <Image src="/setting.png" alt="setting" width={20} height={20} />
        </div>

        {/* Announcement with badge */}
        <div className="relative bg-gray-100 p-2 rounded-full hover:bg-gray-200 cursor-pointer transition">
          <Image src="/announcement.png" alt="Notifications" width={20} height={20} />
          <span className="absolute -top-1.5 -right-1.5 w-5 h-5 text-xs bg-purple-600 text-white rounded-full flex items-center justify-center shadow-md">
            1
          </span>
        </div>

        {/* User Info */}
        <div className="hidden sm:flex flex-col text-right leading-tight">
          <span className="text-sm font-semibold text-gray-800">Md Harun Or Rashid</span>
          <span className="text-[11px] text-gray-500">Admin</span>
        </div>

        {/* Avatar */}
        <div className="rounded-full w-10 h-10 overflow-hidden border-2 border-gray-200 shadow-md cursor-pointer hover:scale-105 transition">
          <Image src="/avatar.png" alt="Avatar" width={40} height={40} />
        </div>
      </div>
    </div>
  );
};

export default Navbar;


   // {
      //   icon: "/profile.png",
      //   label: "Profile",
      //   href: "/profile",
      //   visible: ["admin", "teacher", "student", "parent"],
      // },
      // {
      //   icon: "/setting.png",
      //   label: "Settings",
      //   href: "/settings",
      //   visible: ["admin", "teacher", "student", "parent"],
      // },
      // {
      //   icon: "/logout.png",
      //   label: "Logout",
      //   href: "/logout",
      //   visible: ["admin", "teacher", "student", "parent"],
      // },
    