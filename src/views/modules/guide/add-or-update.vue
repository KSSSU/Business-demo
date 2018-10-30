/*
 * @Author: Jimmy
 * @Date: 2018-10-18
 * @Description: 办事指南的新增 / 修改 / 详情 弹出框页面
 * @Last Modified by:    
 * @Last Modified time: 
 */

<template>
  <el-dialog
		:top="'10vh'"
		:width="'1000px'"
    :title="!dataForm.id ? '新建办事指南' : isReadonly ? '办事指南详情' : '修改办事指南'"
		:class="isAdd ? 'add-new' : ''"
    :close-on-click-modal="false"
    :visible.sync="visible">

		<el-steps :active="active" finish-status="success" align-center style="margin-bottom: 15px;" v-if="isAdd">
			<el-step v-for="step in steps" :key="step.value" :title="step.label"></el-step>
		</el-steps>

		<el-tabs v-model="activeName" type="border-card" class="tabs" @tab-click="handleClick">
			<el-tab-pane label="基本要素" name="1">
				<basic-form :dataForm="dataForm" :options="optionList" v-bind="formProps" @onNext="handleNext" ref="basicForm"></basic-form>
			</el-tab-pane>
			<el-tab-pane label="受理环节" name="2">
				<accept-form :dataForm="dataForm" v-bind="formProps" @onNext="handleNext" ref="acceptForm"></accept-form>
			</el-tab-pane>
			<el-tab-pane label="申请材料" name="3">
				<mater-form :dataForm="dataForm" :options="optionList" v-bind="formProps" @onNext="handleNext" ref="materForm"></mater-form>
			</el-tab-pane>
			<el-tab-pane label="权力义务救济" name="4" v-if="dataForm.type === 1">
				<power-form :dataForm="dataForm" v-bind="formProps" @onNext="handleNext" ref="powerForm"></power-form>
			</el-tab-pane>
			<el-tab-pane label="其它服务" :name="dataForm.type === 1 ? '5' : '4'">
				<server-form :dataForm="dataForm" :options="optionList" v-bind="formProps" @onNext="handleNext" ref="serverForm"></server-form>
			</el-tab-pane>
			<el-tab-pane label="常见问题" :name="dataForm.type === 1 ? '6' : '5'">
				<problem-form :dataForm="dataForm" v-bind="formProps" @onFinish="dataFormSubmit" ref="problemForm"></problem-form>
			</el-tab-pane>
		</el-tabs>

    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">{{isReadonly ? '关闭' : '取消'}}</el-button>
      <el-button type="primary" @click="dataFormSubmit()" v-if="(!isReadonly && !isAdd) || (isAdd && active == steps.length - 1)">保存</el-button>
			<!-- <el-button type="primary" @click="handleNext()" v-if="isAdd && active < steps.length - 1">保存并继续</el-button> -->
    </span>
  </el-dialog>
</template>

<script>
import formField from './formField';
import BasicForm from './basic-form';
import AcceptForm from './accept-form';
import MaterForm from './mater-form';
import PowerForm from './power-form';
import ServerForm from './server-form';
import ProblemForm from './problem-form';

export default {
	props: ['type'],
	data() {
		return {
			visible: false,
			isReadonly: false,
			isAdd: false,
			dataForm: formField,
			active: 0, //步骤条
			activeName: '1', //当前显示的Tabs页面
			isClose: false, //保存完后是否关闭弹出框
			optionList: [],
			steps: [
				{ value: 1, label: '基本要素' },
				{ value: 2, label: '受理环节' },
				{ value: 3, label: '申请材料' },
				{ value: 4, label: '权力义务救济' },
				{ value: 5, label: '其它服务' },
				{ value: 6, label: '常见问题' }
			],
			formProps: {
				type: this.type,
				isReadonly: this.isReadonly,
				isAdd: this.isAdd
			}
		};
	},
	components: {
		BasicForm,
		AcceptForm,
		MaterForm,
		PowerForm,
		ServerForm,
		ProblemForm
	},
	methods: {
		/**
		 * 初始化
		 * @param {Number} id 表格ID
		 * @param {Boolean} isReadonly 是否只读，用来区分详情和新增/修改，表单是否可编辑
		 * @param {Boolean} isAdd 是否新增，主要用来是否显示步骤条和Tabs标题
		 *
		 */
		init(id, isReadonly, isAdd) {
			this.dataForm.id = id || 0;
			this.isReadonly = isReadonly || false;
			this.isAdd = isAdd || false;
			this.dataForm.audited_status = 0;
			this.active = 0;
			this.visible = true;
			this.activeName = '1';

			// 如果是公共服务，就把权力义务救济的Tab删除
			if (this.type === 2)
				this.steps = this.steps.filter(item => item.value != '4');

			this.$nextTick(() => {
				this.resetForm();
				this.getOptionList();
			});

			if (this.dataForm.id) {
				this.$http({
					url: this.$http.adornUrl(`/api/guide/info/${this.dataForm.id}`),
					method: 'get',
					params: this.$http.adornParams({
						type: this.type
					})
				}).then(({ data }) => {
					if (data && data.code === 0) {
						this.resetForm();
						this.dataForm = data.list;
					}
				});
			}
		},

		/**
		 * 获取所有表单的下拉框的数据
		 * 后台返回的数据请包括以下，格式为数组
		 * mouldOption - 选择模板的下拉框
		 * themeOption - 选择主题的下拉框
		 * matterOption - 选择事项的下拉框
		 * deptOption - 选择联办机构的下拉框
		 * orgOption - 选择实施机构的下拉框
		 * opaymentOption - 选择支付方式的下拉框
		 * expressOption - 选择物流快递的下拉框
		 * materOption - 选择材料的下拉框
		 */
		getOptionList() {
			this.$http({
				url: this.$http.adornUrl(`/api/guide/getOptionList`),
				method: 'post',
				params: this.$http.adornParams({
					type: this.type
				})
			}).then(({ data }) => {
				console.log('data', data);
				if (data && data.code === 0) {
					this.optionList = data.list;
				}
			});
		},

		/**
		 * 下一步，保存并继续
		 */
		handleNext() {
			this.isClose = false;
			this.save();
		},

		/**
		 * 下一步，保存并继续 - 切换Tabs
		 */
		toggleTabs() {
			if (this.active++ > this.steps.length - 2) this.active = 0;
			this.activeName = (this.active + 1).toString();
		},

		/**
		 * 点击切换Tabs
		 */
		handleClick(tab, event) {
			// console.log(tab, event);
		},

		/**
		 * 重置所有表单
		 */
		resetForm() {
			this.$refs.basicForm.reset();
			this.$refs.acceptForm.reset();
			this.$refs.materForm.reset();
			if (this.dataForm.type === 1) {
				this.$refs.powerForm.reset();
			}
			this.$refs.serverForm.reset();
			this.$refs.problemForm.reset();
		},

		/**
		 * 表单提交
		 */
		async dataFormSubmit() {
			// 获取每个表单的验证信息
			const validBasicForm = await this.$refs.basicForm.valid();
			const validAcceptForm = await this.$refs.acceptForm.valid();
			const validMatterForm = await this.$refs.materForm.valid();
			const validPowerForm =
				this.dataForm.type === 1 ? await this.$refs.powerForm.valid() : true;
			const validServerForm = await this.$refs.serverForm.valid();
			const validProblemForm = await this.$refs.problemForm.valid();

			if (
				validBasicForm &&
				validAcceptForm &&
				validMatterForm &&
				validPowerForm &&
				validServerForm &&
				validProblemForm
			) {
				this.isClose = true;
				this.save();
			}
		},

		/**
		 * 保存表单
		 */
		save() {
			console.log('id', this.dataForm.id);
			this.dataForm.type = this.type;

			// 当是公共服务时，赋一个默认值，免得报错，因为公共服务没有这个字段
			if (this.type === 2) this.dataForm.is_joint = 0;

			this.$http({
				url: this.$http.adornUrl(
					`/api/guide/${!this.dataForm.id ? 'save' : 'update'}`
				),
				method: 'post',
				data: this.$http.adornData(this.dataForm)
			}).then(({ data }) => {
				if (data && data.code === 0) {
					// 返回的id值用来实现保存并继续的功能
					this.dataForm.id = data.id;

					// 这个判断用来阻止最后一步保存的时候会切换一个空的Tabs
					if (!this.isClose) {
						this.toggleTabs();
					}

					this.$message({
						message: '保存成功',
						type: 'success',
						duration: 1500,
						onClose: () => {
							if (this.isClose) {
								this.visible = false;
								this.$emit('refreshDataList');
							}
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

<style lang="scss">
.add-new .el-tabs__header {
	display: none;
}

.el-tabs--border-card {
	box-shadow: none;
}

.el-tabs__item {
	height: 50px;
	line-height: 50px;
}

.el-tabs--border-card > .el-tabs__content {
	padding: 25px 25px 0;
}

.el-form-item__label {
	font-weight: bold;
}
</style>
