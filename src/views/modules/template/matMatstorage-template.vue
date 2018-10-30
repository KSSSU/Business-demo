<template>
  <base-template 
  ref="BaseTemplate" 
  templateName="matMatstorage" 
  :tableHeader="tableHeader" 
  :url="url"
  >
  </base-template>
</template>

<script>
import BaseTemplate from "./base-template";
export default {
  data() {
    return {
      dataListSelections: [],
      url: `/template/matMatstorage`,
      tableHeader: [
        { prop: "code", label: "材料标识号", sortable: "custom" },
        { prop: "name", label: "材料名称", sortable: "custom" },
        { prop: "form", label: "材料来源", sortable: "custom" },
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
              name: "预览",
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
      ]
    };
  },
  components: {
    BaseTemplate
  }
};
</script>


