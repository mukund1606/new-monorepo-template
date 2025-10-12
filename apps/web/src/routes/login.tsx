import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import SignInForm from "~/components/sign-in-form";
import SignUpForm from "~/components/sign-up-form";

export const Route = createFileRoute("/login")({
  component: RouteComponent,
});

function RouteComponent() {
  const [showSignIn, setShowSignIn] = useState(false);

  if (showSignIn) {
    return (
      <SignInForm
        onSwitchToSignUp={() => {
          setShowSignIn(false);
        }}
      />
    );
  }

  return (
    <SignUpForm
      onSwitchToSignIn={() => {
        setShowSignIn(true);
      }}
    />
  );
}
