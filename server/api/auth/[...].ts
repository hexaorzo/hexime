import { NuxtAuthHandler } from '#auth';
import GithubProvider from 'next-auth/providers/github';
export default NuxtAuthHandler({
  providers: [
    // @ts-expect-error You need to use .default here for it to work during SSR. May be fixed via Vite at some point
    GithubProvider.default({
      clientId: '4888f18f21983daabd44',
      clientSecret: '78fb9cb2a095379dd78e304829b44abd2bfa5f43',
    }),
  ],
});
