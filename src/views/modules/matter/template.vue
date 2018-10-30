/*
 * @Author: Jimmy
 * @Date: 2018-10-23
 * @Description: 事项清单的主页面
 * @Last Modified by:    
 * @Last Modified time: 
 */

<template>
  <div class="mod-matter">
		<!-- 搜索表单 -->
    <search v-bind="searchProps" :dataListSelections="dataListSelections" ref="search" @onRefresh="onRefresh" @onAdd="addOrUpdateHandle" @onAudit="auditHandle"></search>

    <el-table :data="dataList" v-loading="dataListLoading" @selection-change="selectionChangeHandle" border style="width: 100%;">
      <el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
      <el-table-column prop="type" width="80" label="类型">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.level === 0" size="small">主项</el-tag>
          <el-tag v-else-if="scope.row.level === 1" size="small" type="success">子项</el-tag>
          <el-tag v-else-if="scope.row.level === 2" size="small" type="info">办理项</el-tag>
        </template>
      </el-table-column>
      <table-tree-column prop="name" treeKey="id" parentKey="parent_id" label="事项名称"></table-tree-column>
      <el-table-column prop="encrypt" label="事项编码"> </el-table-column>
      <el-table-column prop="dept_name" label="实施机构"></el-table-column>
      <el-table-column prop="type_first" label="事项类别">
				<template slot-scope="scope">
          <span v-if="scope.row.type_first === 1">行政许可</span>
          <span v-else-if="scope.row.type_first === 2">公共服务</span>
        </template>
			</el-table-column>

      <el-table-column prop="audited_status" width="112" label="状态">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.audited_status === 0 && scope.row.level === 0" size="small" type="info">待提交</el-tag>
          <el-tag v-else-if="scope.row.audited_status === 1 && scope.row.level === 0" size="small" type="warning">等待初步核定</el-tag>
          <el-tag v-else-if="scope.row.audited_status === 2 && scope.row.level === 0" size="small" type="warning" hit>等待最终审定</el-tag>
          <el-tag v-else-if="scope.row.audited_status === 3 && scope.row.level === 0" size="small" type="success">已审定</el-tag>
					<el-tag v-else-if="scope.row.audited_status === 4 && scope.row.level === 0 && !scope.row.audited_reason" size="small" type="danger">初审驳回</el-tag>
					<el-tag v-else-if="scope.row.audited_status === 5 && scope.row.level === 0 && !scope.row.audited_reason" size="small" type="danger" hit>终审驳回</el-tag>
					
					<el-tooltip v-else-if="scope.row.audited_status === 4 && scope.row.level === 0 && scope.row.audited_reason" :content="scope.row.audited_reason" class="item" placement="top">
          	<el-tag size="small" type="danger">初审驳回 &nbsp;<i class="el-icon-warning"></i></el-tag>
					</el-tooltip>
					<el-tooltip v-else-if="scope.row.audited_status === 5 && scope.row.level === 0 && scope.row.audited_reason" :content="scope.row.audited_reason" class="item" placement="top">
          	<el-tag size="small" type="danger" hit>终审驳回 &nbsp;<i class="el-icon-warning"></i></el-tag>
					</el-tooltip>

					<el-tag v-else-if="scope.row.audited_status === 6 && scope.row.level === 0" size="small" type="success" hit>已发布</el-tag>
        </template>
      </el-table-column>
			
      <el-table-column width="178" label="操作">
        <template slot-scope="scope">
          <div class="button-set">
						<el-button v-if="isAuth(`${identif}:save`) && scope.row.level !== 2 && scope.row.audited_status === 0 && !isAudit" icon="el-icon-plus" size="mini" @click="addOrUpdateHandle(scope.row.id, false, scope.row.level, true)"></el-button>
						<el-button v-if="isAuth(`${identif}:submit`) && scope.row.level === 0 && scope.row.audited_status !== 6 && scope.row.audited_status !== 3 && !isAudit" icon="el-icon-check" size="mini" @click="initSubmitHandle(scope.row.id, 1)" 
							:disabled="scope.row.audited_status == 1 || scope.row.audited_status == 2"></el-button>
						<el-button v-if="isAuth(`${identif}:info`)" icon="el-icon-info" size="mini" @click="addOrUpdateHandle(scope.row.id, true, scope.row.level)"></el-button>
						<el-button v-if="isAuth(`${identif}:update`) && scope.row.audited_status !== 3 && scope.row.audited_status !== 6 && !isAudit" icon="el-icon-edit" size="mini" @click="addOrUpdateHandle(scope.row.id, false, scope.row.level)"></el-button>
						<el-button v-if="isAuth(`${identif}:delete`) && scope.row.audited_status !== 3 && scope.row.audited_status !== 6 && !isAudit" icon="el-icon-delete" size="mini" @click="deleteHandle(scope.row.id)"></el-button>
						<el-button v-if="isAuth(`${identif}:download`) && scope.row.level === 2" icon="el-icon-download" size="mini" @click="downloadHandle(scope.row.id)"></el-button>
					
						<el-button v-if="isAuth('admin:approved') && isAudit && scope.row.audited_status === 1" type="success" size="mini" @click="auditHandle(scope.row.id, 1)">核定</el-button>
						<el-button v-if="isAuth('admin:audit') && isAudit && scope.row.audited_status === 2" type="primary" size="mini" @click="auditHandle(scope.row.id, 2)">审定</el-button>
						<el-button v-if="isAuth('admin:publish') && isAudit && scope.row.audited_status === 3" type="primary" size="mini" @click="initSubmitHandle(scope.row.id, 6)">发布</el-button>
					</div>
				</template>
      </el-table-column>
    </el-table>

    <el-pagination
      @size-change="sizeChangeHandle"
      @current-change="currentChangeHandle"
      :current-page="pageIndex"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="pageSize"
      :total="totalPage"
      layout="total, sizes, prev, pager, next, jumper">
    </el-pagination>

    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>

		<!-- 弹窗, 核定 / 审定-->
    <audit v-if="auditVisible" :dataListSelections="dataListSelections" :identif="identif" ref="audit" @refreshDataList="getDataList"></audit>
  </div>
</template>

<script>
import TableTreeColumn from '@/components/table-tree-column';
import AddOrUpdate from './add-or-update';
import Audit from '../common/audit';
import Search from '../common/search';
import { treeDataTranslate } from '@/utils';

export default {
	props: {
		// type类型（0-全部、1-行政许可、2-公共服务）
		type: {
			type: Number,
			required: true
		},

		// 页面标识，用来区分每个页面的请求路径
		identif: {
			type: String,
			required: true
		},

		// 是否有权限审核，用来区分普通页面和审核页面
		isAudit: {
			type: Boolean,
			required: true
		}
	},
	data() {
		return {
			dataForm: {
				// 事项编码
				name: '',
				// 审核状态（0为待提交；1为等待初步核定；2为等待最终审定；3为已审定；4为初审驳回；5为终审驳回）
				audited_status: '',
				type_first: ''
			},
			dataList: [],
			dataListSelections: [],
			pageIndex: 1,
			pageSize: 20,
			totalPage: 0,
			dataListLoading: false,
			addOrUpdateVisible: false,
			auditVisible: false,
			searchProps: {
				type: this.type,
				identif: this.identif,
				isAudit: this.isAudit,
				dataForm: this.dataForm
			}
		};
	},
	components: {
		TableTreeColumn,
		AddOrUpdate,
		Search,
		Audit
	},
	activated() {
		this.getDataList();
	},
	methods: {
		/**
		 * 获取数据列表
		 */
		getDataList() {
			this.dataListLoading = true;
			this.$http({
				url: this.$http.adornUrl(`/api/${this.identif}/list`),
				method: 'get',
				params: this.$http.adornParams({
					page: this.pageIndex,
					limit: this.pageSize,
					name: this.dataForm.name,
					audited_status: this.dataForm.audited_status,
					type_first: this.dataForm.type_first,
					isAudit: this.isAudit // 是否审核页面
				})
			}).then(({ data }) => {
				if (data && data.code === 0) {
					this.dataList = treeDataTranslate(data.list, 'id', 'parent_id');
					this.totalPage = data.page.totalCount;
				} else {
					this.dataList = [];
					this.totalPage = 0;
				}
				this.dataListLoading = false;
			});
		},

		/**
		 * 每页数
		 * @param {Number} val 当前页数
		 */
		sizeChangeHandle(val) {
			this.pageSize = val;
			this.pageIndex = 1;
			this.getDataList();
		},

		/**
		 * 当前页
		 * @param {Number} val 当前页数
		 */
		currentChangeHandle(val) {
			this.pageIndex = val;
			this.getDataList();
		},

		/**
		 * 多选
		 * @param {Array} val 选择的数据ID
		 */
		selectionChangeHandle(val) {
			this.dataListSelections = val;
		},

		/**
		 * 新增 / 修改 / 详情
		 * @param {Number} id 当前指南的ID
		 * @param {Boolean} isReadonly 是否只读，用来区分详情和新增/修改，表单是否可编辑
		 */
		addOrUpdateHandle(id, isReadonly, level, isAdd) {
			this.addOrUpdateVisible = true;
			this.$nextTick(() => {
				this.$refs.addOrUpdate.init(id, isReadonly, level, isAdd);
			});
		},

		/**
		 * 初步提交审核 / 发布
		 * @param {Number} id 当前数据的ID
		 * @param {Number} status 要更新的状态
		 */
		initSubmitHandle(id, status) {
			// 这个赋值是把audit的组件激活，不然执行不了函数
			this.auditVisible = true;

			this.$confirm(
				`确定${status == 1 ? '提交' : '发布'}该事项清单吗?`,
				'提示',
				{
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}
			)
				.then(() => {
					this.$refs.audit.auditHandle(id, status, '');
				})
				.catch(() => {});
		},

		/**
		 * 核定 / 审定
		 * @description 将当前参数传给审核的弹窗
		 * @param {Number} id 当前指南的ID
		 * @param {Number} type 1-核定、2-审定
		 */
		auditHandle(id, type) {
			this.auditVisible = true;
			this.$nextTick(() => {
				this.$refs.audit.init(id, type);
			});
		},

		/**
		 * 刷新表单
		 * @param {Object} val 搜索表单的数据
		 */
		onRefresh(val) {
			this.dataForm = val;
			this.getDataList();
		},

		/**
		 * 提交审核
		 * @param {Number} id 当前数据的ID
		 * @param {String} status 要更新的审核状态
		 * @param {String} reason 要更新的驳回原因
		 */
		onAudit(id, status, reason) {
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
							this.getDataList();
							this.auditVisible = false;
						}
					});
				} else {
					this.$message.error(data.msg);
				}
			});
		},

		/**
		 * 删除 / 批量删除
		 * @param {Number} id 当前数据的ID
		 */
		deleteHandle(id) {
			this.$nextTick(() => {
				this.$refs.search.deleteHandle(id);
			});
		},

		/**
		 * TODO:下载
		 * @param {Number} id 当前数据的ID
		 */
		downloadHandle(id) {}
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
