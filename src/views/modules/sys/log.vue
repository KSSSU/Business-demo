<template>
  <div class="mod-log">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item>
        <el-input v-model="dataForm.name" placeholder="输入日志标题" clearable></el-input>
      </el-form-item>
      <el-form-item>
      <el-button @click="fetchDataList()" icon="el-icon-search" type="primary">搜索</el-button>
      </el-form-item>
    </el-form>
   <!-- table表格 -->
     <table-component ref="tableComponent" 
     url="/sys/log/list" :pathParams="dataForm"
      :tableHeader="tableHeader"
      @buttonEven="buttonEven"></table-component>
    <!-- 弹窗, 详情 -->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="fetchDataList"></add-or-update>
  </div>
</template>

<script>
import AddOrUpdate from "./log-add-or-update";
import TableComponent from "@/views/common/tableComponent";
export default {
  data() {
    return {
      tableHeader: [
        { prop: "name", label: "日志标题" },
        { prop: "operation", label: "操作用户" },
        { prop: "createDate", label: "操作时间" },
        { prop: "ip", label: "操作Ip" },
        { prop: "url", label: "URL" },
        { prop: "method", label: "提交方式" },
        {
          prop: "oper",
          label: "操作",
          oper: [
            { name: "详情", buttonIcon: "el-icon-warning", clickFun: "detail" }
          ]
        }
      ],
      dataForm: {
        name: ""
      },
      dataListSelections: [],
      addOrUpdateVisible: false
    };
  },
  components: {
    AddOrUpdate,
    TableComponent
  },
  methods: {
    //查询
    fetchDataList() {
      this.$nextTick(() => {
        this.$refs["tableComponent"].getDataList();
      });
    },
    //按钮事件
    buttonEven(even, row) {
      if (even == "detail") {
        //详情
        this.addOrUpdateHandle(row.id, true);
      }
    },
    // 详情
    addOrUpdateHandle(id, isReadOnly) {
      this.addOrUpdateVisible = true;
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(id, isReadOnly);
      });
    }
  }
};
</script>
