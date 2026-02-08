"use client";

import Image from "next/image";
import Link from "next/link";
import { role } from "@/app/lib/data";

interface MenuProps {
  slug: string;
  schoolId: string;
}

interface MenuItem {
  icon: string;
  label: string;
  href: string;
  visible: string[];
}

interface MenuSection {
  title: string;
  items: MenuItem[];
}

const Menu: React.FC<MenuProps> = ({ slug ,schoolId }) => {
  const menuItems: MenuSection[] = [
    {
      title: "MENU",
      items: [
        {
          icon: "/home.png",
          label: "Home",
          href: `/admin/${slug}`,
          visible: ["admin", "teacher", "student", "parent"],
        },
        {
          icon: "/finance.png",
          label: "Payments",
          href: slug ? `/list/${slug}/${schoolId}/payments` : "#",
          visible: ["admin"],
        },
        {
          icon: "/teacher.png",
          label: "Teachers",
          href: slug ? `/list/${slug}/${schoolId}/teachers` : "#",
          visible: ["admin", "teacher"],
        },
        {
          icon: "/student.png",
          label: "Students",
          href: slug ? `/list/${slug}/${schoolId}/students` : "#",
          visible: ["admin", "teacher"],
        },
        {
          icon: "/subject.png",
          label: "Subjects",
          href: slug ? `/list/${slug}/${schoolId}/subjects` : "#",
          visible: ["admin"],
        },
        {
          icon: "/class.png",
          label: "Classes",
          href: slug ? `/list/${slug}/${schoolId}/classes` : "#",
          visible: ["admin", "teacher"],
        },
        {
          icon: "/assignment.png",
          label: "Assignments",
          href: slug ? `/list/${slug}/${schoolId}/assignments` : "#",
          visible: ["admin", "teacher", "student", "parent"],
        },
        {
          icon: "/result.png",
          label: "Results",
          href: slug ? `/list/${slug}/${schoolId}/results` : "#",
          visible: ["admin", "teacher", "student", "parent"],
        },
        {
          icon: "/attendance.png",
          label: "Attendance",
          href: slug ? `/list/${slug}/${schoolId}/attendance` : "#",
          visible: ["admin", "teacher", "student", "parent"],
        },
        {
          icon: "/announcement.png",
          label: "Announcements",
          href: slug ? `/list/${slug}/${schoolId}/announcements` : "#",
          visible: ["admin", "teacher", "student", "parent"],
        },
      ],
    },
  ];

  return (
    <div className="mt-4 text-sm">
      {menuItems.map((section) => (
        <div className="flex flex-col gap-2" key={section.title}>
          <span className="hidden lg:block text-gray-400 font-light my-4">
            {section.title}
          </span>
          {section.items
            .filter((item) => item.visible.includes(role))
            .map((item) => (
              <Link
                href={item.href}
                key={item.label}
                className="flex items-center justify-center lg:justify-start gap-4 text-gray-500 py-2 md:px-2 rounded-md hover:bg-lamaSkyLight transition-colors duration-200"
              >
                <Image src={item.icon} alt={item.label} width={20} height={20} />
                <span className="hidden lg:block">{item.label}</span>
              </Link>
            ))}
        </div>
      ))}
    </div>
  );
};

export default Menu;
