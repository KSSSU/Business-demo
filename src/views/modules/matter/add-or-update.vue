/*
 * @Author: Jimmy
 * @Date: 2018-10-23
 * @Description: 事项清单的新增 / 修改 / 详情 弹出框页面
 * @Last Modified by:    
 * @Last Modified time: 
 */

<template>
  <el-dialog
		:top="'10vh'"
		:width="'800px'"
    :title="!dataForm.id || isAdd ? '新建事项清单' : isReadonly ? '事项清单详情' : '修改事项清单'"
    :close-on-click-modal="false"
    :visible.sync="visible">

		<el-form :model="dataForm" :rules="isReadonly ? {} : dataRule" ref="dataForm" label-width="120px">
			<el-row :gutter="20">
				<el-col :span="12">
					<el-form-item label="实施机构名称" prop="dept_id">
						<el-select v-model="dataForm.dept_id" placeholder="请选择" :disabled="isReadonly || isAdd && level === 0 || level === 1 || level === 2" clearable style="width:100%">
							<el-option v-for="item in deptOption" :key="item.value" :label="item.label" :value="item.value"></el-option>
						</el-select>
						<!-- <el-input v-model="dataForm.dept_id" placeholder="请输入实施机构" :readonly="isReadonly"></el-input> -->
					</el-form-item>
				</el-col>
			</el-row>

			<el-row :gutter="20">
				<el-col :span="12">
					<el-form-item label="事项类型" prop="type">
						<el-cascader :options="options" v-model="dataForm.type"	@change="handleChange" :disabled="isReadonly || isAdd && level === 0 || level === 1 || level === 2" style="width:100%"></el-cascader>
					</el-form-item>
				</el-col>
			</el-row>

			<el-row :gutter="20">
				<el-col :span="12">
					<el-form-item label="事项名称" prop="matter_name">
						<el-input v-model="dataForm.matter_name" placeholder="根据最低级项名默认生成" :disabled="true"></el-input>
					</el-form-item>
				</el-col>
				<el-col :span="12">
					<el-form-item label="事项基本编码" prop="encrypt">
						<el-input v-model="dataForm.encrypt" placeholder="由主项、子项和事项类型码生成" :disabled="true"></el-input>
					</el-form-item>
				</el-col>
			</el-row>

			<el-row :gutter="20">
				<el-col :span="12">
					<el-form-item label="主项名称" prop="name">
						<el-input v-model="dataForm.name" placeholder="" :disabled="isReadonly || (isAdd && level === 0) || level === 1 || level === 2"></el-input>
					</el-form-item>
				</el-col>
				<el-col :span="12">
					<el-form-item label="主项代码" prop="code">
						<el-input v-model="dataForm.code" placeholder="请输入5位代码" :disabled="isReadonly || (isAdd && level === 0) || level === 1 || level === 2"></el-input>
					</el-form-item>
				</el-col>
			</el-row>

			<el-row :gutter="20" v-if="isAdd && (level === 0 || level === 1) || level === 1 || level === 2">
				<el-col :span="12">
					<el-form-item label="子项名称" prop="child_name">
						<el-input v-model="dataForm.child_name" placeholder="" :disabled="isReadonly || (isAdd && level === 1) || level === 2"></el-input>
					</el-form-item>
				</el-col>
				<el-col :span="12">
					<el-form-item label="子项代码" prop="child_code">
						<el-input v-model="dataForm.child_code" placeholder="请输入3位代码，若没有请填‘000’" :disabled="isReadonly || (isAdd && level === 1) || level === 2"></el-input>
					</el-form-item>
				</el-col>
			</el-row>

			<el-row :gutter="20" v-if="isAdd && level === 1 || level === 2">
				<el-col :span="12">
					<el-form-item label="办理项名称" prop="item_name">
						<el-input v-model="dataForm.item_name" placeholder="" :disabled="isReadonly"></el-input>
					</el-form-item>
				</el-col>
				<el-col :span="12">
					<el-form-item label="办理项代码" prop="item_code">
						<el-input v-model="dataForm.item_code" placeholder="请输入2位代码，若没有请填‘00’" :disabled="isReadonly"></el-input>
					</el-form-item>
				</el-col>
			</el-row>
		</el-form>

    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">{{isReadonly ? '关闭' : '取消'}}</el-button>
      <el-button type="primary" @click="dataFormSubmit()" v-if="!isReadonly">保存</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
	data() {
		return {
			visible: false,
			isReadonly: false,
			level: '',
			isAdd: false,
			dataForm: {
				dept_id: '',
				type: [],
				matter_name: '',
				encrypt: '',
				name: '',
				code: '',
				child_name: '',
				child_code: '000',
				item_name: '',
				item_code: '00'
			},
			dataRule: {},
			options: [
				{
					value: '1',
					label: '行政权力',
					children: [
						{
							value: '3',
							label: '行政许可'
						},
						{
							value: '4',
							label: '行政处罚'
						}
					]
				},
				{
					value: '2',
					label: '公共服务',
					children: [
						{
							value: '5',
							label: '基本公共服务'
						},
						{
							value: '6',
							label: '社会保险'
						}
					]
				}
			],
			deptOption: []
		};
	},
	components: {},
	methods: {
		/**
		 * 初始化
		 * @param {Number} id 表格ID
		 * @param {Boolean} isReadonly 是否只读，用来区分详情和新增/修改，表单是否可编辑
		 *
		 */
		init(id, isReadonly, level, isAdd) {
			this.dataForm.id = id || 0;
			this.isReadonly = isReadonly || false;
			this.level = level;
			this.isAdd = isAdd;
			this.visible = true;

			this.$nextTick(() => {
				this.$refs['dataForm'].resetFields();
				this.getOptionList();
			});

			this.getInfo();
		},

		/**
		 * 获取详情信息
		 *
		 */
		getInfo() {
			if (this.dataForm.id) {
				this.$http({
					url: this.$http.adornUrl(`/api/matter/info/${this.dataForm.id}`),
					method: 'get',
					params: this.$http.adornParams({
						type: this.type
					})
				}).then(({ data }) => {
					if (data && data.code === 0) {
						this.dataForm = data.list;
						this.dataForm.type = [
							this.dataForm.type_first.toString(),
							this.dataForm.type_second.toString()
						];
					}
				});
			}
		},

		getOptionList() {
			this.$http({
				url: this.$http.adornUrl(`/api/matter/getOptionList`),
				method: 'post',
				params: this.$http.adornParams({
					type: this.type
				})
			}).then(({ data }) => {
				console.log('data', data);
				if (data && data.code === 0) {
					this.deptOption = data.list.deptOption;
				}
			});
		},

		handleChange() {},

		/**
		 * 提交表单
		 *
		 */
		dataFormSubmit() {
			this.$refs['dataForm'].validate(valid => {
				if (valid) {
					// 事项类别的数组形式分成两个字段保存
					this.dataForm.type_first = this.dataForm.type[0];
					this.dataForm.type_second = this.dataForm.type[1];

					// 只有新增子项或办理项时，才将id清空
					if (this.isAdd && (this.level === 0 || this.level === 1)) {
						this.dataForm.parent_id = this.dataForm.id;
						this.dataForm.id = '';
					}

					this.$http({
						url: this.$http.adornUrl(
							`/api/matter/${!this.dataForm.id ? 'save' : 'update'}`
						),
						method: 'post',
						data: this.$http.adornData(this.dataForm)
					}).then(({ data }) => {
						if (data && data.code === 0) {
							this.$message({
								message: '操作成功',
								type: 'success',
								duration: 1500,
								onClose: () => {
									this.visible = false;
									this.$emit('refreshDataList');
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
