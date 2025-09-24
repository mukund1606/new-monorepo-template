import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "@acme/auth";

import { api } from "~/orpc/server";

export default async function Page() {
  const currentSession = await auth.api.getSession({
    headers: await headers(),
  });

  if (!currentSession) {
    redirect("/login");
  }

  const privateData = await api.privateData();

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Welcome {currentSession.user.name}</p>
      <p>privateData: {privateData.message}</p>
    </div>
  );
}
