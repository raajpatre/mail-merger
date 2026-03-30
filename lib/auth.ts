import { google } from "googleapis";
import type { NextAuthOptions } from "next-auth";
import type { JWT } from "next-auth/jwt";
import GoogleProvider from "next-auth/providers/google";

type RefreshableToken = JWT;

async function refreshGoogleAccessToken(token: RefreshableToken): Promise<JWT> {
  try {
    if (!token.refreshToken) {
      throw new Error("Missing refresh token");
    }

    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET
    );

    oauth2Client.setCredentials({
      refresh_token: token.refreshToken
    });

    const { credentials } = await oauth2Client.refreshAccessToken();

    return {
      ...token,
      accessToken: credentials.access_token ?? token.accessToken,
      accessTokenExpires: credentials.expiry_date ?? Date.now() + 60 * 60 * 1000,
      refreshToken: credentials.refresh_token ?? token.refreshToken
    };
  } catch (error) {
    console.error("Failed to refresh Google access token", error);

    return {
      ...token,
      error: "RefreshAccessTokenError"
    };
  }
}

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt"
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
      authorization: {
        params: {
          scope: [
            "openid",
            "email",
            "profile",
            "https://www.googleapis.com/auth/gmail.send"
          ].join(" "),
          access_type: "offline",
          prompt: "consent"
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, account, profile }): Promise<JWT> {
      if (account) {
        return {
          ...token,
          accessToken: account.access_token,
          accessTokenExpires: account.expires_at ? account.expires_at * 1000 : undefined,
          refreshToken: account.refresh_token ?? token.refreshToken,
          userEmail: profile?.email ?? token.email ?? undefined
        };
      }

      if (
        token.accessToken &&
        token.accessTokenExpires &&
        Date.now() < token.accessTokenExpires - 60_000
      ) {
        return token;
      }

      return refreshGoogleAccessToken(token);
    },
    async session({ session, token }) {
      session.user = {
        ...session.user,
        email: (token.userEmail as string | undefined) ?? session.user?.email
      };
      session.accessToken = token.accessToken as string | undefined;
      session.refreshToken = token.refreshToken as string | undefined;
      session.error = token.error as string | undefined;
      return session;
    }
  }
};
