import { 
  BsArrowUpSquareFill,
  BsBuildingFill, 
  BsCalendar2DateFill, 
  BsCashCoin, 
  BsEasel2Fill, 
  BsFileEarmarkTextFill, 
  BsFillInboxFill, 
  BsFillPersonPlusFill, 
  BsFolderFill, 
  BsPersonSquare 
} from "react-icons/bs";
import { IconType } from "react-icons";
import { GoPersonFill } from "react-icons/go";
import { LucideIcon, TrendingUpIcon } from "lucide-react";
import { IoBarChartSharp, IoBriefcase, IoBuild } from "react-icons/io5";
import { cva, VariantProps } from "class-variance-authority";

export const appVariants = cva("", {
  variants: {
    border: {
      danger: "border-[#fdd3cd]",
      marine: "border-[#e6f1fa]",
      warning: "border-[#ffe4af]",
      sunset: "border-[#ffdec4]",
    },
    background: {
      danger: "bg-[#fef3f1]",
      marine: "bg-[#f2f9ff]",
      warning: "bg-[#fff5e0]",
      sunset: "bg-[#fff5ed]",
    },
    icon: {
      danger: "text-[#cd3c3a]",
      marine: "text-[#2383e2]",
      warning: "text-[#ffb110]",
      sunset: "text-[#d95f0d]",
    }
  }
}); 
interface AppCategory extends VariantProps<typeof appVariants> {
  title: string;
  items: {
    title: string;
    href: string;
    description: string;
    icon: LucideIcon | IconType;
  }[];
  categoryIcon: LucideIcon | IconType;
}

export const APP_CATEGORIES: AppCategory[] = [
  {
    title: "Performance & Tasks",
    items: [
      {
        title: "Performance",
        href: "/performance",
        description: "Track and manage employee performance reviews and goals",
        icon: BsArrowUpSquareFill,
      },
      {
        title: "Requests & Tasks",
        href: "/requests-tasks",
        description: "Submit and manage various workplace requests and tasks",
        icon: BsFillInboxFill,
      },
    ],
    border: "warning",
    background: "warning",
    icon: "warning",
    categoryIcon: TrendingUpIcon
  },
  {
    title: "People Management",
    items: [
      {
        title: "Employees",
        href: "/employees",
        description: "Manage employee profiles, roles, and organizational structure",
        icon: BsPersonSquare,
      },
      {
        title: "Recruitment",
        href: "/recruitment",
        description: "Handle job postings, applications, and hiring processes",
        icon: BsFillPersonPlusFill,
      },
      {
        title: "HR Documents",
        href: "/hr-documents",
        description: "Access and manage important HR documents and policies",
        icon: BsFileEarmarkTextFill, 
      },
    ],
    border: "marine",
    background: "marine",
    icon: "marine",
    categoryIcon: GoPersonFill 
  },
  {
    title: "Compensation & Benefits",
    items: [
      {
        title: "Compensation",
        href: "/compensation",
        description: "View salary information, bonuses, and compensation details",
        icon: BsCashCoin,
      },
      {
        title: "Reimbursement",
        href: "/reimbursement",
        description: "Submit and track expense reimbursements and claims",
        icon: BsCashCoin,
      },
    ],
    border: "danger",
    background: "danger",
    icon: "danger",
    categoryIcon: IoBriefcase
  },
  {
    title: "Workplace & Culture",
    items: [
      {
        title: "Vibe",
        href: "/vibe",
        description: "Share feedback, participate in surveys, and build company culture",
        icon: BsEasel2Fill,
      },
      {
        title: "Attendance",
        href: "/attendance",
        description: "Track work hours, time off, and attendance records",
        icon: IoBarChartSharp,
      },
    ],
    border: "sunset",
    background: "sunset",
    icon: "sunset",
    categoryIcon: BsBuildingFill 
  },
  {
    title: "Tools & Planning",
    items: [
      {
        title: "Calendar",
        href: "/calendar",
        description: "Schedule meetings, events, and manage your work calendar",
        icon: BsCalendar2DateFill,
      },
      {
        title: "Project",
        href: "/project",
        description: "Collaborate on projects, track progress, and manage deadlines",
        icon: BsFolderFill,
      },
    ],
    border: "warning",
    background: "warning",
    icon: "warning",
    categoryIcon: IoBuild 
  }
];

export const prefixes = [
  "นาย",
  "นางสาว",
  "นาง",
] as const;