

import Announcements from "@/app/components/Announcements";
import AttendanceChartContainer from "@/app/components/AttendanceChartContainer";
import CountChartContainer from "@/app/components/CountChartContainer";
import EventCalendarContainer from "@/app/components/EventCalendarContainer";
import FinanceChart from "@/app/components/FinanceChart";
import UserCard from "@/app/components/UserCard";

const AdminPage = ({ params, searchParams }) => {
  const schoolId = params.schoolId;   

  return (
    <div className="p-4 flex gap-4 flex-col md:flex-row">
      {/* LEFT */}
      <div className="w-full lg:w-2/3 flex flex-col gap-8">

        {/* USER CARDS */}
        <div className="flex gap-4 justify-between flex-wrap">
          <UserCard type="admin" schoolId={schoolId} />
        </div>

        <div className="flex gap-4 flex-col lg:flex-row">
          {/* COUNT CHART */}
          <div className="w-full lg:w-1/3 h-[450px]">
            <CountChartContainer schoolId={schoolId} />
          </div>

          {/* ATTENDANCE CHART */}
          <div className="w-full lg:w-2/3 h-[450px]">
            <AttendanceChartContainer schoolId={schoolId} />
          </div>
        </div>

        {/* BOTTOM CHART */}
        <div className="w-full h-[500px]">
          {/* <FinanceChart schoolId={schoolId} /> */}
        </div>
      </div>

      {/* RIGHT */}
      <div className="w-full lg:w-1/3 flex flex-col gap-8">
        <EventCalendarContainer searchParams={searchParams} schoolId={schoolId} />
        <Announcements schoolId={schoolId} />
      </div>
    </div>
  );
};

export default AdminPage;
