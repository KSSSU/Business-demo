<template>

  <el-dialog title="excel导出数据" :visible.sync="dialogVisible" center>

  <h3 style="color:red">请先勾选所需数据数据！如导出数据量大，上传请耐心等待！</h3>
 

    <el-checkbox  
    style="margin-left:15px;margin-bottom:15px"
     v-for="column in columnData" 

     :key="column.prop">
     {{column.label}}
     </el-checkbox>
     

     <span slot="footer" class="dialog-footer">
      <el-button type="primary">确定导出</el-button>
    </span>


  </el-dialog>
      
</template>

<script>
export default {
  data() {
    return {
      checked: true,
      dialogVisible: false,
      columnData: []
    };
  },
  activated() {
    this.init(columnData);
  },
  methods: {
    init(columnData) {
      this.dialogVisible = true;
      this.columnData = columnData;
    }
  }
};
</script>