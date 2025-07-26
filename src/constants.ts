interface AppCategory {
  title: string;
  items: {
    title: string;
    href: string;
    description: string;
    image: string;
  }[];
  color: {
    border: string;
    background: string;
  };
}

export const APP_CATEGORIES: AppCategory[] = [
  {
    title: "Performance & Tasks",
    items: [
      {
        title: "Performance",
        href: "/performance",
        description: "Track and manage employee performance reviews and goals",
        image: "/keyboard-double-arrow-up.svg",
      },
      {
        title: "Requests & Tasks",
        href: "/requests-tasks",
        description: "Submit and manage various workplace requests and tasks",
        image: "/quick-reference.svg",
      },
    ],
    color: {
      border: "#ffe4af",
      background: "#fff5e0",
    },
  },
  {
    title: "People Management",
    items: [
      {
        title: "Employees",
        href: "/employees",
        description: "Manage employee profiles, roles, and organizational structure",
        image: "/person-pin.svg",
      },
      {
        title: "Recruitment",
        href: "/recruitment",
        description: "Handle job postings, applications, and hiring processes",
        image: "/person-add.svg",
      },
      {
        title: "HR Documents",
        href: "/hr-documents",
        description: "Access and manage important HR documents and policies",
        image: "/data-table.svg",
      },
    ],
    color: {
      border: "#e6f1fa",
      background: "#f2f9ff",
    },
  },
  {
    title: "Compensation & Benefits",
    items: [
      {
        title: "Compensation",
        href: "/compensation",
        description: "View salary information, bonuses, and compensation details",
        image: "/attach-money.svg",
      },
      {
        title: "Reimbursement",
        href: "/reimbursement",
        description: "Submit and track expense reimbursements and claims",
        image: "/price-check.svg",
      },
    ],
    color: {
      border: "#fdd3cd",
      background: "#fef3f1",
    },
  },
  {
    title: "Workplace & Culture",
    items: [
      {
        title: "Vibe",
        href: "/vibe",
        description: "Share feedback, participate in surveys, and build company culture",
        image: "/finance-mode.svg",
      },
      {
        title: "Attendance",
        href: "/attendance",
        description: "Track work hours, time off, and attendance records",
        image: "/browse-activity.svg",
      },
    ],
    color: {
      border: "#ffdec4",
      background: "#fff5ed",
    },
  },
  {
    title: "Tools & Planning",
    items: [
      {
        title: "Calendar",
        href: "/calendar",
        description: "Schedule meetings, events, and manage your work calendar",
        image: "/dataset.svg",
      },
      {
        title: "Project",
        href: "/project",
        description: "Collaborate on projects, track progress, and manage deadlines",
        image: "/create-new-folder.svg",
      },
    ],
    color: {
      border: "#ffe4af",
      background: "#fff5e0",
    },
  }
];

export const LANGUAGES = [
  {
    code: "en" as const,
    name: "English (US)",
  },
  {
    code: "th" as const,
    name: "ภาษาไทย",
  }
]