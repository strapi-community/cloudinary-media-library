export default ({ env }) => ({
  auth: {
    secret: env('ADMIN_JWT_SECRET', 'secret'),
  },
  apiToken: {
    salt: env('API_TOKEN_SALT', 'Z[Ijz~;2@#]}_5aVK2hSXMHmj~~20?/o@L9JCa T`9_BL1Q?WoIZNhb|q/nDZ3T0'),
  },
  transfer: {
    token: {
      salt: env('TRANSFER_TOKEN_SALT'),
    },
  },
  flags: {
    nps: env.bool('FLAG_NPS', true),
    promoteEE: env.bool('FLAG_PROMOTE_EE', true),
  },
});
