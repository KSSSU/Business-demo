<template>
  <el-dialog
    :title="!dataForm.id?'新增行政区划':!handle?'新增子区划':'编辑行政区划'"
    :close-on-click-modal="false"
    :visible.sync="visible" >
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="120px">
         <el-form-item label="行政区划名称：" prop="name">
        <el-input v-model="dataForm.name" placeholder="请输入行政区划的中文全称"></el-input>
      </el-form-item>
      <el-form-item label="行政区划代码：" prop="code">
        <el-input v-model="dataForm.code" placeholder="请输入12位阿拉伯数字行政区划代码"></el-input>
      </el-form-item>
        <el-form-item label="行政区划级别：" prop="comLevel">
        <el-select v-model="dataForm.comLevel">
          <el-option v-for="level in comLevelList" :key="level.value" :label="level.label" :value="level.value"></el-option>
        </el-select>
      </el-form-item>
        <el-form-item label="上级行政区划：" prop="parentName" >
        <el-input v-model="dataForm.parentName" readonly="true"></el-input>
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
      handle: "",
      comLevelList: [
        { label: "省级", value: "1" },
        { label: "市级", value: "2" },
        { label: "县级", value: "3" },
        { label: "乡级", value: "4" },
        { label: "村级", value: "5" }
      ],
      dataForm: {
        id: 0,
        name: "",
        parentId: 0,
        parentName: "",
        comLevel: "",
        code: ""
      },
      dataRule: {
        name: [{ required: true, message: "必填", trigger: "blur" }],
        code: [{ required: true, message: "必填", trigger: "blur" }],
        comLevel: [{ required: true, message: "必填", trigger: "blur" }]
      },
      menuList: [],
      menuListTreeProps: {
        label: "name",
        children: "children"
      }
    };
  },
  methods: {
    init(row, handle) {
      this.handle = handle;
      this.visible = true;
      this.dataForm.id = row.id || 0;
      this.$nextTick(() => {
        this.$refs["dataForm"].resetFields();
      });

      if (this.dataForm.id && handle == "update") {
        // 修改
        this.$http({
          url: this.$http.adornUrl(`/sys/area/info/${this.dataForm.id}`),
          method: "get",
          params: this.$http.adornParams()
        }).then(({ data }) => {
          this.dataForm.id = data.area.id;
          this.dataForm.code = data.area.code;
          this.dataForm.name = data.area.name;
          this.dataForm.parentId = data.area.parentId;
          this.dataForm.parentName = data.area.parentName;
          this.dataForm.comLevel = data.area.comLevel;
        });
      } else if (handle == "children") {
        this.dataForm.comLevel = row.comLevel;
        this.dataForm.parentName = row.name;
        this.dataForm.parentId = row.id;
      } else {
        this.dataForm.parentName = "无";
      }
    },
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
              id: this.dataForm.id || undefined,
              code: this.dataForm.code,
              name: this.dataForm.name,
              parentId: this.dataForm.parentId,
              comLevel: this.dataForm.comLevel
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
