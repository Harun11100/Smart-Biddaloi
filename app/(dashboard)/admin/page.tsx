import Announcements from "@/app/components/Announcements";
import AttendanceChart from "@/app/components/AttendanceChart";
import CountChart from "@/app/components/CountChart";
import EventCalendar from "@/app/components/EventCalendar";
import FinanceChart from "@/app/components/FinanceChart";
import UserCard from "@/app/components/UserCard";

const AdminPage = () => {
  return (
    <div className="p-4 md:p-6 lg:p-8 bg-gray-50 min-h-screen">
      <div className="flex flex-col xl:flex-row gap-8">

        {/* LEFT SECTION */}
        <div className="w-full xl:w-2/3 flex flex-col gap-8">

          {/* USER CARDS */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <UserCard type="student" />
            <UserCard type="teacher" />
            <UserCard type="parent" />
            {/* <UserCard type="staff" /> */}
          </div>

          {/* CHARTS SECTION */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* COUNT CHART */}
            <div className="col-span-1 h-[420px] bg-white shadow rounded-xl p-4">
              <CountChart />
            </div>

            {/* ATTENDANCE */}
            <div className="col-span-1 lg:col-span-2 h-[420px] bg-white shadow rounded-xl p-4">
              <AttendanceChart />
            </div>
          </div>

          {/* FINANCE CHART */}
          <div className="h-[480px] bg-white shadow rounded-xl p-4">
            <FinanceChart />
          </div>

        </div>

        <div className="w-full xl:w-1/3 flex flex-col gap-8">

          <div className="bg-white shadow rounded-xl p-4">
            <EventCalendar />
          </div>

          <div className="bg-white shadow rounded-xl p-4">
            <Announcements />
          </div>

        </div>

      </div>
    </div>
  );
};

export default AdminPage;
