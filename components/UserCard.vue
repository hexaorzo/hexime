<script setup lang="ts">
const { status, data, signIn } = useSession();
</script>

<template v-slot:prepend>
  <div>
    <v-list>
      <v-list-item
        v-if="status === 'authenticated'"
        lines="two"
        title="Welcome !"
        subtitle="Logged in as"
      > {{data?.user?.name}}
      </v-list-item>
      <v-list-item
        v-else
        lines="two"
        title="Tap To Login"
        @click="signIn()"
      ></v-list-item>
    </v-list>
  </div>
</template>
