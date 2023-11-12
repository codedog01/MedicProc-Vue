<!--
 * @Author: lengao 841423154@qq.com
 * @Date: 2023-11-07 09:13:06
 * @LastEditors: lengao 841423154@qq.com
 * @LastEditTime: 2023-11-08 12:41:07
 * @FilePath: \MedicProc-Vue\src\views\form\dashboard.vue
 * @Description: 
-->
<template>
  <div class="app-container">
    <div> <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch">
        <el-form-item label="名称" prop="formName">
          <el-input v-model="queryParams.formName" placeholder="请输入表单名称" clearable style="width: 240px"
            @keyup.enter.native="handleQuery" />
        </el-form-item>
        <el-form-item label="创建时间">
          <el-date-picker v-model="dateRange" style="width: 240px" value-format="yyyy-MM-dd" type="daterange"
            range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
          <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>

      <el-row :gutter="10" class="mb8">
        <el-col :span="1.5">
          <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd">新增</el-button>
        </el-col>
        <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
      </el-row>

      <el-table v-loading="loading" :data="formList" row-click="rowClick">
        <!-- <el-table-column type="selection" width="55" align="center" /> -->
        <el-table-column align='center' type="index" label="序号" width="55" />
        <!-- <el-table-column align='center' label="名称" prop="nickName" width="150" /> -->

        <el-table-column align='center' label="所属表单" prop="formName" width="100" />

        <el-table-column align='center' label="函数名称" prop="funcName" width="150" />
        <!-- <el-table-column align='center' label="函数体" prop="funcBody" :show-overflow-tooltip="true" width="250">
          <template slot-scope="scope">
            <el-button size="mini" type="text" icon="el-icon-view" @click="showJson(scope.row)">查看</el-button>
          </template>
        </el-table-column> -->
        <el-table-column align='center' label="函数体" prop="funcBody" :show-overflow-tooltip="true" width="250">
        </el-table-column>

        <el-table-column align='center' label="全局函数" prop="funcBody" :show-overflow-tooltip="true" width="250">
          <template slot-scope="scope">
            <el-switch @change="isGlobalChange(scope.row)" v-model="scope.row.isGlobal" active-color="#13ce66"
              inactive-color="#ff4949" active-value="1" inactive-value="0">
            </el-switch>
          </template>
        </el-table-column>


        <el-table-column align='center' label="备注" prop="remark" :show-overflow-tooltip="true" width="200" />

        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)">编辑</el-button>
            <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
        @pagination="getList" />



      <!-- 新增/编辑 弹窗 -->
      <el-dialog :title="title" :visible.sync="showEdit" width="500px" append-to-body>
        <el-form ref="editForm" :model="form" label-width="80px">


          <el-form-item label="id" prop="id" v-show="false">
            <el-input v-model="form.id" />
          </el-form-item>

          <el-form-item label="所属表单" prop="formId">
            <el-select v-model="form.formId" filterable placeholder="请选择">
              <el-option v-for="item in formOptions" :key="item.id" :label="item.formName" :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="函数名" prop="funcName">
            <el-input v-model="form.funcName" />
          </el-form-item>
          <el-form-item label="函数体" prop="funcBody">
            <el-input v-model="form.funcBody" />
          </el-form-item>

          <el-form-item label="备注" prop="remark">
            <el-input v-model="form.remark" />
          </el-form-item>

        </el-form>

        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="() => { this.showEdit = false }">取 消</el-button>
        </div>
      </el-dialog>

    </div>

  </div>
</template>

<script>
import * as FormFuncAPI from "@/api/form/func";
import * as FormDashBoardAPI from "@/api/form/dashboard";

export default {
  name: "Func",
  components: {
  },
  data() {
    return {
      // 遮罩层
      loading: true,

      // 显示搜索条件
      showSearch: true,
      showEdit: false,
      // 总条数
      total: 0,
      // 角色表格数据
      formList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 日期范围
      dateRange: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        formName: "",
        roleKey: undefined,
        status: undefined
      },
      // 表单参数
      form: {
        id: "",
        isGlobal: "0",
        formId: "",
        funcName: "",
        funcBody: "",
        remark: ""
      },
      currentRow: {},
      //json转对象
      formOptions: [],
      formId: null,
      // 表单校验
      rules: {
        formName: [
          { required: true, message: "角色名称不能为空", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.getList();
  },
  mounted() {
    FormDashBoardAPI.listForm({ pageNum: 1, pageSize: 1000, }).then(res => {
      this.formOptions = res.rows
    })
  },
  methods: {
    rowClick(row, column, event) {
      this.currentRow = row
    },
    isGlobalChange(row) {
      FormFuncAPI.updateForm({ id: row.id, isGlobal: row.isGlobal }).then(res => {
        this.$modal.msgSuccess("修改成功");
      })
    },


    handleUpdate(row) {
      this.showEdit = true
      this.title = "编辑"
      this.form = { ...row }
    },

    /** 查询表单列表 */
    getList() {
      this.loading = true;
      FormFuncAPI.list(this.addDateRange(this.queryParams, this.dateRange)).then(response => {
        this.formList = response.rows;
        this.total = response.total;
        this.loading = false;
      }
      );
    },

    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.dateRange = [];
      this.resetForm("queryForm");
      this.handleQuery();
    },



    /** 新增按钮操作 */
    handleAdd() {
      this.showEdit = true
      this.title = "新增"
      this.$nextTick(() => {
        this.form = {
          id: "",
          isGlobal: "0",
          formId: "",
          funcName: "",
          funcBody: "",
          remark: ""
        }
        // this.$refs['editForm'].resetFields()
      })
    },

    /** 提交按钮 */
    submitForm() {
      this.$refs.editForm.validate(valid => {
        if (valid) {
          if (this.form.id) {
            FormFuncAPI.updateForm(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.showEdit = false;
              this.getList();
            });
          } else {
            FormFuncAPI.addForm(this.form).then(response => {
              this.$modal.msgSuccess("新增成功");
              this.showEdit = false;
              this.getList();
            });
          }
        }
      });
    },

    /** 删除按钮操作 */
    handleDelete(row) {
      this.$modal.confirm('是否删除"' + row.funcName + '"').then(function () {
        return FormFuncAPI.delForm(row.id);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => { });
    },
  }
};
</script>