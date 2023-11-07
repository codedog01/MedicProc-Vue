<!--
 * @Author: lengao 841423154@qq.com
 * @Date: 2023-11-07 09:13:06
 * @LastEditors: lengao 841423154@qq.com
 * @LastEditTime: 2023-11-07 15:13:48
 * @FilePath: \MedicProc-Vue\src\views\form\dashboard.vue
 * @Description: 
-->
<template>
  <div class="app-container">
    <div v-show="!showFormBuilder"> <el-form :model="queryParams" ref="queryForm" size="small" :inline="true"
        v-show="showSearch">
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

      <el-table v-loading="loading" :data="formList">
        <!-- <el-table-column type="selection" width="55" align="center" /> -->
        <el-table-column align='center' type="index" label="序号" width="55" />
        <el-table-column align='center' label="名称" prop="formName" width="200" />
        <el-table-column align='center' label="路由地址" prop="routeUrl" width="250" />

        <el-table-column align='center' label="元数据" prop="json" :show-overflow-tooltip="true" width="100">
          <template slot-scope="scope">
            <el-button size="mini" type="text" icon="el-icon-view" @click="showJson(scope.row)">查看</el-button>
          </template> </el-table-column>
        <el-table-column align='center' label="备注" prop="remark" :show-overflow-tooltip="true" width="300" />
        <!-- <el-table-column label="创建时间" align="center" prop="createTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column> -->
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)">编辑</el-button>
            <el-button size="mini" type="text" icon="el-icon-edit" @click="handleBuild(scope.row)">设计</el-button>
            <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
        @pagination="getList" />



      <!-- JOSON展示组件 -->
      <json-drawer size="60%" :visible.sync="jsonDrawerVisible" :json-str="JSON.stringify(formData)"
        @refresh="() => { }" />

      <!-- 新增/编辑 弹窗 -->
      <el-dialog :title="title" :visible.sync="showEdit" width="500px" append-to-body>
        <el-form ref="editForm" :model="form" label-width="80px">
          <el-form-item label="名称">
            <el-input v-model="form.formName" />
          </el-form-item>
          <el-form-item label="路由地址">
            <el-input v-model="form.routeUrl" />
          </el-form-item>
          <el-form-item label="实体">
            <el-select v-model="form.domain">
              <el-option v-for="(value, key) in dbTableList" :key="key" :label="key" :value="value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="备注">
            <el-input v-model="form.remark" />
          </el-form-item>

        </el-form>

        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="() => { }">取 消</el-button>
        </div>
      </el-dialog>

    </div>
    <form-builder ref="formBuilderRef" v-show="showFormBuilder" :formId="formId"></form-builder>

  </div>
</template>

<script>
import * as FormDashboardAPI from "@/api/form/dashboard";
import * as FormTemplateAPI from "@/api/form/template";
import JsonDrawer from './build/JsonDrawer'
import FormBuilder from './build/index'

export default {
  name: "Role",
  dicts: ['sys_normal_disable'],
  components: {
    JsonDrawer,
    FormBuilder
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
      showFormBuilder: false,
      jsonDrawerVisible: false,
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
        formName: "",
        domain: "",
        routeUrl: "",
        remark: ""
      },

      //json转对象
      formData: null,
      formId:null,
      dbTableList: null,
      // 表单校验
      rules: {
        formName: [
          { required: true, message: "角色名称不能为空", trigger: "blur" }
        ],
        roleKey: [
          { required: true, message: "权限字符不能为空", trigger: "blur" }
        ],
        roleSort: [
          { required: true, message: "角色顺序不能为空", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.getList();
  },
  mounted() {
    this.getDbTableList()

  },
  methods: {
    getDbTableList() {
      FormTemplateAPI.dbTableList().then(res => {
        this.dbTableList = res.data
      })
    },
    handleUpdate(row) {
      this.showEdit = true
      this.title = "编辑"
      this.form = { ...row }
      // this.resetForm("form");
    },
    // 查看JSON文件
    showJson(row) {
      console.log("rowrow", row);
      this.formData = JSON.parse(row.json),
        this.jsonDrawerVisible = true
    },
    /** 查询表单列表 */
    getList() {
      this.loading = true;
      FormDashboardAPI.listForm(this.addDateRange(this.queryParams, this.dateRange)).then(response => {
        this.formList = response.rows;
        this.total = response.total;
        this.loading = false;
      }
      );
    },
    /** 查询菜单树结构 */
    getMenuTreeselect() {
      menuTreeselect().then(response => {
        this.menuOptions = response.data;
      });
    },
    // 所有菜单节点数据
    getMenuAllCheckedKeys() {
      // 目前被选中的菜单节点
      let checkedKeys = this.$refs.menu.getCheckedKeys();
      // 半选中的菜单节点
      let halfCheckedKeys = this.$refs.menu.getHalfCheckedKeys();
      checkedKeys.unshift.apply(checkedKeys, halfCheckedKeys);
      return checkedKeys;
    },
    // 所有部门节点数据
    getDeptAllCheckedKeys() {
      // 目前被选中的部门节点
      let checkedKeys = this.$refs.dept.getCheckedKeys();
      // 半选中的部门节点
      let halfCheckedKeys = this.$refs.dept.getHalfCheckedKeys();
      checkedKeys.unshift.apply(checkedKeys, halfCheckedKeys);
      return checkedKeys;
    },
    /** 根据角色ID查询菜单树结构 */
    getRoleMenuTreeselect(roleId) {
      return roleMenuTreeselect(roleId).then(response => {
        this.menuOptions = response.menus;
        return response;
      });
    },
    /** 根据角色ID查询部门树结构 */
    getDeptTree(roleId) {
      return deptTreeSelect(roleId).then(response => {
        this.deptOptions = response.depts;
        return response;
      });
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


    // 树权限（展开/折叠）
    handleCheckedTreeExpand(value, type) {
      if (type == 'menu') {
        let treeList = this.menuOptions;
        for (let i = 0; i < treeList.length; i++) {
          this.$refs.menu.store.nodesMap[treeList[i].id].expanded = value;
        }
      } else if (type == 'dept') {
        let treeList = this.deptOptions;
        for (let i = 0; i < treeList.length; i++) {
          this.$refs.dept.store.nodesMap[treeList[i].id].expanded = value;
        }
      }
    },

    /** 新增按钮操作 */
    handleAdd() {
      this.showEdit = true
      // this.resetForm("editForm")
      console.log(this.$refs.editForm);
      this.$refs.editForm.resetFields()
      this.title = "新增"
    },
    /** 设计按钮操作 */
    handleBuild(row) {
      this.formId = row.id
      this.showFormBuilder = true
    },


    /** 提交按钮 */
    submitForm() {
      this.$refs.editForm.validate(valid => {
        if (valid) {
          if (this.form.id) {
            FormDashboardAPI.updateForm(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.showEdit = false;
              this.getList();
            });
          } else {
            FormDashboardAPI.addForm(this.form).then(response => {
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
      this.$modal.confirm('是否删除"' + row.formName + '"').then(function () {
        return FormDashboardAPI.delForm(row.id);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => { });
    },
  }
};
</script>