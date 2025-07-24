import Image from "next/image";
import Link from "next/link";

import { IoTriangle } from "react-icons/io5";

interface Props {
  title: string;
  description?: string;
}

export const SidebarContent = ({
  title,
  description = "Reference docs",
}: Props) => {
  return (
    <section className="mb-6">
      <div className="flex flex-row items-center mb-2">
        <Image 
          src="/reference-badge-small.png"
          alt="App"
          width={45}
          height={36}
          className="mr-3"
        />
        <header className="mr-3">
          <h2 className="leading-5 text-primary font-medium text-base">
            {title}
          </h2>
          <p className="text-sm text-secondary">
            {description}
          </p>
        </header>
      </div>
      <dl className="mb-2">
        <dt className="text-left flex flex-row items-center space-x-1">
          <button className="flex items-center justify-center size-4 rounded transition hover:bg-accent">
            <IoTriangle className="size-2 rotate-90 text-muted" />
          </button>
          <Link href="/performance" className="text-xs text-tertiary hover:text-primary transition-colors font-medium w-full">
            Performance
          </Link>
        </dt> 
      </dl>
      <dl className="mb-2">
        <dt className="text-left flex flex-row items-center space-x-1">
          <button className="flex items-center justify-center size-4 rounded transition hover:bg-accent">
            <IoTriangle className="size-2 rotate-90 text-muted" />
          </button>
          <Link href="/performance" className="text-xs text-tertiary hover:text-primary transition-colors font-medium w-full">
            Requests & Tasks
          </Link>
        </dt> 
      </dl>
      <dl className="mb-2">
        <dt className="text-left flex flex-row items-center space-x-1">
          <button className="flex items-center justify-center size-4 rounded transition hover:bg-accent">
            <IoTriangle className="size-2 rotate-90 text-muted" />
          </button>
          <Link href="/performance" className="text-xs text-tertiary hover:text-primary transition-colors font-medium w-full">
            Employees
          </Link>
        </dt> 
      </dl>
      <dl className="mb-2">
        <dt className="text-left flex flex-row items-center space-x-1">
          <button className="flex items-center justify-center size-4 rounded transition hover:bg-accent">
            <IoTriangle className="size-2 rotate-90 text-muted" />
          </button>
          <Link href="/performance" className="text-xs text-tertiary hover:text-primary transition-colors font-medium w-full">
            Vibe
          </Link>
        </dt> 
      </dl>
      <dl className="mb-2">
        <dt className="text-left flex flex-row items-center space-x-1">
          <button className="flex items-center justify-center size-4 rounded transition hover:bg-accent">
            <IoTriangle className="size-2 rotate-90 text-muted" />
          </button>
          <Link href="/performance" className="text-xs text-tertiary hover:text-primary transition-colors font-medium w-full">
            Reimbursement
          </Link>
        </dt> 
      </dl>
      <dl className="mb-2">
        <dt className="text-left flex flex-row items-center space-x-1">
          <button className="flex items-center justify-center size-4 rounded transition hover:bg-accent">
            <IoTriangle className="size-2 rotate-90 text-muted" />
          </button>
          <Link href="/performance" className="text-xs text-tertiary hover:text-primary transition-colors font-medium w-full">
            Compensation
          </Link>
        </dt> 
      </dl>
      <dl className="mb-2">
        <dt className="text-left flex flex-row items-center space-x-1">
          <button className="flex items-center justify-center size-4 rounded transition hover:bg-accent">
            <IoTriangle className="size-2 rotate-90 text-muted" />
          </button>
          <Link href="/performance" className="text-xs text-tertiary hover:text-primary transition-colors font-medium w-full">
            Attendance
          </Link>
        </dt> 
      </dl>
      <dl className="mb-2">
        <dt className="text-left flex flex-row items-center space-x-1">
          <button className="flex items-center justify-center size-4 rounded transition hover:bg-accent">
            <IoTriangle className="size-2 rotate-90 text-muted" />
          </button>
          <Link href="/performance" className="text-xs text-tertiary hover:text-primary transition-colors font-medium w-full">
            HR Documents
          </Link>
        </dt> 
      </dl>
      <dl className="mb-2">
        <dt className="text-left flex flex-row items-center space-x-1">
          <button className="flex items-center justify-center size-4 rounded transition hover:bg-accent">
            <IoTriangle className="size-2 rotate-90 text-muted" />
          </button>
          <Link href="/performance" className="text-xs text-tertiary hover:text-primary transition-colors font-medium w-full">
            Recruitment
          </Link>
        </dt> 
      </dl>
      <dl className="mb-2">
        <dt className="text-left flex flex-row items-center space-x-1">
          <button className="flex items-center justify-center size-4 rounded transition hover:bg-accent">
            <IoTriangle className="size-2 rotate-90 text-muted" />
          </button>
          <Link href="/performance" className="text-xs text-tertiary hover:text-primary transition-colors font-medium w-full">
            Calendar
          </Link>
        </dt> 
      </dl>
      <dl className="mb-2">
        <dt className="text-left flex flex-row items-center space-x-1">
          <button className="flex items-center justify-center size-4 rounded transition hover:bg-accent">
            <IoTriangle className="size-2 rotate-90 text-muted" />
          </button>
          <Link href="/performance" className="text-xs text-tertiary hover:text-primary transition-colors font-medium w-full">
            Project
          </Link>
        </dt> 
      </dl>
    </section>
  );
}