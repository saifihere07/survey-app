import React from "react";
import SurveyComponent from "./survey-component";

export default async function TakeSurveyPage(props: {
  params: Promise<{ surveyId: string }>;
}) {
  const params = await props.params;
  return <SurveyComponent params={params} />;
}
