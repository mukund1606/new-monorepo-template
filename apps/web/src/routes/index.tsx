import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { orpc } = Route.useRouteContext();
  const { data } = useQuery(orpc.healthCheck.queryOptions());
  return (
    <div className="p-2">
      <h1 className="text-2xl font-bold">Hello</h1>
      <p className="text-sm text-gray-500">API Status: {data}</p>
    </div>
  );
}
