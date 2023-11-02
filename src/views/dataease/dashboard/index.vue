<!--
 * @Author: lengao 841423154@qq.com
 * @Date: 2023-11-02 16:46:48
 * @LastEditors: lengao 841423154@qq.com
 * @LastEditTime: 2023-11-02 18:06:59
 * @FilePath: \MedicProc-Vue\src\views\dataease\dashboard\index.vue
 * @Description: 
-->
<template>
  <i-frame :src="url" />
</template>
<script>
import iFrame from "@/components/iFrame/index";
export default {
  name: "DataeaseDashboard",
  components: { iFrame },
  data() {
    return {
      url: ""
    };
  },
  created() {
    this.getConfigKey("dataease.dashboard.url").then(response => {
      this.url = response.msg;
    });
  },
};
</script>
