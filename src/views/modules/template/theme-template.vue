<template>
  <base-template ref="BaseTemplate" templateName="themeMatter" :tableHeader="tableHeader" :url="url" :columnData="columnData">
  </base-template>
</template>

<script>
import BaseTemplate from "./base-template";
export default {
  data() {
    return {
      url: "/matterService/matter/info",
      tableHeader: [
        { prop: "name", label: "主题名称", sortable: "custom" },
        { prop: "leadDept", label: "牵头机构", sortable: "custom" },
        { prop: "deptNames", label: "实施机构", sortable: "custom" },
        { prop: "auditedReason", label: "办事结果" },
        {
          prop: "isTemplate",
          label: "是否模板",
          formatData: function(val) {
            return val == "1" ? "是" : "否";
          }
        },
        {
          prop: "oper",
          label: "操作",
          minWidth: "180",
          oper: [
            {
              name: "设为模板",
              buttonIcon: "el-icon-printer",
              clickFun: "setTemplate"
            },
            {
              name: "详情",
              buttonIcon: "el-icon-warning",
              clickFun: "detailHandle"
            },
            {
              name: "下载",
              buttonIcon: "el-icon-download",
              clickFun: "downLoadHandle"
            }
          ]
        }
      ],
      columnData: [
        { prop: "name", label: "主题名称" },
        { prop: "deptNames", label: "实施机构" },
        { prop: "leadDept", label: "牵头部门" },
        { prop: "auditedReason", label: "办事结果" }
      ]
    };
  },
  components: {
    BaseTemplate
  }
};
</script>