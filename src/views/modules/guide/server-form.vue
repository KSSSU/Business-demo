/*
 * @Author: Jimmy
 * @Date: 2018-10-18
 * @Description: 办事指南的新增 / 删除 / 详情 弹出框 - 其他服务(表单)
 * @Last Modified by:    
 * @Last Modified time: 
 */

<template>
  <el-form :model="dataForm" :rules="isReadonly ? {} : dataRule" ref="dataForm" label-width="120px">
		<section v-if="type === 1">
			<h3 class="title">中介服务</h3>
			<el-row :gutter="20">
				<el-col :span="8">
					<el-form-item label="是否有中介服务" prop="is_agency">
							<el-radio-group v-model="dataForm.is_agency" :disabled="isReadonly">
							<el-radio label="0">否</el-radio>
							<el-radio label="1">是</el-radio>
						</el-radio-group>
					</el-form-item>
				</el-col>
				<el-col :span="8" v-if="dataForm.is_agency == 1">
					<el-form-item label="中介名称" prop="agency_name">
						<el-input v-model="dataForm.agency_name" placeholder="" :readonly="isReadonly"></el-input>
					</el-form-item>
				</el-col>
				<el-col :span="8" v-if="dataForm.is_agency == 1">
					<el-form-item label="服务内容" prop="agency_content">
						<el-input v-model="dataForm.agency_content" placeholder="" :readonly="isReadonly"></el-input>
					</el-form-item>
				</el-col>
			</el-row>

			<el-row :gutter="20">
				<el-col :span="8">
					<el-form-item label="是否收费" prop="is_acharge">
							<el-radio-group v-model="dataForm.is_acharge" :disabled="isReadonly">
							<el-radio label="0">否</el-radio>
							<el-radio label="1">是</el-radio>
						</el-radio-group>
					</el-form-item>
				</el-col>
				<el-col :span="8" v-if="dataForm.is_acharge == 1">
					<el-form-item label="收费标准" prop="acharge_standard">
						<el-input v-model="dataForm.acharge_standard" placeholder="" :readonly="isReadonly"></el-input>
					</el-form-item>
				</el-col>
				<el-col :span="8" v-if="dataForm.is_acharge == 1">
					<el-form-item label="收费金额" prop="acharge_money">
						<el-input v-model="dataForm.acharge_money" placeholder="" :readonly="isReadonly"></el-input>
					</el-form-item>
				</el-col>
			</el-row>
		</section>

		<h3 class="title">创新服务</h3>
    <el-row :gutter="20" v-if="type === 1">
			<el-col :span="8">
				<el-form-item label="预约办理" prop="is_appoint">
						<el-radio-group v-model="dataForm.is_appoint" :disabled="isReadonly">
						<el-radio label="0">否</el-radio>
						<el-radio label="1">是</el-radio>
					</el-radio-group>
				</el-form-item>
			</el-col>
			<el-col :span="16" v-if="dataForm.is_appoint == 1">
				<el-form-item label="网址" prop="appoint_url">
					<el-input v-model="dataForm.appoint_url" placeholder="" :readonly="isReadonly"></el-input>
				</el-form-item>
			</el-col>
		</el-row>

		<el-row :gutter="20" v-if="type === 1">
			<el-col :span="8">
				<el-form-item label="网上支付" prop="is_opayment">
						<el-radio-group v-model="dataForm.is_opayment" :disabled="isReadonly">
						<el-radio label="0">否</el-radio>
						<el-radio label="1">是</el-radio>
					</el-radio-group>
				</el-form-item>
			</el-col>
			<el-col :span="16" v-if="dataForm.is_opayment == 1">
				<el-form-item label="支付方式" prop="opayment_type">
					<el-select v-model="dataForm.opayment_type" placeholder="请选择" clearable>
						<el-option v-for="item in options.opaymentOption"	:key="item.value"	:label="item.label"	:value="item.value"></el-option>
					</el-select>
				</el-form-item>
			</el-col>
		</el-row>

		<el-row :gutter="20">
			<el-col :span="8">
				<el-form-item label="物流快递" prop="is_express">
						<el-radio-group v-model="dataForm.is_express" :disabled="isReadonly">
						<el-radio label="0">否</el-radio>
						<el-radio label="1">是</el-radio>
					</el-radio-group>
				</el-form-item>
			</el-col>
			<el-col :span="16" v-if="dataForm.is_express == 1">
				<el-form-item label="快递选择" prop="express_type">
					<el-select v-model="dataForm.express_type" placeholder="请选择" clearable>
						<el-option v-for="item in options.expressOption"	:key="item.value"	:label="item.label"	:value="item.value"></el-option>
					</el-select>
				</el-form-item>
			</el-col>
		</el-row>

		<el-form-item v-if="isAdd">
      <el-button type="primary" @click="handleNext()">保存并继续</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
	// props: ['dataForm', 'options', 'type', 'isReadonly', 'isAdd'],
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
				// is_agency: [{ required: true, message: '请选择', trigger: 'change' }],
				// agency_name: [{ required: true, message: '必填', trigger: 'change' }],
				// agency_content: [
				// 	{ required: true, message: '必填', trigger: 'change' }
				// ],
				// is_acharge: [{ required: true, message: '请选择', trigger: 'change' }],
				// acharge_standard: [
				// 	{ required: true, message: '必填', trigger: 'change' }
				// ],
				// acharge_money: [{ required: true, message: '必填', trigger: 'change' }],
				// is_appoint: [{ required: true, message: '请选择', trigger: 'change' }],
				// appoint_url: [{ required: true, message: '必填', trigger: 'change' }],
				// is_opayment: [{ required: true, message: '请选择', trigger: 'change' }],
				// opayment_type: [
				// 	{ required: true, message: '请选择', trigger: 'change' }
				// ],
				// is_express: [{ required: true, message: '请选择', trigger: 'change' }],
				// express_type: [{ required: true, message: '请选择', trigger: 'change' }]
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
