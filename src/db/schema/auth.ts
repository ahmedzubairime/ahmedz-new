import { pgSchema, uuid, text, timestamp, boolean, jsonb, bigint, varchar, smallint, inet } from 'drizzle-orm/pg-core';

export const authSchema = pgSchema('auth');

export const aalLevelEnum = authSchema.enum('aal_level', ['aal1', 'aal2', 'aal3']);
export const factorTypeEnum = authSchema.enum('factor_type', ['totp', 'webauthn', 'phone']);
export const factorStatusEnum = authSchema.enum('factor_status', ['unverified', 'verified']);

export const users = authSchema.table('users', {
  instance_id: uuid('instance_id'),
  id: uuid('id').primaryKey(),
  aud: varchar('aud', { length: 255 }),
  role: varchar('role', { length: 255 }),
  email: varchar('email', { length: 255 }),
  encrypted_password: varchar('encrypted_password', { length: 255 }),
  email_confirmed_at: timestamp('email_confirmed_at', { withTimezone: true }),
  invited_at: timestamp('invited_at', { withTimezone: true }),
  confirmation_token: varchar('confirmation_token', { length: 255 }),
  confirmation_sent_at: timestamp('confirmation_sent_at', { withTimezone: true }),
  recovery_token: varchar('recovery_token', { length: 255 }),
  recovery_sent_at: timestamp('recovery_sent_at', { withTimezone: true }),
  email_change_token_new: varchar('email_change_token_new', { length: 255 }),
  email_change: varchar('email_change', { length: 255 }),
  email_change_sent_at: timestamp('email_change_sent_at', { withTimezone: true }),
  last_sign_in_at: timestamp('last_sign_in_at', { withTimezone: true }),
  raw_app_meta_data: jsonb('raw_app_meta_data'),
  raw_user_meta_data: jsonb('raw_user_meta_data'),
  is_super_admin: boolean('is_super_admin'),
  created_at: timestamp('created_at', { withTimezone: true }),
  updated_at: timestamp('updated_at', { withTimezone: true }),
  phone: text('phone').unique(),
  phone_confirmed_at: timestamp('phone_confirmed_at', { withTimezone: true }),
  phone_change: text('phone_change').default(''),
  phone_change_token: varchar('phone_change_token', { length: 255 }).default(''),
  phone_change_sent_at: timestamp('phone_change_sent_at', { withTimezone: true }),
  confirmed_at: timestamp('confirmed_at', { withTimezone: true }),
  email_change_token_current: varchar('email_change_token_current', { length: 255 }).default(''),
  email_change_confirm_status: smallint('email_change_confirm_status').default(0),
  banned_until: timestamp('banned_until', { withTimezone: true }),
  reauthentication_token: varchar('reauthentication_token', { length: 255 }).default(''),
  reauthentication_sent_at: timestamp('reauthentication_sent_at', { withTimezone: true }),
  is_sso_user: boolean('is_sso_user').default(false).notNull(),
  deleted_at: timestamp('deleted_at', { withTimezone: true }),
  is_anonymous: boolean('is_anonymous').default(false).notNull(),
});

export const identities = authSchema.table('identities', {
  provider_id: text('provider_id').notNull(),
  user_id: uuid('user_id').notNull().references(() => users.id),
  identity_data: jsonb('identity_data').notNull(),
  provider: text('provider').notNull(),
  last_sign_in_at: timestamp('last_sign_in_at', { withTimezone: true }),
  created_at: timestamp('created_at', { withTimezone: true }),
  updated_at: timestamp('updated_at', { withTimezone: true }),
  email: text('email'),
  id: uuid('id').primaryKey().defaultRandom(),
});

export const sessions = authSchema.table('sessions', {
  id: uuid('id').primaryKey(),
  user_id: uuid('user_id').notNull().references(() => users.id),
  created_at: timestamp('created_at', { withTimezone: true }),
  updated_at: timestamp('updated_at', { withTimezone: true }),
  factor_id: uuid('factor_id'),
  aal: aalLevelEnum('aal'),
  not_after: timestamp('not_after', { withTimezone: true }),
  refreshed_at: timestamp('refreshed_at'),
  user_agent: text('user_agent'),
  ip: inet('ip'),
  tag: text('tag'),
  oauth_client_id: uuid('oauth_client_id'),
  refresh_token_hmac_key: text('refresh_token_hmac_key'),
  refresh_token_counter: bigint('refresh_token_counter', { mode: 'number' }),
  scopes: text('scopes'),
});

export const refreshTokens = authSchema.table('refresh_tokens', {
  instance_id: uuid('instance_id'),
  id: bigint('id', { mode: 'number' }).primaryKey(),
  token: varchar('token', { length: 255 }).unique(),
  user_id: varchar('user_id', { length: 255 }),
  revoked: boolean('revoked'),
  created_at: timestamp('created_at', { withTimezone: true }),
  updated_at: timestamp('updated_at', { withTimezone: true }),
  parent: varchar('parent', { length: 255 }),
  session_id: uuid('session_id').references(() => sessions.id),
});
