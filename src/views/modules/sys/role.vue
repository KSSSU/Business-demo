<template>
  <div class="mod-role">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item>
        <el-input v-model="dataForm.name" placeholder="输入角色名称" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataList()" type="primary" icon="el-icon-search">查询</el-button>
        <el-button v-if="isAuth('sys:role:save')" type="success" icon="el-icon-circle-plus-outline" @click="addOrUpdateHandle()">新增</el-button>
      </el-form-item>
    </el-form>
   <table-components url="/sys/role/list" :pathParams="dataForm" :tableHeader="tableHeader"></table-components>
    <!-- 弹窗, 新增 / 修改 /详情-->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
  </div>
</template>

<script>
import AddOrUpdate from "./role-add-or-update";
import TableComponents from "@/views/common/tableComponent";
export default {
  data() {
    return {
      dataForm: {
        name: ""
      },
      tableHeader: [
        { prop: "name", label: "角色名称" },
        { prop: "remarks", label: "说明" },
        {
          prop: "oper",
          label: "操作",
          oper: [
            { name: "详情", buttonIcon: "el-icon-warning", clickFun: "detail" },
            { name: "编辑", buttonIcon: "el-icon-edit", clickFun: "update" },
            { name: "删除", buttonIcon: "el-icon-delete", clickFun: "delete" }
          ]
        }
      ],
      dataListSelections: [],
      addOrUpdateVisible: false
    };
  },
  components: {
    AddOrUpdate,
    TableComponents
  },
  methods: {
    // 多选
    selectionChangeHandle(val) {
      this.dataListSelections = val;
    },
    // 新增 / 修改
    addOrUpdateHandle(id) {
      this.addOrUpdateVisible = true;
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(id);
      });
    },
    // 删除
    deleteHandle(id) {
      var ids = id
        ? [id]
        : this.dataListSelections.map(item => {
            return item.roleId;
          });
      this.$confirm(`确定对进行[${id ? "删除" : "批量删除"}]操作?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$http({
            url: this.$http.adornUrl("/sys/role/delete"),
            method: "post",
            data: this.$http.adornData(ids, false)
          }).then(({ data }) => {
            if (data && data.code === 0) {
              this.$message({
                message: "操作成功",
                type: "success",
                duration: 1500,
                onClose: () => {
                  this.getDataList();
                }
              });
            } else {
              this.$message.error(data.msg);
            }
          });
        })
        .catch(() => {});
    }
  }
};
</script>
