/*
 * @Author: Jimmy
 * @Date: 2018-10-18
 * @Description: 办事指南的新增 / 删除 / 详情 弹出框 - 申请材料(表单)
 * @Last Modified by:    
 * @Last Modified time: 
 */

<template>
  <el-form :model="dataForm" :rules="isReadonly ? {} : dataRule" ref="dataForm" label-width="110px">
		<el-form-item label="选择材料" prop="mater_id">
			<el-select v-model="dataForm.mater_id" placeholder="请选择" :disabled="isReadonly" @change="getMaterList" multiple filterable style="width: 100%">
				<el-option v-for="item in options.materOption" :key="item.value" :label="item.label" :value="item.value"></el-option>
			</el-select>
    </el-form-item>

		<el-table :data="materList" v-if="materList && materList.length > 0" v-loading="dataListLoading" border style="width: 100%; margin-bottom: 25px;">
      <el-table-column type="index" header-align="center" align="center" width="60"></el-table-column>
      <el-table-column prop="name" label="材料名称"></el-table-column>
      <el-table-column prop="format" label="材料规格"> </el-table-column>
      <el-table-column prop="orig_num" label="原件份数"></el-table-column>
      <el-table-column prop="copy_num" label="复印件份数"></el-table-column>
    </el-table>

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
			materList: [],
			dataListLoading: false,
			dataRule: {
				mater_id: [
					{
						required: true,
						type: 'array',
						message: '请选择',
						trigger: 'change'
					}
				]
			}
		};
	},
	watch: {
		/**
		 * 监听表单dataForm的变化，如果值变化了就把材料列表更新
		 */
		dataForm: function() {
			this.getMaterList();
		}
	},
	methods: {
		/**
		 * 重置表单
		 */
		reset() {
			this.materList = [];
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
		 * 获取材料列表
		 * @param {Array} val 选中时的ID数组集合
		 * @description 根据选择材料的下拉框的值，显示材料列表
		 */
		getMaterList(val) {
			val = val ? val : this.dataForm.mater_id;
			this.materList = [];

			if (val.length > 0) {
				for (let i = 0; i < val.length; i++) {
					const temp = this.options.materOption.filter(
						item => item.id == val[i]
					);
					this.materList = this.materList.concat(temp);
				}
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
