<script lang="ts" setup>
import logo from '@/assets/logo.svg'

defineOptions({ name: 'LoginLeft' })
</script>

<template>
  <div class="w-100% flex justify-center items-center m-t-30px">
    <div
      class="login-son-container h-450px w-400px flex justify-center b-rd-20px"
    >
      <div>
        <div class="flex items-center justify-center m-t-40px">
          <div
            class="logo_circle flex items-center justify-center w-256px h-256px"
          >
            <img :src="logo" alt="logo" class="w-128px h-128px">
          </div>
        </div>
        <h1 class="m-t-50px m-b-20px text-center">
          Welcome!
        </h1>
      </div>
    </div>
  </div>
</template>
