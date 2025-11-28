import { redirect } from "next/navigation";
import ResponseComponent from "../response-component";
import { auth } from "@/auth";

export default async function ResponseDetailPage(props: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  if (!session?.user) redirect("/sign-in");
  const params = await props.params;
  return <ResponseComponent params={params} />;
}
