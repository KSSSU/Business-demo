<template>
  <el-dialog
    :title="!dataForm.id ? '添加菜单' : '修改菜单'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
         <el-form-item label="上级菜单" prop="parentName">
        <el-input v-model="dataForm.parentName" ></el-input>
      </el-form-item>
      <el-form-item label="名称" prop="name">
        <el-input v-model="dataForm.name" ></el-input>
      </el-form-item>
        <el-form-item label="链接" prop="url">
        <el-input v-model="dataForm.url" ></el-input>
      </el-form-item>
        <el-form-item label="目标" prop="type">
        <el-input v-model="dataForm.type" ></el-input>
      </el-form-item>
        <el-form-item label="图标" prop="icon">
        <el-input v-model="dataForm.icon" ></el-input>
      </el-form-item>
        <el-form-item label="排序" prop="sort">
        <el-input v-model="dataForm.sort" ></el-input>
      </el-form-item>
        <el-form-item label="可见" prop="state">
        <el-input v-model="dataForm.state" ></el-input>
      </el-form-item>
        <el-form-item label="权限标识" prop="permission">
        <el-input v-model="dataForm.permission" ></el-input>
      </el-form-item>
        <el-form-item label="备注" prop="remarks">
        <el-input v-model="dataForm.remarks" ></el-input>
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
import Icon from "@/icons";
export default {
  data() {
    return {
      visible: false,
      dataForm: {
        id: 0,
        name: "",
        parentId: 0,
        parentName: "",
        url: "",
        sort: 0,
        icon: "",
        remarks: "",
        state: "",
        permission: "",
        type: ""
      },
      dataRule: {
        name: [{ required: true, message: "名称不能为空", trigger: "blur" }],
        parentName: [
          { required: true, message: "上级菜单不能为空", trigger: "blur" }
        ],
        sort: [{ required: true, message: "必填", trigger: "blur" }],
        state: [{ required: true, message: "必填", trigger: "blur" }]
      },
      menuList: [],
      menuListTreeProps: {
        label: "name",
        children: "children"
      }
    };
  },
  methods: {
    init(parentName, id) {
      this.dataForm.id = id || 0;
      this.$http({
        url: this.$http.adornUrl("/sys/menu/select"),
        method: "get",
        params: this.$http.adornParams()
      })
        .then(({ data }) => {
          this.menuList = treeDataTranslate(data.menuList, "menuId");
        })
        .then(() => {
          this.visible = true;
          this.$nextTick(() => {
            this.$refs["dataForm"].resetFields();
          });
        })
        .then(() => {
          if (!this.dataForm.id) {
            // 新增
            // this.menuListTreeSetCurrentNode();
            this.dataForm.parentName = parentName || "";
          } else {
            // 修改
            this.$http({
              url: this.$http.adornUrl(`/sys/menu/info/${this.dataForm.id}`),
              method: "get",
              params: this.$http.adornParams()
            }).then(({ data }) => {
              this.dataForm.id = data.menu.menuId;
              this.dataForm.type = data.menu.type;
              this.dataForm.name = data.menu.name;
              this.dataForm.parentId = data.menu.parentId;
              this.dataForm.url = data.menu.url;
              this.dataForm.remarks = data.menu.remarks;
              this.dataForm.sort = data.menu.sort;
              this.dataForm.icon = data.menu.icon;
              this.dataForm.state = data.menu.state;
              this.dataForm.permission = data.menu.permission;
              this.dataForm.parentName = data.menu.parentName;
              // this.menuListTreeSetCurrentNode();
            });
          }
        });
    },
    // // 菜单树选中
    // menuListTreeCurrentChangeHandle(data, node) {
    //   this.dataForm.parentId = data.menuId;
    //   this.dataForm.parentName = data.name;
    // },
    // // 菜单树设置当前选中节点
    // menuListTreeSetCurrentNode() {
    //   this.$refs.menuListTree.setCurrentKey(this.dataForm.parentId);
    //   this.dataForm.parentName = (this.$refs.menuListTree.getCurrentNode() ||
    //     {})["name"];
    // },
    // 表单提交
    dataFormSubmit() {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          this.$http({
            url: this.$http.adornUrl(
              `/sys/menu/${!this.dataForm.id ? "save" : "update"}`
            ),
            method: "post",
            data: this.$http.adornData({
              menuId: this.dataForm.id || undefined,
              type: this.dataForm.type,
              name: this.dataForm.name,
              parentId: this.dataForm.parentId,
              url: this.dataForm.url,
              sort: this.dataForm.sort,
              icon: this.dataForm.icon,
              remarks: this.dataForm.remarks,
              state: this.dataForm.state,
              permission: this.dataForm.permission
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

<style lang="scss">
.mod-menu {
  .menu-list__input,
  .icon-list__input {
    > .el-input__inner {
      cursor: pointer;
    }
  }
  &__icon-popover {
    max-width: 370px;
  }
  &__icon-list {
    max-height: 180px;
    padding: 0;
    margin: -8px 0 0 -8px;
    > .el-button {
      padding: 8px;
      margin: 8px 0 0 8px;
      > span {
        display: inline-block;
        vertical-align: middle;
        width: 18px;
        height: 18px;
        font-size: 18px;
      }
    }
  }
  .icon-list__tips {
    font-size: 18px;
    text-align: center;
    color: #e6a23c;
    cursor: pointer;
  }
}
</style>
