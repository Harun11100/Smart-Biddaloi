"use client"
import Image from "next/image";
import { useRouter } from "next/navigation";


const Navbar = ({admin}) => {

    const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("schoolDetails");
    localStorage.removeItem("schoolData");
    router.push("/");
  };

  return (
    <div className="flex items-center justify-between px-4 py-3 bg-white/70 backdrop-blur-md border-b border-gray-200 ">

      <div className="flex items-center gap-5 ml-auto">

        {/* Message */}
         <div className="relative bg-gray-100 p-2 rounded-full hover:bg-gray-200 cursor-pointer transition">
      <button onClick={handleLogout} className="flex items-center">
        <Image src="/logout.png" alt="logout" width={20} height={20} />
      </button>
     </div>
        
        <div className="hidden sm:flex flex-col text-right leading-tight">
          <span className="text-sm font-semibold text-gray-800">{admin}</span>
          <span className="text-[11px] text-gray-500">Admin</span>
        </div>

        <div className="rounded-full w-10 h-10 overflow-hidden border-2 border-gray-200 shadow-md cursor-pointer hover:scale-105 transition">
          <Image src="/avatar.png" alt="Avatar" width={40} height={40} />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
