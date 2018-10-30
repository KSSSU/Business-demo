<template>
  <el-dialog
    title="操作日志详情"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
      <el-form-item label="日志标题" prop="name">
        <el-input v-model="dataForm.name"  :readonly="isReadOnly"></el-input>
      </el-form-item>
     <el-form-item label="操作用户" prop="operation">
        <el-input v-model="dataForm.operation"  readonly="isReadOnly"></el-input>
      </el-form-item> 
      <el-form-item label="操作时间" prop="createDate" >
        <el-input v-model="dataForm.createDate" type="text" :readonly="isReadOnly"></el-input>
      </el-form-item>
     <el-form-item label="操作IP" prop="ip">
        <el-input v-model="dataForm.ip"  :readonly="isReadOnly"></el-input>
      </el-form-item>
      <el-form-item label="URL" prop="url">
        <el-input v-model="dataForm.url"  :readonly="isReadOnly"></el-input>
      </el-form-item>
      <el-form-item label="提交方式" prop="method">
        <el-input v-model="dataForm.method" :readonly="isReadOnly"></el-input>
      </el-form-item>
      <el-form-item label="操作数据" prop="params">
        <el-input v-model="dataForm.params"  :readonly="isReadOnly"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
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
      roleList: [],
      deptList: [],
      dataForm: {
        id: 0,
        name: "",
        operation: "",
        createDate: "",
        ip: "",
        url: "",
        method: "",
        params: ""
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
          url: this.$http.adornUrl(`/sys/log/info/${this.dataForm.id}`),
          method: "get",
          params: this.$http.adornParams()
        }).then(({ data }) => {
          if (data && data.code === 0) {
            this.dataForm.name = data.log.name;
            this.dataForm.operation = data.log.operation;
            this.dataForm.createDate = data.log.createDate;
            this.dataForm.ip = data.log.ip;
            this.dataForm.url = data.log.url;
            this.dataForm.method = data.log.method;
            this.dataForm.params = data.log.params;
          }
        });
      }
    }
  }
};
</script>