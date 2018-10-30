/*
 * @Author: Jimmy
 * @Date: 2018-10-23
 * @Description: 审核管理(弹窗)
 * @Last Modified by:    
 * @Last Modified time: 
 */

<template>
	<el-dialog
			:top="'20vh'"
			:width="'400px'"
			:title="auditType === 1 ? '确认通过核定' : '确认通过审定'"
			:close-on-click-modal="false"
			:visible.sync="visible">

		<el-form :model="dataForm" :rules="dataRule" ref="dataForm">
			<el-form-item label="" prop="audited_status" label-width="0">
				<el-radio-group v-model="dataForm.audited_status">
					<el-radio label="2" v-if="auditType === 1">审核通过</el-radio>
					<el-radio label="3" v-if="auditType === 2">审核通过</el-radio>
					<el-radio label="4" v-if="auditType === 1">驳回</el-radio>
					<el-radio label="5" v-if="auditType === 2">驳回</el-radio>
				</el-radio-group>
			</el-form-item>

			<el-form-item label="" prop="audited_reason" v-if="dataForm.audited_status == 4 || dataForm.audited_status == 5">
				<el-input type="textarea" v-model="dataForm.audited_reason" placeholder="请输入驳回原因"></el-input>
			</el-form-item>
		</el-form>

		<span slot="footer" class="dialog-footer">
			<el-button @click="visible = false">取消</el-button>
			<el-button type="primary" @click="onSubmit()">确定</el-button>
		</span>
	</el-dialog>
</template>

<script>
export default {
	props: {
		identif: { type: String },
		dataListSelections: {
			type: Array,
			default: function() {
				return [];
			}
		}
	},
	data() {
		return {
			id: 0,
			auditType: '',
			visible: false,
			dataForm: {
				audited_status: '',
				audited_reason: ''
			},
			dataRule: {
				audited_status: [
					{ required: true, message: '请选择', trigger: 'change' }
				],
				audited_reason: [{ required: true, message: '必填', trigger: 'change' }]
			}
		};
	},
	methods: {
		/**
		 * 初始化
		 * @param {Number} id 数据ID
		 * @param {Number} auditType 审核的类型 (1-核定、2-审定)
		 *
		 */
		init(id, auditType) {
			this.id = id;
			this.visible = true;
			this.auditType = auditType;

			this.$nextTick(() => {
				this.$refs['dataForm'].resetFields();
			});
		},

		/**
		 * 验证表单
		 *
		 */
		onSubmit() {
			this.$refs['dataForm'].validate(valid => {
				if (valid) {
					this.auditHandle(
						this.id,
						this.dataForm.audited_status,
						this.dataForm.audited_reason
					);
				}
			});
		},

		/**
		 * 提交审核
		 * @param {Number} id 当前数据的ID
		 * @param {String} status 要更新的审核状态
		 * @param {String} reason 要更新的驳回原因
		 */
		auditHandle(id, status, reason) {
			let ids = id
				? [id]
				: this.dataListSelections.map(item => {
						return item.id;
				  });

			this.$http({
				url: this.$http.adornUrl(`/api/${this.identif}/submit`),
				method: 'post',
				data: this.$http.adornData(
					{ ids: ids, status: status, reason: reason },
					false
				)
			}).then(({ data }) => {
				if (data && data.code === 0) {
					this.$message({
						message: '操作成功',
						type: 'success',
						duration: 1500,
						onClose: () => {
							this.$emit('refreshDataList');
							this.visible = false;
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

