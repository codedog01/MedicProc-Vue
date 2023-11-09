<template>
  <div class="test-form">
    <parser :form-conf="JSON.parse(formConf)" />
  </div>
</template>

<script>
import Parser from '@/components/Form/parser'

// 若parser是通过安装npm方式集成到项目中的，使用此行引入
// import Parser from 'form-gen-parser'

export default {
  components: {
    Parser
  },
  props: ['formConf'],
  data() {
    return {

    }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {

  },
  methods: {


  }
}
</script>

<style lang="scss" scoped>
.test-form {
  margin: 15px auto;
  width: 800px;
  padding: 15px;
}
</style>
