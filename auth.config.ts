import type { NextAuthConfig } from 'next-auth'
import Google from 'next-auth/providers/google'

export default {
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_CLIENT_ID,
      clientSecret: process.env.AUTH_GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          hd: 'utc.edu'
        }
      }
    }),
    {
      // http://localhost:3000/api/auth/callback/canvas
      id: 'canvas',
      name: 'Canvas',
      type: 'oauth',
      clientId: process.env.CANVAS_CLIENT_ID,
      clientSecret: process.env.CANVAS_CLIENT_SECRET, 
      authorization: `${process.env.CANVAS_API_URL}/login/oauth2/auth?response_type=code&redirect_uri=${process.env.NEXTAUTH_URL}/api/auth/callback/canvas&scope=url:GET|/api/v1/users/:user_id/profile url:GET|/api/v1/courses url:GET|/api/v1/courses/:course_id/quizzes url:POST|/api/v1/courses/:course_id/quizzes url:GET|/api/v1/courses/:course_id/quizzes/:id url:POST|/api/v1/courses/:course_id/quizzes/:quiz_id/questions`,
      token: `${process.env.CANVAS_API_URL}/login/oauth2/token`,
      userinfo: `${process.env.CANVAS_API_URL}/api/v1/users/self/profile`,
      profile(profile) {
        return {
          id: String(profile.id),
          name: profile.short_name,
          email: profile.primary_email
        }
      }
    }
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (!account || !profile) {
        return false
      } // Enable sign in only for users with accounts and profiles

      // If the provider is Google, check the domain of the email
      if (account.provider === 'google') {
        const email = user.email || profile.email
        if (email && email.endsWith('utc.edu')) {
          return true // Allow sign-in
        } else {
          // Redirect to the main page or a custom error page when access is denied
          throw new Error('Access Denied: Only UTC.edu accounts are allowed.') // You can also set a custom URL here if needed
        }
      }

      return true // Allow sign-in for other providers or if not specified
    },
    async jwt({ token, account, profile }) {
      if (profile) {
        token.id = String(profile.sub) // Ensure ID is a string
        token.image = profile.avatar_url || profile.picture

        // Check to make sure sub is not null, name is not null, and email is not null
        if (profile?.sub && profile?.name && profile?.email) {
          // Create user data in database using action
        }

        if (account?.provider === 'canvas') {
          token.canvas = {
            id: String(profile.id), // Ensure ID is a string
            name: profile.short_name,
            email: profile.primary_email
          }
        }
      }

      return token
    },
    session: ({ session, token }: { session: any; token: any }) => {
      // console.log(token);
      if (session?.user && token?.sub) {
        session.user.id = String(token.sub)
      }

      if (token.canvas) {
        // session.user.canvas = token.canvas as any;
        session.user.canvasId = String(token.canvas.id)
        session.user.canvasName = token.canvas.name
        session.user.canvasEmail = token.canvas.email
      }

      return session
    },
    authorized({ auth }) {
      return !!auth?.user // this ensures there is a logged in user for -every- request
    }
  },
  events: {},
  pages: {
    signIn: '/sign-in',
    error: '/error'
  },
  trustHost: true
} satisfies NextAuthConfig
