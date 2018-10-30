<template>
  <base-template 
  ref="BaseTemplate" 
  templateName="matMatter" 
  :tableHeader="tableHeader" 
  :url="url"
  :columnData="columnData"
  >
  </base-template>
</template>

<script>
import BaseTemplate from "./base-template";
export default {
  data() {
    return {
      url: `/template/matMatter`,
      tableHeader: [
        { prop: "name", label: "事项名称", sortable: "custom" },
        { prop: "encrypt", label: "事项编码", sortable: "custom" },
        { prop: "deptName", label: "实施机构", sortable: "custom" },
        { prop: "typeFirst", label: "事项类别", sortable: "custom" },
        {
          prop: "oper",
          label: "操作",
          minWidth: "150",
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
        { prop: "dept_id", label: "实施机构" },
        { prop: "typeFirst", label: "事项类型（一级）" },
        { prop: "typeSecond", label: "事项类型（二级）" },
        { prop: "deptName", label: "事项名称" },
        { prop: "typeFirst", label: "事项基本编码" },
        { prop: "name", label: "主项名称" },
        { prop: "code", label: "主项代码" },
        { prop: "name", label: "子项名称" },
        { prop: "code", label: "子项代码" },
        { prop: "name", label: "办理项名称" },
        { prop: "code", label: "办理项代码" },
        { prop: "deptName", label: "系统数量" },
        { prop: "typeFirst", label: "系统分类" },
        { prop: "name", label: "系统名称" },
        { prop: "encrypt", label: "系统层级" },
        { prop: "deptName", label: "系统自建类型" }
      ]
    };
  },
  components: {
    BaseTemplate
  }
};
</script>