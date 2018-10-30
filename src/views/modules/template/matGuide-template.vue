<template>
  <base-template 
  ref="BaseTemplate" 
  templateName="matGuide" 
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
      url: `/template/matGuide`,
      tableHeader: [
        { prop: "matterName", label: "事项名称", sortable: "custom" },
        { prop: "matterCode", label: "事项编码", sortable: "custom" },
        { prop: "orgDept", label: "实施机构", sortable: "custom" },
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
        { prop: "matterName", label: "事项名称" },
        { prop: "matterCode", label: "事项代码" },
        { prop: "matterType", label: "事项类型" },
        { prop: "serviceObject", label: "服务对象" },
        { prop: "setBasis", label: "设定依据" },
        { prop: "exerciseLevel", label: "行使层级" },
        { prop: "powerDivide", label: "权限划分" },
        { prop: "exerciseContent", label: "行使内容" },
        { prop: "powerDivide", label: "权限" },
        { prop: "subjectProperty", label: "实施主体性质" },
        { prop: "admissibility", label: "受理条件" },
        { prop: "onlineDesc", label: "办理流程" },
        { prop: "chargeStandard", label: "收费标准" },
        { prop: "chargeBasis", label: "收费依据" },
        { prop: "itemType", label: "办件类型" },
        { prop: "legalTime", label: "法定办结时限" },
        { prop: "promiseTime", label: "承诺办结时限" },
        { prop: "operateScope", label: "通办范围" },
        { prop: "runSystem", label: "运行系统" },
        { prop: "wdealPlace", label: "办理地点" },
        { prop: "wdealTime", label: "办理时间" },
        { prop: "countLimit", label: "数量限制" },
        { prop: "resultName", label: "结果名称" },
        { prop: "resultSample", label: "结果样本" },
        { prop: "isAgency", label: "是否存在中介服务" },
        { prop: "agencyName", label: "服务机构名称" },
        { prop: "agencyContent", label: "服务内容" },
        { prop: "isCharge", label: "是否收费" },
        { prop: "chargeStandard", label: "收费标准" },
        { prop: "consultTel", label: "咨询电话" },
        { prop: "superviseTel", label: "监督电话" },
        { prop: "isAppoint", label: "预约办理" },
        { prop: "odealLink", label: "网址" },
        { prop: "isOpayment", label: "网上支付" },
        { prop: "opaymentType", label: "支付方式" },
        { prop: "isExpress", label: "物流快递" },
        { prop: "expressType", label: "快递选择" },
        { prop: "problem", label: "常见问题" }
      ]
    };
  },
  components: {
    BaseTemplate
  }
};
</script>