import type { IAuthenticationService } from "@acme/business-logic/application/services/authentication.service.interface";
import type { Session } from "@acme/business-logic/entities/models/session";
import type { User } from "@acme/business-logic/entities/models/user";
import { UnauthenticatedError } from "@acme/business-logic/entities/errors/auth";
import { sessionSchema } from "@acme/business-logic/entities/models/session";
import { userSchema } from "@acme/business-logic/entities/models/user";

export class MockAuthenticationService implements IAuthenticationService {
  private _sessions: Record<string, { session: Session; user: User }>;

  constructor() {
    this._sessions = {};
  }

  async getSession(context: {
    request: Request;
  }): Promise<{ user: User; session: Session }> {
    const headers = context.request.headers;

    const userSession = this._sessions[headers.get("Authorization") ?? ""];
    if (!userSession) {
      throw new UnauthenticatedError("Unauthenticated");
    }
    const session = sessionSchema.parse(userSession);
    const user = userSchema.parse(userSession.user);
    return {
      session,
      user,
    };
  }
}
