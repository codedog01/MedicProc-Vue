<!--
 * @Author: lengao 841423154@qq.com
 * @Date: 2023-11-08 13:37:54
 * @LastEditors: lengao 841423154@qq.com
 * @LastEditTime: 2023-11-08 17:38:24
 * @FilePath: \MedicProc-Vue\src\components\DynamicParser\index.vue
 * @Description: 
-->

<template>
    <div>
        <!-- {{ formMetadata }} -->
        <!-- <Parser :form-conf="JSON.parse(formMetadata)"></Parser> -->

        <!-- 动态渲染组件 -->
        <div ref="dynamicComponent"></div>
        <component :is="dynamicComponent"></component>
    </div>
</template>

<script>
import Parser from '@/views/form/build/Parser'
// import Parser from 'form-gen-parser'
//表单设计动态组件
import * as API from "@/api/form/dashboard";
import Vue from 'vue/dist/vue.esm.js'

export default {
    name: "DynamicParser",
    components: {
        Parser
    },
    props: ['formMetadata'],
    data() {
        return {
            dynamicComponent: null
        }
    },
    created() {

        this.getListForm()
    },
    methods: {
        compileAndRegisterComponent(componentCode) {
            console.log(123);
            return Vue.extend({ template: componentCode })
        },
        getListForm() {
            API.listForm({
                pageNum: 1,
                pageSize: 1000,
            }).then(res => {
                let list = res.rows
                Vue.prototype.$formMetadata = list;
                list.forEach(element => {
                    const code = element.json
                    this.dynamicComponent = this.compileAndRegisterComponent(code)
                })
            })
        }
    },

};
</script>
