/*
 * @Author: Jimmy
 * @Date: 2018-10-18
 * @Description: 办事指南的新增 / 删除 / 详情 弹出框 - 权力义务救济(表单)
 * @Last Modified by:    
 * @Last Modified time: 
 */

<template>
  <el-form :model="dataForm" :rules="isReadonly ? {} : dataRule" ref="dataForm" label-width="120px">
		<h3 class="title">申请人权力和义务</h3>
    <el-form-item label="依法享有的权利" prop="law_right">
      <el-input v-model="dataForm.law_right" type="textarea" placeholder="请输入申请人依法享有的权力" :readonly="isReadonly"></el-input>
    </el-form-item>
    <el-form-item label="依法履行的义务" prop="law_duty">
      <el-input v-model="dataForm.law_duty" type="textarea" placeholder="请输入申请人依法履行的义务" :readonly="isReadonly"></el-input>
    </el-form-item>

    <h3 class="title">法律救济 - 行政复议</h3>
    <el-row :gutter="20">
			<el-col :span="12">
				<el-form-item label="部门" prop="reconsider_dept">
					<el-input v-model="dataForm.reconsider_dept" placeholder="" :readonly="isReadonly"></el-input>
				</el-form-item>
        <el-form-item label="电话" prop="reconsider_tel">
					<el-input v-model="dataForm.reconsider_tel" placeholder="" :readonly="isReadonly"></el-input>
				</el-form-item>
			</el-col>
			<el-col :span="12">
				<el-form-item label="地址" prop="reconsider_address">
					<el-input v-model="dataForm.reconsider_address" placeholder="" :readonly="isReadonly"></el-input>
				</el-form-item>
        <el-form-item label="网址" prop="reconsider_url">
					<el-input v-model="dataForm.reconsider_url" placeholder="" :readonly="isReadonly"></el-input>
				</el-form-item>
			</el-col>
		</el-row>

    <h3 class="title">法律救济 - 行政诉讼</h3>
    <el-row :gutter="20">
			<el-col :span="12">
				<el-form-item label="部门" prop="law_dept">
					<el-input v-model="dataForm.law_dept" placeholder="" :readonly="isReadonly"></el-input>
				</el-form-item>
        <el-form-item label="电话" prop="law_tel">
					<el-input v-model="dataForm.law_tel" placeholder="" :readonly="isReadonly"></el-input>
				</el-form-item>
			</el-col>
			<el-col :span="12">
				<el-form-item label="地址" prop="law_address">
					<el-input v-model="dataForm.law_address" placeholder="" :readonly="isReadonly"></el-input>
				</el-form-item>
        <el-form-item label="网址" prop="law_url">
					<el-input v-model="dataForm.law_url" placeholder="" :readonly="isReadonly"></el-input>
				</el-form-item>
			</el-col>
		</el-row>

		<el-form-item v-if="isAdd">
      <el-button type="primary" @click="handleNext()">保存并继续</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { isPhone, isURL } from '@/utils/validate';
export default {
	// props: ['dataForm', 'type', 'isReadonly', 'isAdd'],
	props: {
		dataForm: {
			type: Object,
			default: function() {
				return {};
			}
		},
		options: {
			type: [Object, Array],
			default: function() {
				return {};
			}
		},
		type: {
			type: Number
		},
		isReadonly: {
			type: Boolean
		},
		isAdd: {
			type: Boolean
		}
	},
	data() {
		var validatePhone = (rule, value, callback) => {
			if (!isPhone(value)) {
				callback(new Error('电话号码格式错误'));
			} else {
				callback();
			}
		};
		var validateUrl = (rule, value, callback) => {
			if (!isURL(value)) {
				callback(new Error('网址格式错误'));
			} else {
				callback();
			}
		};
		return {
			dataRule: {
				// law_right: [{ required: true, message: '必填', trigger: 'change' }],
				// law_duty: [{ required: true, message: '必填', trigger: 'change' }],
				// reconsider_dept: [
				// 	{ required: true, message: '必填', trigger: 'change' }
				// ],
				// reconsider_address: [
				// 	{ required: true, message: '必填', trigger: 'change' }
				// ],
				// reconsider_tel: [
				// 	{ required: true, message: '必填', trigger: 'change' },
				// 	{ validator: validatePhone, trigger: 'change' }
				// ],
				// reconsider_url: [
				// 	{ required: true, message: '必填', trigger: 'change' },
				// 	{ validator: validateUrl, trigger: 'change' }
				// ],
				// law_dept: [{ required: true, message: '必填', trigger: 'change' }],
				// law_address: [{ required: true, message: '必填', trigger: 'change' }],
				// law_tel: [
				// 	{ required: true, message: '必填', trigger: 'change' },
				// 	{ validator: validatePhone, trigger: 'change' }
				// ],
				// law_url: [
				// 	{ required: true, message: '必填', trigger: 'change' },
				// 	{ validator: validateUrl, trigger: 'change' }
				// ]
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
		 * 下一步: 保存并继续
		 */
		handleNext() {
			this.$refs['dataForm'].validate(valid => {
				if (valid) {
					this.$emit('onNext');
				}
			});
		}
	}
};
</script>

<style lang="scss">
.title {
	color: #17b3a3;
}
</style>

