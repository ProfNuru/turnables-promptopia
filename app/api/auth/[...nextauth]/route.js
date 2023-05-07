import NextAuth from "next-auth/next";
import GoogleProvider from "next-auth/providers/google";
import { connectionDB } from "@utils/database";
import User from "@models/user";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  async session({ profile }) {
    const sessionUser = await user.findOne({
      email: this.session.user.email,
    });

    this.session.user.id = sessionUser._id.toString();
    return session;
  },
  async signIn({ profile }) {
    try {
      await connectionDB();
      //   Check if user already exists
      const userExists = await User.findOne({
        email: profile.email,
      });

      // If not, create new user and save to DB
      if (!userExists) {
        await User.create({
          email: profile.email,
          username: profile.name.replace(" ", "").toLowerCase(),
          image: profile.picture,
        });
      }

      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  },
});

export { handler as GET, handler as POST };
