<template>
 <el-dialog width="60%" :title="choice?'选择事项':'事项顺序'" :visible.sync="visible" append-to-body>
            <el-form :inline="true" v-model="dataForm" @keyup.enter.native="getDataList(choice)" v-if="choice">
              <el-form-item prop="name">
                  <el-input v-model="dataForm.matterName" placeholder="请输入查找事项的关键字"></el-input>

              </el-form-item>

              <el-form-item>
                   <el-button type="primary" icon="el-icon-search" @click="getDataList(choice)">搜索</el-button>
                   <el-button type="success" icon="el-icon-circle-plus-outline" :disabled="dataListSelections.length<=0" @click="insertHandle()">批量添加</el-button>
              </el-form-item>

         </el-form>

        <div>
           <h4>已选择的事项:</h4>
           <div v-if="choice">
            <span  class="cl_span v2_span"  v-for="(opt,index) in optData" :key="opt.id">{{opt.matterName}}<i class="el-icon-circle-close-outline" @click="optData.splice(index, 1);"></i></span> 
           </div>
             <div v-else > 
             <span  class="cl_span v2_span"  v-for="opt in optData" :key="opt.id">{{opt.matterName}}</span>
            <template>
                <el-form>
                      <el-form-item label="事项顺序:" >
                           <el-checkbox v-model="checked">存在事项顺序</el-checkbox>
                      </el-form-item>
                </el-form> 
            </template> 
             </div>    

              <el-table border v-loading="dataListLoading" :data="itemList"  style="width: 100%;"  @selection-change="selectionChangeHandle">
                <el-table-column type="selection"  v-if="choice"></el-table-column>
                <el-table-column label="事项名称" prop="matterName"> </el-table-column>
                <el-table-column label="事项编码" prop="matterCode" > </el-table-column>
                <el-table-column label="实施机构" prop="orgDept" > </el-table-column>
                <el-table-column label="事项类别" prop="typeFirst" > </el-table-column>
                <el-table-column label="操作"  align="center" v-if="choice">
                <template slot-scope="scope" >
                    <el-button icon="el-icon-circle-plus" @click="insertHandle(scope.row)">添加</el-button>   
                 </template>
                </el-table-column >

               <el-table-column label="顺序"  align="center" prop="relate" v-else > 
                 <template slot-scope="scope" >
                  <el-input-number  size="mini" v-model="scope.row.relate" controls-position="right" :min="0" ></el-input-number>
                 </template>
                </el-table-column>
            </el-table>

             <el-pagination v-if="choice"
             @size-change="handleSizeChange"
             @current-change="handleCurrentChange"
             :current-page="pageIndex"
             :page-sizes="[10, 25, 50, 100]"
             :page-size="pageSize"
             layout="total, sizes, prev, pager, next, jumper"
             :total="totalPage">
            </el-pagination> 
         </div>

    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="dataFormSubmit()">保存</el-button>
      <el-button @click="visible = false">关闭</el-button>
    </span>
 </el-dialog>
</template>


<script>
export default {
  data() {
    return {
      choice: "",
      checked: true,
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      itemList: [],
      dataListSelections: [],
      optData: [], //已选择事项
      visible: false,
      dataListLoading: false,
      dataForm: {
        matterName: ""
      }
    };
  },
  methods: {
    //获取数据
    getDataList(choice, dataList) {
      this.dataForm.matterName = "";
      this.dataListLoading = true;
      this.visible = true;
      this.choice = choice;
      this.optData = dataList; //已选择事项
      if (this.choice == "add") {
        this.$http({
          url: this.$http.adornUrl("/template/matGuide"),
          method: "get",
          params: this.$http.adornParams({
            curryPage: this.pageIndex,
            pageSize: this.pageSize,
            matterName: this.dataForm.matterName
          })
        }).then(({ data }) => {
          if (data && data.code === 0) {
            this.itemList = data.page.list;
            this.totalPage = data.page.totalCount;
          } else {
            this.itemList = [];
            this.totalPage = 0;
          }
        });
      } else {
        this.itemList = dataList;
      }
      this.dataListLoading = false;
    },
    //每页显示数量改变时触发
    handleSizeChange(val) {
      this.pageSize = val;
      this.pageIndex = 1;
      this.getDataList();
    },
    //每页码发生改变时触发
    handleCurrentChange(val) {
      this.pageIndex = val;
      this.getDataList();
    },
    //点击选择框时触发
    selectionChangeHandle(val) {
      this.dataListSelections = val;
    },

    //批量添加/添加
    insertHandle(row) {
      var itemIds = row
        ? [row]
        : this.dataListSelections.map(item => {
            return item;
          });
      this.$confirm(`确定进行${row ? "添加" : "批量添加"}吗？`, `提示`, {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "info"
      }).then(() => {
        this.optData = this.optData.concat(itemIds);
      });
    },
    //保存
    dataFormSubmit() {
      if (this.choice == "add") {
        if (this.optData.length == 0) {
          this.$message("请添加事项");
          return;
        }
      }
      this.$emit("showData", this.optData);
      this.visible = false;
    }
  }
};
</script>

<style lang="scss">
.cl_span {
  cursor: pointer;
  background-color: rgba(64, 158, 255, 0.1);
  padding: 0 10px;
  height: 32px;
  line-height: 30px;
  font-size: 12px;
  color: #409eff;
  border-radius: 4px;
  box-sizing: border-box;
  border: 1px solid rgba(64, 158, 255, 0.2);
  white-space: nowrap;
  display: inline-block;
  max-width: 150px;
  text-overflow: ellipsis;
  overflow: hidden;
  margin-left: 5px;
}
</style>
