import { useMutation, useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { useORPC } from "~/orpc/context";

export const Route = createFileRoute("/")({
  component: HomeComponent,
});

const channel = "test";

function HomeComponent() {
  const orpc = useORPC();
  const [message, setMessage] = useState("");
  const messages = useQuery(
    orpc.chat.onMessage.experimental_streamedOptions({
      input: { channel },
      refetchOnMount: true,
      enabled: true,
    }),
  );
  const sendMessage = useMutation(orpc.chat.sendMessage.mutationOptions());

  return (
    <div className="container mx-auto max-w-3xl px-4 py-2">
      <section className="space-y-4 rounded-lg border p-4">
        <h2 className="mb-2 font-medium">Server Sent Events</h2>
        <div className="flex items-center gap-2">
          <Input
            type="text"
            placeholder="Message"
            value={message}
            onChange={(e) => {
              setMessage(e.target.value);
            }}
          />
          <Button
            onClick={() => {
              sendMessage.mutate({ channel, message });
            }}
          >
            Send
          </Button>
        </div>
        <div className="flex flex-col items-center gap-2">
          {messages.data?.map((message) => (
            <div className="w-full rounded-md border p-2 text-sm" key={message}>
              {message}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
