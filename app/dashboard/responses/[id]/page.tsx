import ResponseComponent from "../response-component";

export default async function ResponseDetailPage(props: {
  params: Promise<{ id: string }>;
}) {
  const params = await props.params;
  return <ResponseComponent params={params} />;
}
