import { ProjectSidebar } from "@/components/ProjectSidebar";
import Dashboard from "@/components/layout/Dashboard";

export default function Home() {
  return (
    <>
      <div className="hidden lg:block">
        <ProjectSidebar />
      </div>

      <Dashboard />
    </>
  );
}
