<template>
  <div class="mod-menu">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item>
        <el-input  v-model="dataForm.name"  placeholder="输入名称" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="getDataList()">搜索</el-button>
        <el-button type="success" icon="el-icon-circle-plus" @click="addOrUpdateHandle()">新增</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="dataList" border style="width: 100%;">
      <table-tree-column prop="name" treeKey="menuId" label="名称"></table-tree-column>
      <el-table-column prop="parentName" label="链接"></el-table-column>
      <el-table-column prop="orderNum" label="排序"></el-table-column>      
      <el-table-column prop="orderNum" label="创建时间"></el-table-column> 
      <el-table-column width="114" label="操作">
        <template slot-scope="scope">
          <div class="button-set">
            <el-button  icon="el-icon-circle-plus" size="mini"  @click="addOrUpdateHandle(scope.row.parentName,'')"></el-button>
            <el-button  icon="el-icon-edit" size="mini"  @click="addOrUpdateHandle('',scope.row.menuId)"></el-button>
            <el-button  icon="el-icon-delete" size="mini"  @click="deleteHandle(scope.row.menuId)"></el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
  </div>
</template>

<script>
import TableTreeColumn from '@/components/table-tree-column';
import AddOrUpdate from './menu-add-or-update';
import { treeDataTranslate } from '@/utils';
export default {
	data() {
		return {
			dataForm: {
				name: ''
			},
			dataList: [],
			dataListLoading: false,
			addOrUpdateVisible: false
		};
	},
	components: {
		TableTreeColumn,
		AddOrUpdate
	},
	activated() {
		this.getDataList();
	},
	methods: {
		// 获取数据列表
		getDataList() {
			this.dataListLoading = true;
			this.$http({
				url: this.$http.adornUrl('/sys/menu/list'),
				method: 'get',
				params: this.$http.adornParams({
					name: this.dataForm.name
				})
			}).then(({ data }) => {
				this.dataList = treeDataTranslate(data, 'menuId');
				this.dataListLoading = false;
			});
		},
		// 新增 / 修改
		addOrUpdateHandle(row, id) {
			this.addOrUpdateVisible = true;
			this.$nextTick(() => {
				this.$refs.addOrUpdate.init(row, id);
			});
		},
		// 删除
		deleteHandle(id) {
			this.$confirm(`确定进行[删除]操作?`, '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			})
				.then(() => {
					this.$http({
						url: this.$http.adornUrl(`/sys/menu/delete/${id}`),
						method: 'post',
						data: this.$http.adornData()
					}).then(({ data }) => {
						if (data && data.code === 0) {
							this.$message({
								message: '操作成功',
								type: 'success',
								duration: 1500,
								onClose: () => {
									this.getDataList();
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

<style lang="scss">
.button-set .el-button {
	padding: 7px;
}

.button-set .el-button + .el-button {
	margin: 0;
}
</style>
