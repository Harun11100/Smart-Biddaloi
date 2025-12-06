import Image from "next/image";

interface UserCardProps {
  type: "student" | "teacher" | "parent" | "staff" | string;
}

const UserCard: React.FC<UserCardProps> = ({ type }) => {
  const bgColors: Record<string, string> = {
    student: "from-green-50 to-green-200",
    teacher: "from-blue-50 to-blue-200",
    parent: "from-purple-50 to-purple-200",
    staff: "from-yellow-50 to-yellow-200",
  };

  return (
    <div
      className={`
        flex-1 min-w-[150px] rounded-2xl p-5
        bg-gradient-to-br ${bgColors[type] ?? "from-gray-50 to-gray-200"}
        shadow-sm border border-gray-200
        hover:shadow-md transition-all duration-300
      `}
    >
      {/* Top Section */}
      <div className="flex justify-between items-center">
        <span className="text-[11px] px-3 py-1 rounded-full bg-green-100 text-green-700 font-medium shadow-sm">
          2024/25
        </span>

        <button
          type="button"
          className="p-1 hover:bg-white/40 rounded-full transition"
        >
          <Image src="/more.png" alt="More" width={18} height={18} />
        </button>
      </div>

      {/* Number */}
      <h1 className="text-3xl font-semibold mt-6 mb-2 text-gray-900 tracking-tight">
        1,234
      </h1>

      {/* Label */}
      <h2 className="text-sm font-medium text-gray-700 capitalize">
        {type}s
      </h2>
    </div>
  );
};

export default UserCard;
