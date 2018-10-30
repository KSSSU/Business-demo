/*
 * @Author: Jimmy
 * @Date: 2018-10-18
 * @Description: 办事指南的新增 / 删除 / 详情 弹出框 - 受理环节(表单)
 * @Last Modified by:    
 * @Last Modified time: 
 */

<template>
  <el-form :model="dataForm" :rules="isReadonly ? {} : dataRule" ref="dataForm" label-width="120px">
		<el-form-item label="受理条件" prop="admissibility">
      <el-input v-model="dataForm.admissibility" type="textarea" placeholder="请输入(>4个字的)受理条件内容" :readonly="isReadonly"></el-input>
    </el-form-item>

		<el-form-item label="办理流程" prop="window_desc">
			<el-checkbox v-model="dataForm.is_window" :true-label="1" :false-label="0" :disabled="true">窗口办理流程</el-checkbox>
			<el-input v-model="dataForm.window_desc" v-if="dataForm.is_window == 1" placeholder="请输入窗口办理流程的内容" :readonly="isReadonly"></el-input>
		</el-form-item>

		<el-form-item label="" >
			<el-checkbox v-model="dataForm.is_online" :true-label="1" :false-label="0" :disabled="isReadonly">网上办理流程</el-checkbox>
			<el-form-item prop="online_desc" v-if="dataForm.is_online == 1">
				<el-input v-model="dataForm.online_desc" placeholder="请输入网上办理流程的内容" :readonly="isReadonly"></el-input>
			</el-form-item>
		</el-form-item>

		<el-form-item label="" prop="is_special" v-if="type === 1">
			<el-checkbox v-model="dataForm.is_special" :true-label="1" :false-label="0" :disabled="isReadonly">特殊环节</el-checkbox>
		</el-form-item>

		<el-form-item label="特殊程序名称" v-if="dataForm.is_special == 1" class="lightLabel" style="padding-left: 120px">
			<el-checkbox-group v-model="dataForm.special_procedure" :disabled="isReadonly">
				<el-checkbox label="听证"></el-checkbox>
				<el-checkbox label="公告"></el-checkbox>
				<el-checkbox label="公示"></el-checkbox>
				<el-checkbox label="检验"></el-checkbox>
				<el-checkbox label="检测"></el-checkbox>
				<el-checkbox label="鉴定"></el-checkbox>
				<el-checkbox label="专家评审"></el-checkbox>
				<el-checkbox label="论证"></el-checkbox>
				<el-checkbox label="勘察"></el-checkbox>
				<el-checkbox label="评估"></el-checkbox>
				<el-checkbox label="其他"></el-checkbox>
			</el-checkbox-group>
			<el-input v-model="dataForm.other_special_procedure" 
				v-if="dataForm.special_procedure.length > 0 && dataForm.special_procedure.indexOf('其他') > -1" 
				placeholder="请输入其他特殊程序名称" 
				:readonly="isReadonly">
			</el-input>
		</el-form-item>

		<el-form-item label="" v-if="dataForm.is_special == 1">
			<el-row :gutter="20">
				<el-col :span="12">
					<el-form-item label="办理人" prop="procedurer" class="lightLabel">
						<el-input v-model="dataForm.procedurer" placeholder="请输入特殊程序办理人" :readonly="isReadonly"></el-input>
					</el-form-item>
				</el-col>
				<el-col :span="12">
					<el-form-item label="建议时间" prop="procedure_time" class="lightLabel">
						<el-date-picker	v-model="dataForm.procedure_time"	type="datetime" default-time="10:00:00" :disabled="isReadonly" placeholder="请输入特殊程序建议时间" style="width: 100%"></el-date-picker>
					</el-form-item>
				</el-col>
			</el-row>
		</el-form-item>

		<el-form-item label="是否收费" prop="is_charge">
			<el-radio v-model="dataForm.is_charge" :label="0" :disabled="isReadonly">否</el-radio>
 			<el-radio v-model="dataForm.is_charge" :label="1" :disabled="isReadonly">是</el-radio>

			 <el-row :gutter="20" v-if="dataForm.is_charge == 1">
				<el-col :span="12">
					<el-form-item label="收费标准" prop="charge_standard" class="lightLabel">
						<el-input v-model="dataForm.charge_standard" placeholder="请输入收费标准" :readonly="isReadonly"></el-input>
					</el-form-item>
				</el-col>
				<el-col :span="12">
					<el-form-item label="收费依据" prop="charge_basis" class="lightLabel">
						<el-input v-model="dataForm.charge_basis" placeholder="请输入收费依据" :readonly="isReadonly"></el-input>
					</el-form-item>
				</el-col>
			</el-row>
		</el-form-item>

		<el-form-item label="办理形式" prop="is_wdeal">
			<el-checkbox v-model="dataForm.is_wdeal" :true-label="1" :false-label="0" :disabled="true">窗口办理</el-checkbox>
			<el-row :gutter="20" v-if="dataForm.is_wdeal == 1">
				<el-col :span="12">
					<el-form-item label="办理地点" prop="wdeal_place" class="lightLabel">
						<el-input v-model="dataForm.wdeal_place" placeholder="请输入具体办理地点" :readonly="isReadonly"></el-input>
					</el-form-item>
				</el-col>
				<el-col :span="12">
					<el-form-item label="办理时间" prop="wdeal_time" class="lightLabel">
						<el-date-picker	v-model="dataForm.wdeal_time"	type="datetime" default-time="10:00:00" :disabled="isReadonly" placeholder="请输入办理时间" style="width: 100%"></el-date-picker>
					</el-form-item>
				</el-col>
				<el-col :span="24" style="margin-top: 22px">
					<el-form-item label="交通指引" prop="wdeal_traffic" class="lightLabel">
						<el-input v-model="dataForm.wdeal_traffic" placeholder="请输入具体交通信息" :readonly="isReadonly"></el-input>
					</el-form-item>
				</el-col>
			</el-row>
		</el-form-item>

		<el-form-item label="" prop="is_odeal">
			<el-checkbox v-model="dataForm.is_odeal" :true-label="1" :false-label="0" :disabled="isReadonly">网上办理</el-checkbox>
			<el-input v-model="dataForm.odeal_link" v-if="dataForm.is_odeal == 1" placeholder="请输入网上链接" :readonly="isReadonly"></el-input>
		</el-form-item>

		<el-form-item label="" prop="is_tdeal">
			<el-checkbox v-model="dataForm.is_tdeal" :true-label="1" :false-label="0" :disabled="isReadonly">电话办理</el-checkbox>
			<el-input v-model="dataForm.tdeal_tel" v-if="dataForm.is_tdeal == 1" placeholder="请输入办理部门及详情电话" :readonly="isReadonly"></el-input>
		</el-form-item>

		<el-form-item v-if="isAdd">
      <el-button type="primary" @click="handleNext()">保存并继续</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
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
		return {
			dataRule: {
				// admissibility: [
				// 	{ required: true, message: '必填', trigger: 'change' },
				// 	{ min: 5, message: '请输入四个字以上的内容' }
				// ],
				// is_window: [{ required: true, message: '请选择', trigger: 'change' }],
				// window_desc: [{ required: true, message: '必填', trigger: 'change' }],
				// online_desc: [{ required: true, message: '必填', trigger: 'change' }],
				// procedurer: [{ required: true, message: '必填', trigger: 'change' }],
				// procedure_time: [{ required: true, message: '必填', trigger: 'change' }],
				// is_charge: [{ required: true, message: '请选择', trigger: 'change' }],
				// charge_standard: [
				// 	{ required: true, message: '必填', trigger: 'change' }
				// ],
				// charge_basis: [{ required: true, message: '必填', trigger: 'change' }],
				// is_wdeal: [{ required: true, message: '请选择', trigger: 'change' }],
				// wdeal_place: [{ required: true, message: '必填', trigger: 'change' }],
				// wdeal_time: [{ required: true, message: '必填', trigger: 'change' }],
				// wdeal_traffic: [{ required: true, message: '必填', trigger: 'change' }]
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
.tabs .lightLabel label {
	font-weight: 400;
}
.tabs .el-checkbox {
	margin-right: 30px;
}
.tabs .el-checkbox + .el-checkbox {
	margin-left: 0;
}
</style>
