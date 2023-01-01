<template>
  <v-navigation-drawer v-model="drawer">
    <UserCard />
    <v-divider></v-divider>
    <v-list density="compact" nav>
      <v-list-item
        prepend-icon="mdi-home-city"
        title="Home"
        value="home"
      ></v-list-item>
      <v-list-item
        v-if="status === 'authenticated'"
        prepend-icon="mdi-account"
        title="My Account"
        value="account"
      ></v-list-item>
      <v-list-item
        v-if="status === 'authenticated'"
        prepend-icon="mdi-logout"
        title="Logout"
        @click="signOut({ callbackUrl: '/' })"
      ></v-list-item>
      <v-list-item
        v-else
        prepend-icon="mdi-login"
        title="Login"
        @click="signIn()"
      ></v-list-item>
    </v-list>
  </v-navigation-drawer>
  <v-app-bar>
    <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
    <v-spacer></v-spacer>
    <v-btn variant="text" icon="mdi-magnify"></v-btn>

  </v-app-bar>
</template>

<script setup lang="ts">
const {status, signIn, signOut} = useSession();
</script>
<script lang="ts">
export default {
  data: () => ({ drawer: null }),
};
</script>

