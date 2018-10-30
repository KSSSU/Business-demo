<template>
  <div class="mod-menu">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item>
        <el-input  v-model="dataForm.name"  placeholder="请输入行政区划名称或代码" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="getDataList()">搜索</el-button>
        <el-button type="success" icon="el-icon-circle-plus" @click="addOrUpdateHandle()">新增</el-button>
        <el-button type="warning" icon="el-icon-circle-plus" @click="deleteHandle()" :disabled="dataListSelections.length<=0">批量删除</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="dataList" border style="width: 100%;" @selection-change="selectionChangeHandle">
      <el-table-column  align="center" type="selection"></el-table-column>
      <table-tree-column prop="code" treeKey="id" label="行政区划代码"></table-tree-column>
      <el-table-column prop="name" label="行政区划名称"></el-table-column>
      <el-table-column prop="comLevel" label="行政区划级别"></el-table-column>      
      <el-table-column prop="parentName" label="上级行政区划"></el-table-column> 
      <el-table-column width="114" label="操作">
        <template slot-scope="scope">
          <div class="button-set">
            <el-button  icon="el-icon-circle-plus" size="mini" @click="addOrUpdateHandle(scope.row,'children')"></el-button>
            <el-button  icon="el-icon-edit" size="mini"  @click="addOrUpdateHandle(scope.row,'update')"></el-button>
            <el-button  icon="el-icon-delete" size="mini" @click="deleteHandle(scope.row.id)"></el-button>
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
import AddOrUpdate from './area-add-or-update';
import { treeDataTranslate } from '@/utils';
export default {
	data() {
		return {
			dataForm: {
				name: ''
			},
			dataList: [],
			dataListLoading: false,
			addOrUpdateVisible: false,
			dataListSelections: []
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
				url: this.$http.adornUrl('/sys/area/list'),
				method: 'get',
				params: this.$http.adornParams({
					name: this.dataForm.name
				})
			}).then(({ data }) => {
				this.dataList = treeDataTranslate(data, 'id');
				this.dataListLoading = false;
			});
		},
		//多选触发
		selectionChangeHandle(val) {
			this.dataListSelections = val;
		},
		// 新增 / 修改
		addOrUpdateHandle(id, handle) {
			this.addOrUpdateVisible = true;
			this.$nextTick(() => {
				this.$refs.addOrUpdate.init(id, handle);
			});
		},
		// 删除
		deleteHandle(id) {
			var itemIds = id
				? [id]
				: this.dataListSelections.map(item => {
						return item.id;
				  });
			this.$confirm(`确定进行${id ? '删除' : '批量删除'}操作?`, '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			})
				.then(() => {
					this.$http({
						url: this.$http.adornUrl('/sys/menu/delete/'),
						method: 'post',
						data: this.$http.adornData(itemIds, false)
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
