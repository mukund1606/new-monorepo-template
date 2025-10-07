import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { orpc } = Route.useRouteContext();
  const { data } = useQuery(orpc.healthCheck.queryOptions());
  return <div>Hello {data}</div>;
}
