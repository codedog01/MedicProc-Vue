<!--
 * @Author: lengao 841423154@qq.com
 * @Date: 2023-11-01 15:11:26
 * @LastEditors: lengao 841423154@qq.com
 * @LastEditTime: 2023-11-09 11:13:31
 * @FilePath: \MedicProc-Vue\src\App.vue
 * @Description: 
-->
<template>
  <div id="app">
    <router-view />
    <theme-picker />
  </div>
</template>

<script>
import ThemePicker from "@/components/ThemePicker";

export default {
  name: "App",
  components: { ThemePicker },
  metaInfo() {
    return {
      title: this.$store.state.settings.dynamicTitle && this.$store.state.settings.title,
      titleTemplate: title => {
        return title ? `${title} - ${process.env.VUE_APP_TITLE}` : process.env.VUE_APP_TITLE
      }
    }
  },
};
</script>
<style scoped>
#app .theme-picker {
  display: none;
}
</style>
