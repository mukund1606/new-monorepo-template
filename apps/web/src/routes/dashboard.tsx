import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";

import { useORPC } from "~/orpc/context";

export const Route = createFileRoute("/dashboard")({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = Route.useNavigate();
  const orpc = useORPC();
  const { currentSession } = Route.useRouteContext();

  const privateData = useQuery(orpc.privateData.queryOptions());

  useEffect(() => {
    if (!currentSession) {
      void navigate({
        to: "/login",
      });
    }
  }, [currentSession, navigate]);

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Welcome {currentSession?.user.name}</p>
      <p>privateData: {privateData.data?.message}</p>
    </div>
  );
}
