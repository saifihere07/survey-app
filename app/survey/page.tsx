import SurveyComponentMain from "./survey-component-main";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function SurveyListPage() {
  const session = await auth();
  if (!session?.user) redirect("/sign-in");
  return <SurveyComponentMain />;
}
