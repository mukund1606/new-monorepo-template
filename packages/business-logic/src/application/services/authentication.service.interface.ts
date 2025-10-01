import type { Session } from "~/entities/models/session";
import type { User } from "~/entities/models/user";

export interface IAuthenticationService {
  getSession(context: {
    request: Request;
  }): Promise<{ user: User; session: Session } | undefined>;
}
