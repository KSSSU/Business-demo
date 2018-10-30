<template>
  <el-form :inline="true" :model="dataForm" @keyup.enter.native="refreshHandle()">
    <el-form-item>
      <el-input v-model="dataForm.name" placeholder="请输入事项名称或代码" clearable></el-input>
    </el-form-item>
    <el-form-item v-if="isShowSearchStatus">
      <el-select v-model="dataForm.audited_status" placeholder="状态" clearable>
        <el-option
          v-for="item in statusOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item>
      <el-select v-model="dataForm.type_first" placeholder="事项类别" clearable v-if="type == 0">
        <el-option label="行政许可" value="1"></el-option>
        <el-option label="公共服务" value="2"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item>
      <el-button @click="refreshHandle()">搜索</el-button>
      <el-button v-if="isAuth(`${identif}:save`) && !isAudit && !isIssued" type="primary" @click="addOrUpdateHandle(0,false,true)">新增</el-button>
      <el-button v-if="isAuth(`${identif}:delete`) && !isAudit" type="danger" @click="deleteHandle()" :disabled="dataListSelections.length <= 0">批量删除</el-button>
      <el-button v-if="isAuth(`admin:approved`) && isAudit" type="success" @click="auditHandle(undefined,1)" :disabled="dataListSelections.length <= 0">批量核定</el-button>
      <el-button v-if="isAuth(`admin:audit`) && isAudit" type="primary" @click="auditHandle(undefined,2)" :disabled="dataListSelections.length <= 0">批量审定</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
	props: {
		type: { type: Number },
		identif: { type: String },
		isAudit: { type: Boolean },
		isIssued: { type: Boolean },
		isShowSearchStatus: { type: Boolean },
		dataForm: {
			type: Object,
			default: function() {
				return { name: '', audited_status: '', type_first: '' };
			}
		},
		dataListSelections: {
			type: Array,
			default: function() {
				return [];
			}
		}
	},
	data() {
		return {
			statusOptions: [
				{
					value: 0,
					label: '待提交'
				},
				{
					value: 1,
					label: '等待初步核定'
				},
				{
					value: 2,
					label: '等待最终审定'
				},
				{
					value: 3,
					label: '已审定'
				},
				{
					value: 4,
					label: '初审驳回'
				},
				{
					value: 5,
					label: '终审驳回'
				}
			]
		};
	},
	activated() {
		this.init();
	},
	methods: {
		/**
		 * 初始化
		 */
		init() {
			if (this.type === 0)
				this.statusOptions = this.statusOptions.filter(item => item.value != 0);
		},

		/**
		 * 刷新父组件列表
		 * @description 将搜索的表单数据回传给父组件
		 */
		refreshHandle() {
			this.$emit('onRefresh', this.dataForm);
		},

		/**
		 * 新增
		 * @description 将搜索的表单数据回传给父组件
		 * @param {Number} id 当前指南的ID
		 * @param {Boolean} isReadonly 是否只读，用来区分详情和新增/修改，表单是否可编辑
		 * @param {Boolean} isAdd 是否新增
		 */
		addOrUpdateHandle(id, isReadonly, isAdd) {
			this.$emit('onAdd', id, isReadonly, isAdd);
		},

		/**
		 * 批量核定 / 审定
		 * @description 将搜索的表单数据回传给父组件
		 * @param {Number} id 当前数据的ID
		 * @param {Number} type 1-核定、2-审定
		 */
		auditHandle(id, type) {
			this.$emit('onAudit', id, type);
		},

		/**
		 * 删除 / 批量删除
		 * @param {Number} id 当前指南的ID
		 */
		deleteHandle(id) {
			var ids = id
				? [id]
				: this.dataListSelections.map(item => {
						return item.id;
				  });
			this.$confirm(
				`确定对[id=${ids.join(',')}]进行[${id ? '删除' : '批量删除'}]操作?`,
				'提示',
				{
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}
			)
				.then(() => {
					this.$http({
						url: this.$http.adornUrl(`/api/${this.identif}/delete`),
						method: 'post',
						data: this.$http.adornData(ids, false)
					}).then(({ data }) => {
						if (data && data.code === 0) {
							this.$message({
								message: '操作成功',
								type: 'success',
								duration: 1500,
								onClose: () => {
									this.refreshHandle();
								}
							});
						} else {
							this.$message.error(data.msg);
						}
					});
				})
				.catch(() => {});
		}
	}
};
</script>

