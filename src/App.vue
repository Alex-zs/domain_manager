<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>

export default {
  name: 'App',
  beforeCreate() {
    document.title = 'ITStudio 域名管理'
    this.$http.get("https://itstudio.club/domain/record").then((res) => {
      if (res.data.status === 1) {
        this.$router.push({path: '/records'});
      } else {
        this.$router.push({path: '/login'})
      }
    });
  }
}
</script>

<style>
</style>
