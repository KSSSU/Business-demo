<template>
  <el-dialog
    :title="!dataForm.id ? '新增字典':isReadOnly? '字典详情':'修改字典'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
      <el-form-item label="字典名称" prop="name">
        <el-input v-model="dataForm.name" placeholder="请输入字典名称" :readonly="isReadOnly"></el-input>
      </el-form-item>
      <el-form-item label="字典号" prop="state" >
        <el-input v-model="dataForm.state" type="text" placeholder="请输入字典号" :readonly="isReadOnly"></el-input>
      </el-form-item>
      <el-form-item label="字典值" prop="value">
        <el-input v-model="dataForm.value" placeholder="请输入字典值" :readonly="isReadOnly"></el-input>
      </el-form-item>
      <el-form-item label="父级ID" prop="parentId">
        <el-input v-model="dataForm.parentId" placeholder="请输入父级ID" :readonly="isReadOnly"></el-input>
      </el-form-item>
      <el-form-item label="排序" prop="sort" >
        <el-input v-model="dataForm.sort" type="text" placeholder="请输入排序" :readonly="isReadOnly"></el-input>
      </el-form-item>
      <el-form-item label="备注" prop="remarks">
        <el-input v-model="dataForm.remarks" placeholder="请输入备注" :readonly="isReadOnly"></el-input>
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
      dataForm: {
        id: 0,
        name: "",
        value: "",
        parentId: "",
        sort: "",
        state: "",
        remarks: ""
      },
      dataRule: {
        name: [{ required: true, message: "必填", trigger: "blur" }],
        value: [{ required: true, message: "必填", trigger: "blur" }],
        state: [{ required: true, message: "必填", trigger: "blur" }]
      }
    };
  },
  methods: {
    init(id, isReadOnly) {
      this.dataForm.id = id || 0;
      this.isReadOnly = isReadOnly;

      this.visible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].resetFields();
      });

      if (this.dataForm.id) {
        this.$http({
          url: this.$http.adornUrl(`/sys/dict/info/${this.dataForm.id}`),
          method: "get",
          params: this.$http.adornParams()
        }).then(({ data }) => {
          if (data && data.code === 0) {
            this.dataForm.name = data.dict.name;
            this.dataForm.value = data.dict.value;
            this.dataForm.state = data.dict.state;
            this.dataForm.parentId = data.dict.parentId;
            this.dataForm.sort = data.dict.sort;
            this.dataForm.remarks = data.dict.remarks;
          }
        });
      }
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
              name: this.dataForm.name,
              value: this.dataForm.value,
              state: this.dataForm.state,
              parentId: this.dataForm.parentId,
              sort: this.dataForm.sort,
              remarks: this.dataForm.remarks
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