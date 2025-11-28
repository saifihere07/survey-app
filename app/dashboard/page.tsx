import { auth } from "@/auth";
import DashboardComponent from "./dashboard-component";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user) redirect("/sign-in");
  return <DashboardComponent />;
}
