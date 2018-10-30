/*
 * @Author: Jimmy
 * @Date: 2018-10-18
 * @Description: 办事指南的新增 / 删除 / 详情 弹出框 - 基本要素(表单)
 * @Last Modified by:    
 * @Last Modified time: 
 */

<template>
  <el-form :model="dataForm" :rules="isReadonly ? {} : dataRule" ref="dataForm" label-width="120px">
		<el-row :gutter="20">
			<el-col :span="12">
				<el-form-item label="选择模板" prop="mould_id">
					<el-select v-model="dataForm.mould_id" placeholder="请选择" :disabled="isReadonly" clearable style="width: 100%;">
						<el-option v-for="item in options.mouldOption" :key="item.value" :label="item.label" :value="item.value"></el-option>
					</el-select>
				</el-form-item>
			</el-col>
			<el-col :span="12">
				<el-form-item label="选择主题" prop="theme_id">
					<el-select v-model="dataForm.theme_id" placeholder="请选择" :disabled="isReadonly" clearable style="width: 100%;">
						<el-option v-for="item in options.themeOption" :key="item.value" :label="item.label" :value="item.value"></el-option>
					</el-select>
				</el-form-item>
			</el-col>
		</el-row>

		<el-row :gutter="20">
			<el-col :span="12">
				<el-form-item label="选择事项" prop="matter_id">
					<el-select v-model="dataForm.matter_id" placeholder="请选择" :disabled="isReadonly" clearable @change="getMatterInfo" style="width: 100%;">
						<el-option v-for="item in options.matterOption"	:key="item.id"	:label="item.name"	:value="item.id"></el-option>
					</el-select>
				</el-form-item>
			</el-col>
			<el-col :span="12">
				<el-form-item label="事项原代码" prop="matter_original_code">
					<el-input v-model="dataForm.matter_code" placeholder="若存在事项原代码，请输入" :readonly="isReadonly"></el-input>
				</el-form-item>
			</el-col>
		</el-row>

		<el-row :gutter="20">
			<el-col :span="12">
				<el-form-item label="事项类型">
					<el-input v-model="matter_type" placeholder="" :disabled="true"></el-input>
				</el-form-item>
			</el-col>
			<el-col :span="12">
				<el-form-item label="事项代码">
					<el-input v-model="matter_code" placeholder="" :disabled="true"></el-input>
				</el-form-item>
			</el-col>
		</el-row>

		<el-form-item label="服务对象" prop="service_object">
			<el-checkbox-group v-model="dataForm.service_object" :disabled="isReadonly">
				<el-checkbox label="自然人"></el-checkbox>
				<el-checkbox label="机关"></el-checkbox>
				<el-checkbox label="事业单位"></el-checkbox>
				<el-checkbox label="企业"></el-checkbox>
				<el-checkbox label="社会团体"></el-checkbox>
				<el-checkbox label="其他组织"></el-checkbox>
			</el-checkbox-group>
		</el-form-item>

		<el-form-item label="办件类型" prop="item_type">
			<el-radio-group v-model="dataForm.item_type" :disabled="isReadonly">
				<el-radio label="1">承诺件</el-radio>
				<el-radio label="2">即办件</el-radio>
				<el-radio label="3">联办件</el-radio>
				<el-radio label="4">初审件</el-radio>
				<el-radio label="5">转报件</el-radio>
			</el-radio-group>
		</el-form-item>

		<el-form-item label="通办范围" prop="operate_scope" v-if="type === 1">
			<el-radio-group v-model="dataForm.operate_scope" :disabled="isReadonly">
				<el-radio label="1">全省通办</el-radio>
				<el-radio label="2">全市通办</el-radio>
				<el-radio label="3">全区通办</el-radio>
				<el-radio label="4">定点办理</el-radio>
			</el-radio-group>
		</el-form-item>

		<el-form-item label="设定依据" prop="set_basis" v-if="type === 1">
      <el-input type="textarea" v-model="dataForm.set_basis" placeholder="请输入设定依据的内容" :readonly="isReadonly"></el-input>
    </el-form-item>

		<el-row :gutter="20">
			<el-col :span="12">
				<el-form-item label="实施机构名称" prop="org_dept">
					<el-select v-model="dataForm.org_dept" placeholder="请选择" :disabled="isReadonly" clearable style="width: 100%;">
						<el-option v-for="item in options.orgOption" :key="item.value" :label="item.label" :value="item.value"></el-option>
					</el-select>
					<!-- <el-input v-model="dataForm.org_dept" placeholder="请输入实施机构" :readonly="isReadonly"></el-input> -->
				</el-form-item>
			</el-col>
			<el-col :span="12">
				<el-form-item label="责任处(科)室或单位" prop="unit_dept" class="min-label">
					<el-input v-model="dataForm.unit_dept" placeholder="请输入责任处(科)室或单位信息"></el-input>
				</el-form-item>
			</el-col>
		</el-row>

		<el-row :gutter="20" v-if="type === 1">
			<el-col :span="12">
				<el-form-item label="实施主体性质" prop="subject_property">
					<el-radio-group v-model="dataForm.subject_property" :disabled="isReadonly">
						<el-radio label="1">法定机关</el-radio>
						<el-radio label="2">授权组织</el-radio>
						<el-radio label="3">受委托组织</el-radio>
					</el-radio-group>
				</el-form-item>
			</el-col>
			<el-col :span="12">
				<el-form-item label="受此组织委托" prop="subject" v-if="dataForm.subject_property == 3">
					<el-input v-model="dataForm.subject" placeholder="请输入实施主体性质" :readonly="isReadonly"></el-input>
				</el-form-item>
			</el-col>
		</el-row>
    
    <el-row :gutter="20" v-if="type === 1">
			<el-col :span="12">
				<el-form-item label="存在联办机构" prop="is_joint">
					<el-radio-group v-model="dataForm.is_joint" :disabled="isReadonly">
						<el-radio :label="0">不存在</el-radio>
						<el-radio :label="1">存在</el-radio>
					</el-radio-group>
				</el-form-item>
			</el-col>
			<el-col :span="12">
				<el-form-item label="选择联办机构" prop="joint_dept" v-if="dataForm.is_joint == 1">
					<el-select v-model="dataForm.joint_dept" placeholder="请选择" clearable style="width: 100%;">
						<el-option v-for="item in options.deptOption"	:key="item.value"	:label="item.label"	:value="item.value"></el-option>
					</el-select>
				</el-form-item>
			</el-col>
		</el-row>

		<el-form-item label="行使类型" prop="exercise_type" v-if="type === 1">
			<el-radio-group v-model="dataForm.exercise_type" :disabled="isReadonly">
				<el-radio label="1">本级保留</el-radio>
				<el-radio label="2">上级委托</el-radio>
				<el-radio label="3">审核转报</el-radio>
			</el-radio-group>
		</el-form-item>

		<el-form-item label="行使层级" prop="exercise_level" v-if="type === 1">
			<el-checkbox-group v-model="dataForm.exercise_level" :disabled="isReadonly">
				<el-checkbox label="国家级"></el-checkbox>
				<el-checkbox label="省级"></el-checkbox>
				<el-checkbox label="市级"></el-checkbox>
				<el-checkbox label="县级(市、区)"></el-checkbox>
				<el-checkbox label="乡级(镇、街道)"></el-checkbox>
				<el-checkbox label="村级(社区)"></el-checkbox>
			</el-checkbox-group>
		</el-form-item>

		<el-form-item label="运行系统" prop="run_system" v-if="type === 1">
			<el-radio-group v-model="dataForm.run_system" :disabled="isReadonly">
				<el-radio label="1">垂直系统</el-radio>
				<el-radio label="2">国家级</el-radio>
				<el-radio label="3">省级</el-radio>
				<el-radio label="4">市级</el-radio>
				<el-radio label="5">县级</el-radio>
				<el-radio label="6">乡级</el-radio>
				<el-radio label="7">村级</el-radio>
			</el-radio-group>
		</el-form-item>

		<el-form-item label="权限划分" prop="power_divide" v-if="type === 1">
			<el-input v-model="dataForm.power_divide" placeholder="请输入权限划分内容" type="textarea" :readonly="isReadonly"></el-input>
		</el-form-item>

		<el-form-item label="行使内容" prop="exercise_content" v-if="type === 1">
			<el-input v-model="dataForm.exercise_content" placeholder="请输入行使内容" type="textarea" :readonly="isReadonly"></el-input>
		</el-form-item>

		<el-form-item label="数量限制" prop="count_limit">
			<el-input v-model="dataForm.count_limit" placeholder="若有数量限制，请输入限制条件和具体数量、具体的限制形式；如无数量限制，请填写“无”" type="textarea" :readonly="isReadonly"></el-input>
		</el-form-item>

		<el-row :gutter="20">
			<el-col :span="12">
				<el-form-item label="结果名称" prop="result_name">
					<el-input v-model="dataForm.result_name" placeholder="请输入申请同意后的形成的批文或证照等结果名称" :readonly="isReadonly"></el-input>
				</el-form-item>
			</el-col>
			<el-col :span="12">
				<el-form-item label="结果样本" prop="result_sample">
					<el-input v-model="dataForm.result_sample" placeholder="请上传结果样本" :readonly="isReadonly"></el-input>
				</el-form-item>
			</el-col>
		</el-row>

		<el-row :gutter="20">
			<el-col :span="12">
				<el-row :gutter="6">
					<el-col :span="18">
						<el-form-item label="法定办结时限" prop="legal_time">
							<el-input-number v-model="dataForm.legal_time" controls-position="right" :disabled="isReadonly" :min="1"></el-input-number>
						</el-form-item>
					</el-col>
					<el-col :span="6">
						<el-form-item label="" prop="legal_unit" label-width="0">
							<el-select v-model="dataForm.legal_unit" placeholder="单位" clearable :disabled="isReadonly">
								<el-option label="工作日" value="1"></el-option>
								<el-option label="天" value="2"></el-option>
							</el-select>
						</el-form-item>
					</el-col>
				</el-row>
			</el-col>
			<el-col :span="12">
				<el-row :gutter="6">
					<el-col :span="18">
						<el-form-item label="承诺办结时限" prop="promise_time">
							<el-input-number v-model="dataForm.promise_time" controls-position="right" :disabled="isReadonly" :min="1"></el-input-number>
						</el-form-item>
					</el-col>
					<el-col :span="6">
						<el-form-item label="" prop="promise_unit" label-width="0">
							<el-select v-model="dataForm.promise_unit" placeholder="单位" clearable :disabled="isReadonly">
								<el-option label="工作日" value="1"></el-option>
								<el-option label="天" value="2"></el-option>
							</el-select>
						</el-form-item>
					</el-col>
				</el-row>
				
			</el-col>
		</el-row>

		<el-row :gutter="20">
			<el-col :span="12">
				<el-form-item label="咨询电话" prop="consult_tel">
					<el-input v-model="dataForm.consult_tel" placeholder="请输入有效的电话号码" :readonly="isReadonly"></el-input>
				</el-form-item>
			</el-col>
			<el-col :span="12">
				<el-form-item label="监督电话" prop="supervise_tel">
					<el-input v-model="dataForm.supervise_tel" placeholder="请输入有效的电话号码" :readonly="isReadonly"></el-input>
				</el-form-item>
			</el-col>
		</el-row>

		<el-form-item v-if="isAdd">
      <el-button type="primary" @click="handleNext()">保存并继续</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { isPhone } from '@/utils/validate';
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
		var validatePhone = (rule, value, callback) => {
			if (!isPhone(value)) {
				callback(new Error('电话号码格式错误'));
			} else {
				callback();
			}
		};
		return {
			matter_type: '',
			matter_code: '',
			typeForShow:
				this.type === 1 ? '行政许可' : this.type === 2 ? '公共服务' : '',
			dataRule: {
				matter_id: [
					{ required: true, message: '请选择事项名称', trigger: 'change' }
				],
				org_dept: [{ required: true, message: '必填', trigger: 'change' }],
				// service_object: [
				// 	{ required: true, message: '请选择', trigger: 'change' }
				// ],
				// item_type: [{ required: true, message: '请选择', trigger: 'change' }],
				// operate_scope: [
				// 	{ required: true, message: '请选择', trigger: 'change' }
				// ],
				// set_basis: [{ required: true, message: '必填', trigger: 'change' }],
				// unit_dept: [{ required: true, message: '必填', trigger: 'change' }],
				// subject_property: [
				// 	{ required: true, message: '请选择', trigger: 'change' }
				// ],
				// subject: [{ required: true, message: '必填', trigger: 'change' }],
				is_joint: [{ required: true, message: '请选择', trigger: 'change' }]
				// joint_dept: [{ required: true, message: '请选择', trigger: 'change' }],
				// exercise_type: [
				// 	{ required: true, message: '请选择', trigger: 'change' }
				// ],
				// exercise_level: [
				// 	{ required: true, message: '请选择', trigger: 'change' }
				// ],
				// run_system: [{ required: true, message: '请选择', trigger: 'change' }],
				// power_divide: [{ required: true, message: '必填', trigger: 'change' }],
				// exercise_content: [
				// 	{ required: true, message: '必填', trigger: 'change' }
				// ],
				// count_limit: [{ required: true, message: '必填', trigger: 'change' }],
				// result_name: [{ required: true, message: '必填', trigger: 'change' }],
				// result_sample: [{ required: true, message: '必填', trigger: 'change' }],
				// legal_time: [
				// 	{ required: true, message: '必填' },
				// 	{ type: 'number', message: '法定办结时限必须为数字值' }
				// ],
				// legal_unit: [{ required: true, message: '请选择' }],
				// promise_time: [
				// 	{ required: true, message: '必填' },
				// 	{ type: 'number', message: '承诺办结时限必须为数字值' }
				// ],
				// promise_unit: [{ required: true, message: '请选择' }],
				// consult_tel: [
				// 	{ required: true, message: '必填', trigger: 'change' },
				// 	{ validator: validatePhone, trigger: 'change' }
				// ],
				// supervise_tel: [
				// 	{ required: true, message: '必填', trigger: 'change' },
				// 	{ validator: validatePhone, trigger: 'change' }
				// ]
			}
		};
	},
	watch: {
		/**
		 * 监听表单dataForm的变化
		 */
		dataForm: function() {
			this.getMatterInfo();
		}
	},
	methods: {
		/**
		 * 重置表单
		 */
		reset() {
			this.matter_type = '';
			this.matter_code = '';
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
		},

		/**
		 * 获取选中的事项信息
		 */
		getMatterInfo(val) {
			val = val ? val : this.dataForm.matter_id;

			if (val) {
				const matter = this.options.matterOption.filter(item => item.id == val);
				this.matter_type = matter[0].type_first;
				this.matter_code = matter[0].encrypt;
			} else {
				this.matter_type = '';
				this.matter_code = '';
			}
		}
	}
};
</script>


<style lang="scss">
.tabs .min-label label {
	line-height: 19px !important;
}
</style>

