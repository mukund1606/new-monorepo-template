import { useMutation, useQuery } from "@tanstack/react-query";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { useState } from "react";

import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Checkbox } from "~/components/ui/checkbox";
import { Input } from "~/components/ui/input";

export const Route = createFileRoute("/dashboard")({
  component: RouteComponent,
  beforeLoad: async ({ context }) => {
    const { currentSession, orpc, queryClient } = context;
    if (!currentSession) {
      throw redirect({
        to: "/login",
      });
    }

    await queryClient.ensureQueryData(orpc.todo.get.queryOptions());

    return {
      currentSession,
    };
  },
});

function RouteComponent() {
  const [todo, setTodo] = useState("");
  const { orpc, queryClient } = Route.useRouteContext();
  const { data: todos } = useQuery(orpc.todo.get.queryOptions());
  const createTodo = useMutation(
    orpc.todo.create.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(orpc.todo.get.queryOptions());
      },
    }),
  );

  const toggleTodo = useMutation(
    orpc.todo.toggle.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(orpc.todo.get.queryOptions());
      },
    }),
  );

  const handleCreateTodo = () => {
    if (todo.trim() === "") return;
    setTodo("");
    createTodo.mutate({
      todo,
    });
  };

  const handleToggleTodo = (todoId: number) => {
    toggleTodo.mutate({
      todoId,
    });
  };

  return (
    <div className="container mx-auto max-w-4xl space-y-6 px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="text-foreground text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground mt-2">Manage your todos</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Add New Todo</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3">
            <Input
              placeholder="Enter your todo..."
              value={todo}
              onChange={(e) => {
                setTodo(e.target.value);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleCreateTodo();
                }
              }}
              className="flex-1"
            />
            <Button
              onClick={handleCreateTodo}
              disabled={!todo.trim() || createTodo.isPending}
            >
              {createTodo.isPending ? "Adding..." : "Add Todo"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>
            Your Todos {(todos?.length ?? 0) > 0 ? `(${todos?.length})` : ""}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!todos || todos.length === 0 ? (
            <div className="text-muted-foreground py-12 text-center">
              <p className="mb-2 text-lg">No todos yet</p>
              <p className="text-sm">Add your first todo above to get started!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {todos.map((todo) => (
                <div
                  key={todo.id}
                  className="border-border bg-muted/30 hover:bg-muted/50 flex items-center gap-3 rounded-lg border p-4 transition-colors"
                >
                  <Checkbox
                    checked={todo.completed}
                    onCheckedChange={() => {
                      handleToggleTodo(todo.id);
                    }}
                    disabled={toggleTodo.isPending}
                    className="mt-0.5"
                  />
                  <p
                    className={`text-foreground flex-1 text-sm font-medium ${
                      todo.completed ? "text-muted-foreground line-through" : ""
                    }`}
                  >
                    {todo.todo}
                  </p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
