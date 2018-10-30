<template>
  <el-dialog
    :title="!dataForm.id ? '新增角色' :isReadOnly ?'修改角色':'角色详情'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
      <el-form-item label="角色名称" prop="name">
        <el-input v-model="dataForm.name" placeholder="角色名称" :readonly="isReadOnly"></el-input>
      </el-form-item>
      <el-form-item label="备注" prop="remarks">
        <el-input v-model="dataForm.remarks" placeholder="备注" :readonly="isReadOnly"></el-input>
      </el-form-item>
      <el-form-item label="角色级别" prop="level" >
         <el-select placeholder="==请选择==" v-model="dataForm.level" :disabled="isReadOnly">
           <el-option label="超级管理员" value="1"></el-option>
           <el-option label="省级" value="2"></el-option>
           <el-option label="市级" value="3"></el-option>
           <el-option label="镇级" value="4"></el-option>
         </el-select>
      </el-form-item>
      <el-form-item size="mini" label="角色权限">
        <el-tree
          :data="menuList"
          :props="menuListTreeProps"
          node-key="menuId"
          ref="menuListTree"
          :default-expand-all="false"
          show-checkbox>
        </el-tree>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="dataFormSubmit()">保存</el-button>
      <el-button @click="visible = false">关闭</el-button>  
    </span>
  </el-dialog>
</template>

<script>
import { treeDataTranslate } from "@/utils";
export default {
  data() {
    return {
      visible: false,
      isReadOnly: false,
      menuList: [],
      menuListTreeProps: {
        label: "name",
        children: "children"
      },
      dataForm: {
        id: 0,
        name: "",
        remarks: "",
        level: ""
      },
      dataRule: {
        name: [{ required: true, message: "必填", trigger: "blur" }],
        remarks: [{ required: true, message: "必填", trigger: "blur" }],
        level: [{ required: true, message: "必填", trigger: "blur" }]
      },
      tempKey: -666666 // 临时key, 用于解决tree半选中状态项不能传给后台接口问题. # 待优化
    };
  },
  methods: {
    init(id, isReadOnly) {
      this.dataForm.id = id || 0;
      this.isReadOnly = isReadOnly;
      this.$http({
        url: this.$http.adornUrl("/sys/menu/list"),
        method: "get",
        params: this.$http.adornParams()
      })
        .then(({ data }) => {
          this.menuList = treeDataTranslate(data, "menuId");
        })
        .then(() => {
          this.visible = true;
          this.$nextTick(() => {
            this.$refs["dataForm"].resetFields();
            this.$refs.menuListTree.setCheckedKeys([]);
          });
        })
        .then(() => {
          if (this.dataForm.id) {
            this.$http({
              url: this.$http.adornUrl(`/sys/role/info/${this.dataForm.id}`),
              method: "get",
              params: this.$http.adornParams()
            }).then(({ data }) => {
              if (data && data.code === 0) {
                this.dataForm.roleName = data.role.roleName;
                this.dataForm.remark = data.role.remark;
                var idx = data.role.menuIdList.indexOf(this.tempKey);
                if (idx !== -1) {
                  data.role.menuIdList.splice(
                    idx,
                    data.role.menuIdList.length - idx
                  );
                }
                this.$refs.menuListTree.setCheckedKeys(data.role.menuIdList);
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
              `/sys/role/${!this.dataForm.id ? "save" : "update"}`
            ),
            method: "post",
            data: this.$http.adornData({
              id: this.dataForm.id || undefined,
              name: this.dataForm.name,
              remarks: this.dataForm.remarks,
              level: this.dataForm.level,
              menuIdList: [].concat(
                this.$refs.menuListTree.getCheckedKeys(),
                [this.tempKey],
                this.$refs.menuListTree.getHalfCheckedKeys()
              )
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
