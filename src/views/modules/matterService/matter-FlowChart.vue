<template>
  <el-dialog title="流程表" :visible.sync="flowChartVisible" append-to-body center>
       <el-table border :data="itemSortList" >
            <el-table-column align="center" v-for="item in itemSortList" :key="item.id" prop="item.itemSortList" label="优先级"></el-table-column>
       </el-table> 
      <span slot="footer" class="dialog-footer">
      <el-button @click="flowChartVisible = false">关闭</el-button>
    </span>
  </el-dialog>    
</template>

<script>
export default {
  data() {
    return {
      flowChartVisible: false,
      itemSortList: []
    };
  },
  methods: {
    init(itemSortList) {
      this.flowChartVisible = true;
      this.itemSortList = itemSortList;
    }
  }
};
</script>