/*
 * @Author: Jimmy
 * @Date: 2018-10-18
 * @Description: 办事指南的新增 / 删除 / 详情 弹出框 - 常见问题(表单)
 * @Last Modified by:    
 * @Last Modified time: 
 */

<template>
  <el-form :model="dataForm" :rules="isReadonly ? {} : dataRule" ref="dataForm" label-width="120px">
		<el-form-item label="常见问题" prop="problem">
			<el-input v-model="dataForm.problem" type="textarea" rows="5" placeholder="请输入常见问题的内容，如没有则填写“无”" :readonly="isReadonly"></el-input>
		</el-form-item>
  </el-form>
</template>

<script>
export default {
	props: ['dataForm', 'type', 'isReadonly'],
	data() {
		return {
			dataRule: {
				problem: [{ required: true, message: '必填', trigger: 'change' }]
			}
		};
	},
	methods: {
		/**
		 * 重置表单
		 */
		reset() {
			this.$refs['dataForm'].resetFields();
		},

		/**
		 * 验证表单
		 */
		async valid() {
			try {
				return await this.$refs['dataForm'].validate();
			} catch (err) {
				return false;
			}
		},

		/**
		 * 最后一步:完成并保存
		 */
		handleFinish() {
			this.$refs['dataForm'].validate(valid => {
				if (valid) {
					this.$emit('onFinish');
				}
			});
		}
	}
};
</script>
