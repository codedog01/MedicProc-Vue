<!--
 * @Author: lengao 841423154@qq.com
 * @Date: 2023-11-02 16:46:48
 * @LastEditors: lengao 841423154@qq.com
 * @LastEditTime: 2023-11-02 17:03:42
 * @FilePath: \MedicProc-Vue\src\views\tool\dataease\index.vue
 * @Description: 
-->
<template>
  <i-frame :src="url" />
</template>
<script>
import iFrame from "@/components/iFrame/index";
export default {
  name: "Dataease",
  components: { iFrame },
  data() {
    return {
      url: "http://localhost:9528/#/wizard/index"
    };
  },
};
</script>
