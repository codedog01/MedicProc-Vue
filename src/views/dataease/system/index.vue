<!--
 * @Author: lengao 841423154@qq.com
 * @Date: 2023-11-02 16:46:48
 * @LastEditors: lengao 841423154@qq.com
 * @LastEditTime: 2023-11-06 09:56:20
 * @FilePath: \MedicProc-Vue\src\views\dataease\system\index.vue
 * @Description: 
-->
<template>
  <i-frame :src="url" />
</template>
<script>
import iFrame from "@/components/iFrame/index";
import { toDataEase, outDataEase } from '@/api/dataease/index'
export default {
  name: "DataeaseSystem",
  components: { iFrame },
  data() {
    return {
      url: ""
    };
  },
  created() {
    toDataEase().then(res => {
      this.getConfigKey("dataease.system.url").then(response => {
        this.url = response.msg;
      });
    })

  },
};
</script>
