<template>
  <div class="drawer">
    <input id="my-drawer-3" type="checkbox" class="drawer-toggle" />
    <div class="drawer-content flex flex-col">
      <div class="relative">
        <div class="sticky top-0 left-0 right-0">
          <div class="w-full navbar bg-base-300">
            <div class="flex-none">
              <label for="my-drawer-3" class="btn btn-square btn-ghost">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  class="inline-block w-5 h-5 stroke-current"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  ></path>
                </svg>
              </label>
            </div>
            <div class="flex-1">
              <a class="btn btn-ghost normal-case text-xl" href="/">Hexime</a>
            </div>
            <div class="flex-none">
              <button class="btn btn-ghost btn-circle">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </button>
              <label for="my-drawer-3" class="btn btn-ghost btn-circle avatar">
                <div class="w-10 rounded-full">
                  <img
                    v-if="status === 'authenticated'" :src="data?.user?.image"
                  />
                  <img v-else src="https://img.icons8.com/fluency/96/null/name.png" />
                </div>
              </label>
            </div>
          </div>
        </div>
      </div>
      <slot></slot>
    </div>

    <div class="drawer-side">
      <label for="my-drawer-3" class="drawer-overlay"></label>
      <ul class="menu p-4 w-80 bg-base-100">
        <div v-if="status === 'authenticated'">
          <li>
            <a href="/profile">Profile</a>
          </li>
          <li @click="signOut({ callbackUrl: '/' })">
            <a>Logout</a>
          </li>
        </div>
        <li v-else @click="signIn()"><a>Login</a></li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
const { status, data, signIn, signOut } = useSession();
</script>
