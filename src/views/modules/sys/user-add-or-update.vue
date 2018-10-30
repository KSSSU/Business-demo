<template>
  <el-dialog
    :title="!dataForm.id ? '新增用户':isReadOnly? '用户详情':'修改用户'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
      <el-form-item label="账号" prop="userName">
        <el-input v-model="dataForm.userName" placeholder="请输入系统登录帐号" :readonly="isReadOnly"></el-input>
      </el-form-item>
       <el-form-item label="角色" prop="roleId">
         <el-select v-model="dataForm.roleId"  :disabled="isReadOnly">
           <el-option v-for="role in roleList" :key="role.id" :label="role.name" :value="role.id" ></el-option>
         </el-select>
      </el-form-item>
      <el-form-item label="用户名" prop="realname" >
        <el-input v-model="dataForm.realname" type="text" placeholder="请输入用户名" :readonly="isReadOnly"></el-input>
      </el-form-item>
      <el-form-item label="所在部门" prop="deptId">
        <el-select v-model="dataForm.deptId" :disabled="isReadOnly">
           <el-option v-for="dept in deptList" :key="dept.id" :label="dept.name" :value="dept.id" ></el-option>
         </el-select>
      </el-form-item>
      <el-form-item label="手机号" prop="telephone">
        <el-input v-model="dataForm.telephone" placeholder="请输入手机号" :readonly="isReadOnly"></el-input>
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
    var validateMobile = (rule, value, callback) => {
      if (!isMobile(value)) {
        callback(new Error("手机号格式错误"));
      } else {
        callback();
      }
    };
    return {
      visible: false,
      isReadOnly: false,
      roleList: [],
      deptList: [],
      dataForm: {
        id: 0,
        userName: "",
        roleId: "",
        realname: "",
        telephone: "",
        deptId: ""
      },
      dataRule: {
        userName: [{ required: true, message: "必填", trigger: "blur" }],
        roleId: [{ required: true, message: "必填", trigger: "blur" }],
        realname: [{ required: true, message: "必填", trigger: "blur" }],
        deptId: [{ required: true, message: "必填", trigger: "blur" }],
        telephone: [
          { required: true, trigger: "blur", message: "必填" },
          { validator: validateMobile, trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    init(id, isReadOnly) {
      this.dataForm.id = id || 0;
      this.isReadOnly = isReadOnly;
      this.$http({
        url: this.$http.adornUrl("/sys/role/select"),
        method: "get",
        params: this.$http.adornParams()
      })
        .then(({ data }) => {
          this.roleList = data && data.code === 0 ? data.list : [];
        })
        .then(() => {
          this.$http({
            url: this.$http.adornUrl("/sys/depart"),
            method: "get",
            params: this.$http.adornParams()
          }).then(({ data }) => {
            this.deptList = data && data.code === 0 ? data.page.list : [];
          });
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
              url: this.$http.adornUrl(`/sys/user/info/${this.dataForm.id}`),
              method: "get",
              params: this.$http.adornParams()
            }).then(({ data }) => {
              if (data && data.code === 0) {
                this.dataForm.userName = data.user.username;
                this.dataForm.roleId = data.user.roleId;
                this.dataForm.realname = data.user.realname;
                this.dataForm.telephone = data.user.telephone;
                this.dataForm.deptId = data.user.deptId;
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
              `/sys/user/${!this.dataForm.id ? "save" : "update"}`
            ),
            method: "post",
            data: this.$http.adornData({
              id: this.dataForm.id || undefined,
              username: this.dataForm.userName,
              realname: this.dataForm.realname,
              roleId: this.dataForm.roleId,
              telephone: this.dataForm.telephone,
              deptId: this.dataForm.deptId
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