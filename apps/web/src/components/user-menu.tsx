import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate, useRouter } from "@tanstack/react-router";

import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPositioner,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Skeleton } from "~/components/ui/skeleton";
import { authClient } from "~/lib/auth-client";
import { useORPC } from "~/orpc/context";

export default function UserMenu() {
  const navigate = useNavigate();
  const orpc = useORPC();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: session, isPending } = useQuery(orpc.auth.getSession.queryOptions());

  if (isPending) {
    return <Skeleton className="h-9 w-24" />;
  }

  if (!session) {
    return <Button variant="outline" render={<Link to="/login">Sign In</Link>} />;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={<Button variant="outline">{session.user.name}</Button>}
      />
      <DropdownMenuPositioner align="end">
        <DropdownMenuContent className="bg-card">
          <DropdownMenuGroup>
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>{session.user.email}</DropdownMenuItem>
            <DropdownMenuItem
              render={
                <Button
                  variant="destructive"
                  className="w-full"
                  onClick={() => {
                    void queryClient.invalidateQueries({
                      queryKey: orpc.auth.key(),
                    });
                    void router.invalidate();
                    void authClient.signOut({
                      fetchOptions: {
                        onSuccess: () => {
                          void navigate({
                            to: "/",
                          });
                        },
                      },
                    });
                  }}
                >
                  Sign Out
                </Button>
              }
            />
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenuPositioner>
    </DropdownMenu>
  );
}
