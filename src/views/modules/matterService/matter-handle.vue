<template>

<el-dialog width="60%"  :title="!dataForm.id?'新增主题事项':handle?'主题事项详情':'编辑主题事项'" :visible.sync="visible" append-to-body center>

    <el-form ref="dataForm" label-width="90px" :model="dataForm" :rules="dataRule">

         <el-form-item label="主题名称:" prop="name">
              <el-input placeholder="请输入主题事项名称" v-model="dataForm.name" style="width: 60%" :readonly="handle"></el-input>          
         </el-form-item>
    
         <el-form-item label="实施机构:" prop="deptNames">
              <el-input placeholder="根据已选事项自动生成" v-model="dataForm.deptNames" style="width: 60%" readonly ></el-input>          
              <span>(显示已选择事项的所有事实机构信息)</span>
         </el-form-item>

           <el-form-item label="牵头部门:" prop="leadDept">
             <el-select  placeholder="=请选择="  style="width: 60%" v-model="dataForm.leadDept" :disabled="handle">
                     <el-option
                         v-for="item in departList"
                         :key="item.id"
                         :label="item.name"
                         :value="item.id">
                     </el-option>
                    </el-select>         
         </el-form-item>

          <el-form-item label="已选择事项:" v-if="handle" ></el-form-item> 
         
          <el-form-item label="选择事项:" v-else>
            <el-button type="primary" @click="addItemHandle('add')">添加事项</el-button>
          </el-form-item>

          <el-table border :data="this.dataForm.childrenDate" v-loading="dataListLoading">       
            <el-table-column label="事项名称" prop="matterName"> </el-table-column>
            <el-table-column label="事项编码" prop="matterCode"> </el-table-column>
            <el-table-column label="实施机构" prop="orgDept"> </el-table-column>
            <el-table-column label="事项类别" prop="typeFirst"> </el-table-column>
            <el-table-column label="操作" > 
              <template slot-scope="scope">
                <el-button  type="text" icon="el-icon-warning" @click="insertHandle(scope.row)"></el-button>
                <el-button type="text" icon="el-icon-delete" @click="deleteRowHandle(scope.index)" v-if="!handle"></el-button>
              </template>
            </el-table-column>
          </el-table> 

          <el-form-item label="确定关系:" style="margin:20px 0px">
              <el-button type="info" @click="addItemHandle()" :disabled="dataForm.childrenDate.length<=0" v-if="!handle">事项关系</el-button>
              <el-button type="primary" @click="uploadFile" v-if="!handle">上传流程图</el-button>
              <div class="uploadFile">
                <span  style="color:blue;margin-right:8px;" pro v-for="(file,index) in dataForm.fileList" :key="file.uid">{{file.name}};<i class="el-icon-delete" @click="dataForm.fileList.splice(index, 1);" v-if="!handle"></i></span> 
              </div>
          </el-form-item>

          <el-table border :data="this.dataForm.childrenDate" v-loading="dataListLoading" >
            <el-table-column label="事项名称" prop="matterName" > </el-table-column>
            <el-table-column label="事项编码" prop="matterCode" > </el-table-column>
            <el-table-column label="实施机构" prop="orgDept" > </el-table-column>
            <el-table-column label="事项类别" prop="typeFirst" > </el-table-column>
            <el-table-column label="顺序" prop="relate" > </el-table-column>
          </el-table> 
    </el-form>

    
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="dataFormSubmit()" v-if="!handle">保存</el-button>
      <el-button @click="visible = false">关闭</el-button>
    </span>


  <add-item v-if="addItemVisible" ref="addItem"  @showData="initItemList"></add-item>  
  <upload-file v-if="uploadFileVisible" ref="uploadFile" @showFile="showFileList"></upload-file>
</el-dialog>

</template>




<script>
import AddItem from "./matter-insert";
import UploadFile from "./matter-uploadFile";
export default {
  data() {
    return {
      visible: false,
      addItemVisible: false,
      uploadFileVisible: false,
      dataListLoading: false,
      handle: "",
      departList: [], //部门列表
      companySelectValue: "",
      dataForm: {
        id: "",
        name: "",
        leadDept: "",
        deptNames: "",
        childrenDate: [],
        fileList: []
      },
      dataRule: {
        name: [{ required: true, message: "必填", trigger: "blur" }],
        leadDept: [{ required: true, message: "必填", trigger: "blur" }]
      }
    };
  },
  components: {
    AddItem,
    UploadFile
  },
  methods: {
    //加载
    init(id, handle) {
      this.dataForm.id = id || 0;
      this.handle = handle;

      this.$http({
        url: this.$http.adornUrl("/sys/depart"),
        method: "get",
        params: this.$http.adornParams()
      })
        .then(({ data }) => {
          this.departList = data && data.code === 0 ? data.page.list : [];
        })
        .then(() => {
          this.visible = true;
          this.$nextTick(() => {
            this.$refs["dataForm"].resetFields();
            this.dataForm.childrenDate = [];
            this.dataForm.fileList = [];
          });
        })
        .then(() => {
          if (this.dataForm.id) {
            this.$http({
              url: this.$http.adornUrl(
                `/matterService/matter/info/${this.dataForm.id}`
              ),
              method: "post",
              params: this.$http.adornParams()
            }).then(({ data }) => {
              if (data && data.code === 0) {
                this.dataListLoading = true;
                this.dataForm.id = data.item.id;
                this.dataForm.name = data.item.name;
                this.dataForm.leadDept = data.item.leadDept;
                this.dataForm.deptNames = data.item.deptNames;
                this.dataForm.childrenDate = data.item.childrenData;
                this.dataForm.fileList = data.item.fileList;
                this.dataListLoading = false;
              }
            });
          }
        });
    },

    //添加事项
    addItemHandle(choice) {
      this.addItemVisible = true;
      this.$nextTick(() => {
        this.$refs.addItem.getDataList(choice, this.dataForm.childrenDate);
      });
    },

    //显示已添加的事项
    initItemList(data) {
      this.dataListLoading = true;
      this.dataForm.childrenDate = data;
      this.dataForm.deptNames = "";
      for (let i = 0; i < data.length; i++) {
        this.dataForm.deptNames += data[i].matterName + ",";
      }
      this.dataForm.deptNames = this.dataForm.deptNames.substring(
        0,
        this.dataForm.deptNames.length - 1
      );
      this.dataListLoading = false;
    },
    //删除已存在的事项
    deleteRowHandle(index) {
      this.$confirm("确定进行删除吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.dataForm.childrenDate.splice(index, 1);
        this.initItemList(this.dataForm.childrenDate);
      });
    },
    //上传文件
    uploadFile() {
      this.uploadFileVisible = true;
      this.$nextTick(() => {
        this.$refs.uploadFile.init(this.dataForm.fileList);
      });
    },
    //显示已上传的文件
    showFileList(fileList) {
      this.dataForm.fileList = fileList;
    },
    //提交
    dataFormSubmit() {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          this.$http({
            url: this.$http.adornUrl(
              `/matterService/matter/${!this.dataForm.id ? "save" : "update"}`
            ),
            method: "post",
            data: this.$http.adornData({
              id: this.dataForm.id || undefined,
              name: this.dataForm.name,
              leadDept: this.dataForm.leadDept,
              deptNames: this.dataForm.deptNames,
              childrenDate: this.dataForm.childrenDate,
              fileList: this.dataForm.fileList
            })
          }).then(({ data }) => {
            if (data && data.code === 0) {
              this.$message({
                message: "操作成功",
                type: "success",
                duration: 1500,
                onClose: () => {
                  this.visible = false;
                  this.$emit("refreshDataList");
                }
              });
            } else {
              this.$message.error(data.msg);
            }
          });
        }
      });
    }
  }
};
</script>