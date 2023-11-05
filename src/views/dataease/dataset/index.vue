<!--
 * @Author: lengao 841423154@qq.com
 * @Date: 2023-11-02 16:46:48
 * @LastEditors: lengao 841423154@qq.com
 * @LastEditTime: 2023-11-02 17:16:01
 * @FilePath: \MedicProc-Vue\src\views\dataease\dataset\index.vue
 * @Description: 
-->
<template>
  <i-frame :src="url" />
</template>
<script>
import iFrame from "@/components/iFrame/index";
import { toDataEase, outDataEase } from '@/api/dataeaseSSO/index'

export default {
  name: "DataeaseDataset",
  components: { iFrame },
  data() {
    return {
      url: ""
    };
  },
  created() {
    toDataEase().then(res => {
      this.getConfigKey("dataease.dataset.url").then(response => {
        this.url = response.msg;
      });
    })

  },
};
</script>
