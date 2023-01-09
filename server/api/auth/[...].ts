import { NuxtAuthHandler } from '#auth';
import GithubProvider from 'next-auth/providers/github';
import DiscordProvider from "next-auth/providers/discord";
export default NuxtAuthHandler({
  secret: 'hehehehehe',
  providers: [
    DiscordProvider.default({
      clientId: '944635371881373727',
      clientSecret: 'Re87B9xtYmPSvbldWLBbRFPea-jJOlIP'
    }),
    GithubProvider.default({
      clientId: '4888f18f21983daabd44',
      clientSecret: '78fb9cb2a095379dd78e304829b44abd2bfa5f43',
    })
  ],
});
