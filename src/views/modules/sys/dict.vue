<template>
  <div class="mod-dict">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="fetchDataList()">
      <el-form-item>
        <el-input v-model="dataForm.name" placeholder="输入字典名称" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="fetchDataList()" icon="el-icon-search" type="primary">搜索</el-button>
        <el-button  icon="el-icon-circle-plus-outline" type="success" @click="addOrUpdateHandle()">新增</el-button>
      </el-form-item>
    </el-form>
    <!-- table表格 -->
     <table-component ref="tableComponent" 
     url="/sys/dict/list" :pathParams="dataForm"
      :tableHeader="tableHeader" @selectionChangeHandle="selectionChangeHandle"
      @buttonEven="buttonEven"></table-component>
    <!-- 弹窗, 新增 / 修改/详情 -->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="fetchDataList"></add-or-update>
  </div>
</template>

<script>
import AddOrUpdate from './dict-add-or-update';
import TableComponent from '../common/tableComponent';
export default {
	data() {
		return {
			tableHeader: [
				{ prop: 'name', label: '字典名称' },
				{ prop: 'value', label: '字典号' },
				{
					prop: 'oper',
					label: '操作',
					minWidth: '150',
					oper: [
						{ name: '详情', buttonIcon: 'el-icon-warning', clickFun: 'detail' },
						{ name: '编辑', buttonIcon: 'el-icon-edit', clickFun: 'update' },
						{ name: '删除', buttonIcon: 'el-icon-delete', clickFun: 'detele' }
					]
				}
			],
			dataForm: {
				name: ''
			},
			dataListSelections: [],
			addOrUpdateVisible: false
		};
	},
	components: {
		AddOrUpdate,
		TableComponent
	},
	methods: {
		//查询
		fetchDataList() {
			this.$nextTick(() => {
				this.$refs['tableComponent'].getDataList();
			});
		},
		// 多选
		selectionChangeHandle(val) {
			this.dataListSelections = val;
		},
		//按钮事件
		buttonEven(even, row) {
			if (even == 'detail') {
				//详情
				this.addOrUpdateHandle(row.id, true);
			} else if (even == 'update') {
				//编辑
				this.addOrUpdateHandle(row.id, false);
			} else {
				//删除
				this.deleteHandle(row.id);
			}
		},
		// 新增 / 修改
		addOrUpdateHandle(id, isReadOnly) {
			this.addOrUpdateVisible = true;
			this.$nextTick(() => {
				this.$refs.addOrUpdate.init(id, isReadOnly);
			});
		},
		// 删除
		deleteHandle(id) {
			var dictIds = id
				? [id]
				: this.dataListSelections.map(item => {
						return item.id;
				  });
			this.$confirm(`确定进行[${dictIds ? '删除' : '批量删除'}]操作?`, '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			})
				.then(() => {
					this.$http({
						url: this.$http.adornUrl('/sys/user/delete'),
						method: 'post',
						data: this.$http.adornData(dictIds, false)
					}).then(({ data }) => {
						if (data && data.code === 0) {
							this.$message({
								message: '操作成功',
								type: 'success',
								duration: 1500,
								onClose: () => {
									this.fetchDataList();
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
