import type { IAuthenticationService } from "@acme/business-logic/application/services/authentication.service.interface";
import type { IInstrumentationService } from "@acme/business-logic/application/services/instrumentation.service.interface";
import type { Session } from "@acme/business-logic/entities/models/session";
import type { User } from "@acme/business-logic/entities/models/user";
import { sessionSchema } from "@acme/business-logic/entities/models/session";
import { userSchema } from "@acme/business-logic/entities/models/user";

import type { Auth } from "~/index";
import { auth } from "~/index";

export class AuthenticationService implements IAuthenticationService {
  private _betterAuth: Auth;

  constructor(private readonly _instrumentationService: IInstrumentationService) {
    this._betterAuth = auth;
  }

  async getSession(context: {
    request: Request;
  }): Promise<{ user: User; session: Session } | undefined> {
    return await this._instrumentationService.startSpan(
      { name: "AuthenticationService > getSession" },
      async () => {
        const headers = context.request.headers;

        const userSession = await this._betterAuth.api.getSession({
          headers,
        });
        if (!userSession) {
          return undefined;
        }
        const session = sessionSchema.parse(userSession.session);
        const user = userSchema.parse(userSession.user);
        return {
          session,
          user,
        };
      },
    );
  }
}
