import type { NextAuthConfig } from "next-auth";
export const authConfig = {
  pages: {
    signIn: "/sign-in",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboardpage = nextUrl.pathname.startsWith("/dashboard");
      const isOnSurveyPage = nextUrl.pathname.startsWith("/survey");
      if (isOnDashboardpage || isOnSurveyPage) {
        if (isLoggedIn) return true;
        return false;
      } else if (isLoggedIn) {
        return Response.redirect(new URL("/dashboard", nextUrl));
      }
    },
  },
  providers: [],
} satisfies NextAuthConfig;
