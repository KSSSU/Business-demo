<template>
<el-dialog title="上传文件" :visible.sync="visible" append-to-body  width="50%">
<el-upload
  class="upload-demo"
  :action="doUpload"
  multiple
  :file-list="files"
  :before-upload="beforeUpload"
  :before-remove="beforeRemove">

  <el-input placeholder="请选择需要上传的文件" >
    <template slot="append"><el-button type="primary" >确认上传</el-button></template>
  </el-input>
  <div slot="tip" class="el-upload__tip"><span style="color:red">*注</span>：支持.jpg .jpeg .bmp .等常用图片类型</div>
</el-upload>

 <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="submitUpload">保存</el-button>
      <el-button @click="visible = false">关闭</el-button>
 </span>
</el-dialog>

</template>
<script>
export default {
  data() {
    return {
      visible: false,
      doUpload: "https://jsonplaceholder.typicode.com/posts/",
      files: []
    };
  },
  methods: {
    init(files) {
      if (files.length === 0) {
        this.files = [];
      } else {
        this.files = files;
      }
      this.visible = true;
    },
    //上传之前的校验
    beforeUpload(file) {
      this.files.push(file);
      const extension = file.name.split(".")[1] === "jpg";
      const extension1 = file.name.split(".")[1] === "jpeg";
      const extension2 = file.name.split(".")[1] === "bmp";
      if (!extension && !extension1 && !extension2) {
        this.$message.warning("只能上传jpg,jpeg,bmp格式的照片");
        return;
      }
      // return false;
    },
    beforeRemove(file, fileList) {
      this.$confirm(`确定移除 ${file.name}？`);
      this.files = fileList;
    },
    submitUpload() {
      if (this.files.length === 0) {
        this.$message.warning("请选择要上传的文件!");
        return false;
      }

      let requestConfig = {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      };
      this.$http
        .post(`/matterService/matter/uploadFile?` + this.files, requestConfig)
        .then(({ data }) => {
          if (data && data.code === 0) {
            this.$message({
              message: "操作成功",
              type: "success",
              duration: 1500,
              onClose: () => {
                this.visible = false;
                this.$emit("showFile", this.files);
              }
            });
          } else {
            this.$message.error(data.msg);
          }
        });
    }
  }
};
</script>