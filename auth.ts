import NextAuth from 'next-auth'
import authConfig from './auth.config'
import { format } from '@auth/kysely-adapter'
import { NeonDialect } from 'kysely-neon'
import { Kysely, SqliteAdapter } from 'kysely'
import type {
  Adapter,
  AdapterAccount,
  AdapterAuthenticator,
} from "@auth/core/adapters"
import { Database } from './lib/db/types'
import {DB} from 'kysely-codegen'
import { nanoid } from 'nanoid'

export const db = new Kysely<DB>({
  dialect: new NeonDialect({
    connectionString: process.env.DATABASE_URL
  })
})

declare module '@auth/core/jwt' {
  interface JWT {
    id: string
  }
}

export function CustomKyselyAdapter(db: Kysely<DB>): Adapter {
  const { adapter } = db.getExecutor();
  const { supportsReturning } = adapter;
  const isSqlite = adapter instanceof SqliteAdapter;
  const to = isSqlite ? format.to : <T>(x: T) => x as T;
  const from = isSqlite ? format.from : <T>(x: T) => x as T;

  return {
    async createUser(data) {
      const user = { ...data, id: crypto.randomUUID() };
      await db.insertInto('User').values(to(user)).executeTakeFirstOrThrow();
      return user;
    },
    async getUser(id) {
      const result = await db
        .selectFrom('User')
        .selectAll()
        .where('id', '=', id)
        .executeTakeFirst();
      if (!result) return null;
      return from(result);
    },
    async getUserByEmail(email) {
      const result = await db
        .selectFrom('User')
        .selectAll()
        .where('email', '=', email)
        .executeTakeFirst();
      if (!result) return null;
      return from(result);
    },
    async getUserByAccount({ providerAccountId, provider }) {
      const result = await db
        .selectFrom('User')
        .innerJoin('Account', 'User.id', 'Account.userId')
        .selectAll('User')
        .where('Account.providerAccountId', '=', providerAccountId)
        .where('Account.provider', '=', provider)
        .executeTakeFirst();
      if (!result) return null;
      return from(result);
    },
    async updateUser({ id, ...user }) {
      const userData = to(user);
      const query = db.updateTable('User').set(userData).where('id', '=', id);
      const result = supportsReturning
        ? query.returningAll().executeTakeFirstOrThrow()
        : query
            .executeTakeFirstOrThrow()
            .then(() =>
              db
                .selectFrom('User')
                .selectAll()
                .where('id', '=', id)
                .executeTakeFirstOrThrow()
            );
      return from(await result);
    },
    async deleteUser(userId) {
      await db
        .deleteFrom('User')
        .where('User.id', '=', userId)
        .executeTakeFirst();
    },
    async linkAccount(data) {
      // manually add generated user id (cuid)
      // don't modify the original data object, create a new one
      const id = nanoid()
      const newData = {
        ...data,
        id
      }

      await db.insertInto('Account').values(to(newData)).executeTakeFirstOrThrow();
      return data;
    },
    async unlinkAccount({ providerAccountId, provider }) {
      await db
        .deleteFrom('Account')
        .where('Account.providerAccountId', '=', providerAccountId)
        .where('Account.provider', '=', provider)
        .executeTakeFirstOrThrow();
    },
    async getSessionAndUser(sessionToken) {
      const result = await db
        .selectFrom('Session')
        .innerJoin('User', 'User.id', 'Session.userId')
        .selectAll('User')
        .select(['Session.expires', 'Session.userId'])
        .where('Session.sessionToken', '=', sessionToken)
        .executeTakeFirst();
      if (!result) return null;
      const { userId, expires, ...user } = result;
      const session = { sessionToken, userId, expires };
      return { user: from(user), session: from(session) };
    },
    async createSession(data) {
      await db.insertInto('Session').values(to(data)).execute();
      return data;
    },
    async updateSession(data) {
      const sessionData = to(data);
      const query = db
        .updateTable('Session')
        .set(sessionData)
        .where('Session.sessionToken', '=', data.sessionToken);
      const result = supportsReturning
        ? await query.returningAll().executeTakeFirstOrThrow()
        : await query.executeTakeFirstOrThrow().then(async () => {
            return await db
              .selectFrom('Session')
              .selectAll()
              .where('Session.sessionToken', '=', sessionData.sessionToken)
              .executeTakeFirstOrThrow();
          });
      return from(result);
    },
    async deleteSession(sessionToken) {
      await db
        .deleteFrom('Session')
        .where('Session.sessionToken', '=', sessionToken)
        .executeTakeFirstOrThrow();
    },
    async createVerificationToken(data) {
      await db.insertInto('VerificationToken').values(to(data)).execute();
      return data;
    },
    async useVerificationToken({ identifier, token }) {
      const query = db
        .deleteFrom('VerificationToken')
        .where('VerificationToken.token', '=', token)
        .where('VerificationToken.identifier', '=', identifier);

      const result = supportsReturning
        ? await query.returningAll().executeTakeFirst()
        : await db
            .selectFrom('VerificationToken')
            .selectAll()
            .where('token', '=', token)
            .executeTakeFirst()
            .then(async (res) => {
              await query.executeTakeFirst();
              return res;
            });
      if (!result) return null;
      return from(result);
    },
    async getAccount(providerAccountId, provider) {
      const result = await db
        .selectFrom('Account')
        .selectAll()
        .where('providerAccountId', '=', providerAccountId)
        .where('provider', '=', provider)
        .executeTakeFirst();

      if (!result) return null;

      return from(result) as unknown as AdapterAccount;
    },
    async createAuthenticator(authenticator) {
      await db.insertInto("Authenticator").values(to(authenticator)).execute();
      return authenticator;
    },
    async getAuthenticator(credentialID) {
      const result = await db
      .selectFrom("Authenticator")
      .selectAll()
      .where('credentialID', '=', credentialID)
      .executeTakeFirst();

      if (!result) return null;

      return from(result) as AdapterAuthenticator;
    },
    async listAuthenticatorsByUserId(userId) {
      const result = await db
        .selectFrom('Authenticator')
        .selectAll()
        .where('userId', '=', userId)
        .execute();

      return result.map(from) as AdapterAuthenticator[];
    },
    async updateAuthenticatorCounter(credentialID: string, counter: number) {
      const result = await db
        .updateTable('Authenticator')
        .set({ counter })
        .where('credentialID', '=', credentialID)
        .returningAll()
        .executeTakeFirstOrThrow();
    
      return result as AdapterAuthenticator;
    }    
  };
}

export const {
  handlers: { GET, POST },
  auth
} = NextAuth({
  adapter: CustomKyselyAdapter(db),
  session: { strategy: 'jwt' },
  debug: true,
  ...authConfig
})
