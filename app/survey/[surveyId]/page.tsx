import React from "react";
import SurveyComponent from "./survey-component";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function TakeSurveyPage(props: {
  params: Promise<{ surveyId: string }>;
}) {
  const session = await auth();
  if (!session?.user) redirect("/sign-in");
  const params = await props.params;
  return <SurveyComponent params={params} />;
}
