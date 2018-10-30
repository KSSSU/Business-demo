<template>
  <el-dialog
    :title="!dataForm.id ? '新建部门':isReadOnly? '部门详情':'修改部门'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="120px">
      <el-form-item label="部门名称" prop="name">
        <el-input v-model="dataForm.name" placeholder="请输入部门名称" :readonly="isReadOnly"></el-input>
      </el-form-item>
      <el-form-item label="组织机构代码" prop="code" >
        <el-input v-model="dataForm.code" type="text" placeholder="请输入(9位)组织机构代码或社会信用代码中组织机构信息" :readonly="isReadOnly"></el-input>
      </el-form-item>
       <el-form-item label="所属行政区划" prop="areaId">
         <el-select v-model="dataForm.areaId"  :disabled="isReadOnly">
           <el-option v-for="dept in deptList" :key="dept.areaId" :label="dept.name" :value="dept.areaId" ></el-option>
         </el-select>
      </el-form-item>
 
      <el-form-item label="部门层级" prop="level">
        <el-select v-model="dataForm.level" :disabled="isReadOnly">
           <el-option v-for="dept in deptList" :key="dept.level" :label="dept.name" :value="dept.level" ></el-option>
         </el-select>
      </el-form-item>
      <el-form-item label="机构类别" prop="type">
        <el-select v-model="dataForm.type" :disabled="isReadOnly">
           <el-option v-for="dept in deptList" :key="dept.type" :label="dept.name" :value="dept.type" ></el-option>
         </el-select>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="dataFormSubmit()" v-if="!isReadOnly">保存</el-button>
      <el-button @click="visible = false">关闭</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { isMobile } from "@/utils/validate";
export default {
  data() {
    return {
      visible: false,
      isReadOnly: false,
      deptList: [],
      dataForm: {
        id: 0,
        name: "",
        code: "",
        level: "",
        areaId: "",
        type: ""
      },
      dataRule: {
        name: [{ required: true, message: "必填", trigger: "blur" }],
        code: [{ required: true, message: "必填", trigger: "blur" }],
        type: [{ required: true, message: "必填", trigger: "blur" }],
        level: [{ required: true, message: "必填", trigger: "blur" }],
        areaId: [{ required: true, trigger: "blur", message: "必填" }]
      }
    };
  },
  methods: {
    init(id, isReadOnly) {
      this.dataForm.id = id || 0;
      this.isReadOnly = isReadOnly;
      this.$http({
        url: this.$http.adornUrl("/sys/depart"),
        method: "get",
        params: this.$http.adornParams()
      })
        .then(({ data }) => {
          this.deptList = data && data.code === 0 ? data.page.list : [];
        })
        .then(() => {
          this.visible = true;
          this.$nextTick(() => {
            this.$refs["dataForm"].resetFields();
          });
        })
        .then(() => {
          if (this.dataForm.id) {
            this.$http({
              url: this.$http.adornUrl(`/sys/depart/info/${this.dataForm.id}`),
              method: "post",
              params: this.$http.adornParams()
            }).then(({ data }) => {
              if (data && data.code === 0) {
                console.log("data", data);
                this.dataForm.name = data.depart.name;
                this.dataForm.code = data.depart.code;
                this.dataForm.level = data.depart.level;
                this.dataForm.type = data.depart.type;
                this.dataForm.areaId = data.depart.areaId;
              }
            });
          }
        });
    },
    // 表单提交
    dataFormSubmit() {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          this.$http({
            url: this.$http.adornUrl(
              `/sys/depart/${!this.dataForm.id ? "save" : "update"}`
            ),
            method: "post",
            data: this.$http.adornData({
              id: this.dataForm.id || undefined,
              name: this.dataForm.name,
              code: this.dataForm.code,
              level: this.dataForm.level,
              type: this.dataForm.type,
              areaId: this.dataForm.areaId
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