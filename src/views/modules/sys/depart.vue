<template>
    <div class="mod-depart">
        <el-form :inline="true" :model="dataForm"  @keyup.enter.native="fetchDataList()">
            <el-form-item>
                <el-input v-model="dataForm.name" placeholder="请输入部门名称或组织机构代码" clearable></el-input>
            </el-form-item>
            <el-form-item>
                <el-button icon="el-icon-search" type="primary" @click="fetchDataList()">搜索</el-button>
                <el-button icon="el-icon-circle-plus-outline" type="success" @click="addOrUpdateHandle()">新增</el-button>
                <el-button icon="el-icon-delete" type="warning" @click="deleteHandle()" :disabled="dataListSelections.length<=0">批量删除</el-button>
            </el-form-item>
        </el-form>
        <!-- table表格 -->
        <table-component url="/sys/depart" :tableHeader="tableHeader" ref="tableComponent"
        :pathParams="dataForm" @selectionChangeHandle="selectionChangeHandle" @buttonEven="buttonEven"></table-component>
         <!-- 弹窗, 新增 / 修改/详情 -->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="fetchDataList"></add-or-update>
    </div>
</template>

<script>
import AddOrUpdate from './depart-add-or-update';
import TableComponent from '../common/tableComponent';
export default {
	data() {
		return {
			tableHeader: [
				{ prop: 'name', label: '部门名称', sortable: 'custom' },
				{ prop: 'code', label: '组织机构代码', sortable: 'custom' },
				{ prop: 'level', label: '部门层级', sortable: 'custom' },
				{ prop: 'areaName', label: '所属行政区划', sortable: 'custom' },
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
		TableComponent,
		AddOrUpdate
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
				console.log('id', row.id);
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
			var departIds = id
				? [id]
				: this.dataListSelections.map(item => {
						return item.id;
				  });
			this.$confirm(`确定进行[${id ? '删除' : '批量删除'}]操作?`, '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			})
				.then(() => {
					this.$http({
						url: this.$http.adornUrl('/sys/depart/delete'),
						method: 'post',
						data: this.$http.adornData(departIds, false)
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