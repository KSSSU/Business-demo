<template>
    <div>
         <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
              <el-form-item>
                  <el-input v-model="dataForm.name" placeholder="请输入主题事项的名称" clearable></el-input>

              </el-form-item>

              <el-form-item>
                   <el-select  placeholder="=审核状态=" v-model="dataForm.auditedStatus">
                     <el-option label="待提交" value="1"></el-option>
                     <el-option label="等待审核" value="2"></el-option>
                     <el-option label="审核通过" value="3"></el-option>
                     <el-option label="审核驳回" value="4"></el-option>
                    </el-select> 
              </el-form-item>

              <el-form-item>
                   <el-button type="primary" icon="el-icon-search" @click="getDataList()">搜索</el-button>
                   <el-button type="success" icon="el-icon-circle-plus-outline" @click="handle()" v-if="themName=='theme'">新增</el-button>
                   <el-button type="warning" icon="el-icon-delete" :disabled="dataListSelections.length<=0" @click="deleteHandle()" v-if="themName=='theme'">批量删除</el-button>
                   <el-button type="warning" icon="el-icon-delete" :disabled="dataListSelections.length<=0" @click="audits()" v-if="themName=='audits'">批量审核</el-button>
              </el-form-item>

         </el-form>
         
          <el-table border v-loading="loading" :data="tableDate"   @selection-change="selectionChangeHandle" @sort-change="sortChange">
                <el-table-column type="selection"  width="55" align="center"></el-table-column>
                <el-table-column label="主题名称" prop="name" sortable="custom"> </el-table-column>
                <el-table-column label="牵头机构" prop="leadDept" sortable="custom"> </el-table-column>
                <el-table-column label="实施机构" prop="deptNames" sortable="custom"> </el-table-column>
                <el-table-column label="办事结果" prop="auditedReason" > </el-table-column>
                <el-table-column label="审核状态" prop="auditedStatus" > </el-table-column>
                <el-table-column label="操作"  width="148">
                <template slot-scope="scope">
                  <div class="button-set">
                    <el-button icon="el-icon-circle-check" size="mini" @click="flowChartShow(scope.row.childrenData)" v-if="themName=='theme'&&scope.row.auditedStatus==2"></el-button> 
                    <el-button icon="el-icon-circle-check" size="mini" @click="themSubmit(scope.row.id)" v-if="themName=='theme'&&scope.row.auditedStatus!=2"></el-button>   
                    <el-button icon="el-icon-warning" size="mini" @click="handle(scope.row.id,true)"></el-button>   
                    <el-button icon="el-icon-edit" size="mini" @click="handle(scope.row.id,false)" v-if="themName=='theme'"></el-button>   
                    <el-button icon="el-icon-delete" size="mini" @click="deleteHandle(scope.row.id)" v-if="themName=='theme'"></el-button> 
                    <el-button icon="el-icon-check" size="mini" @click="audits(scope.row.id)" v-if="themName=='audits'"></el-button>       
                  </div>
                 </template>
                </el-table-column >
          </el-table>
     <el-pagination @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="page.pageIndex"
                    :page-sizes="[10, 25, 50, 100]"
                    :page-size="page.pageSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="page.totalPage">
      </el-pagination> 
    <!-- 弹窗, 新增 / 修改/详情 -->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList()"></add-or-update>
    <!-- 流程图 -->
    <flow-chart v-if="flowChartVisible" ref="FlowChart" ></flow-chart>
    <!-- 审核 -->
    <el-dialog width="30%" :visible.sync="auditsvisible" :title="auditsTitle" center>
       <el-form :rules="auditsRules" :model="auditsForm" ref="auditsForm">
         <el-form-item prop="auditedStatus">
           <el-radio v-model="auditsForm.auditedStatus" label="1" >审核通过</el-radio>
         </el-form-item>
         <el-form-item prop="auditedStatus">
           <el-radio  v-model="auditsForm.auditedStatus" label="2" >驳回</el-radio>
         </el-form-item>
         <el-form-item prop="auditedReason" v-if="auditsForm.auditedStatus==2">
           <el-input type="textarea" :rows="3" placeholder="请输入驳回原因" v-model="auditsForm.auditedReason"></el-input>
         </el-form-item>
       </el-form>
      <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="updateAudits()">保存</el-button>
      <el-button @click="auditsvisible = false">关闭</el-button>
    </span>
    </el-dialog>
    </div>
</template>




<script>
import TableComponent from '../common/tableComponent';
import AddOrUpdate from './matter-handle';
import FlowChart from './matter-FlowChart';
export default {
	data() {
		return {
			dataForm: {
				name: '',
				auditedStatus: ''
			},
			tableDate: [],
			loading: false,
			page: {
				pageIndex: 1,
				pageSize: 10,
				totalPage: 0
			},
			order: '',
			prop: '',
			addOrUpdateVisible: false,
			flowChartVisible: false,
			dataListSelections: [],
			//审核
			auditsvisible: false,
			auditsTitle: '',
			auditsForm: {
				auditedStatus: '',
				auditedReason: '',
				id: []
			},
			auditsRules: {
				auditedReason: [{ required: true, message: '必填', trigger: blur }]
			}
		};
	},
	props: ['themName'],
	components: {
		AddOrUpdate,
		FlowChart
	},
	activated() {
		this.getDataList();
	},
	methods: {
		//搜索
		getDataList() {
			this.loading = true;
			this.$http({
				url: this.$http.adornUrl(
					`/matterService/matter/${
						this.themName == 'theme' ? 'info' : 'status'
					}`
				),
				method: 'get',
				params: this.$http.adornParams({
					curryPage: this.page.pageIndex,
					pageSize: this.page.pageSize,
					prop: this.prop,
					order: this.order,
					name: this.dataForm.name,
					auditedStatus: this.dataForm.auditedStatus
				})
			}).then(({ data }) => {
				if (data && data.code === 0) {
					this.tableDate = data.page.list;
					this.page.totalPage = data.page.totalCount;
				} else {
					this.tableDate = [];
					this.page.totalPage = 0;
				}
			});
			this.loading = false;
		},
		//每页数改变时触发
		handleSizeChange(val) {
			this.pageSize = val;
			this.pageIndex = 1;
			this.getDataList();
		},
		//当前页改变时触发
		handleCurrentChange(val) {
			this.pageIndex = val;
			this.getDataList();
		},
		//表格排序
		sortChange(column, prop, order) {
			this.prop = column.prop;
			this.order = column.order;
			if (order !== 'descending') {
				this.order = 'asc';
			} else {
				this.order = 'desc';
			}
			this.getDataList();
			return false;
		},
		//多选触发
		selectionChangeHandle(val) {
			this.dataListSelections = val;
		},
		//新增/修改/详情
		handle(id, isReadOnly) {
			this.addOrUpdateVisible = true;
			this.$nextTick(() => {
				this.$refs.addOrUpdate.init(id, isReadOnly);
			});
		},

		//删除用户
		deleteHandle(id) {
			var itemIds = id
				? [id]
				: this.dataListSelections.map(item => {
						return item.id;
				  });
			this.$confirm(`确定进行${id ? '删除' : '批量删除'}吗？`, '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			})
				.then(() => {
					this.$http({
						url: this.$http.adornUrl('/matterService/matter/delete'),
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
		},
		//提交
		themSubmit(id) {
			this.$confirm('确认要提交该主题事项吗？', '提示', {
				confirmButtonText: '是',
				cancelButtonText: '否',
				type: 'warning'
			}).then(() => {
				this.$http({
					url: this.$http.adornUrl(`/matterService/matter/save`),
					method: 'post',
					data: this.$http.adornData(id, false)
				}).then(({ data }) => {
					if (data && data.code === 0) {
						this.$message({
							message: '提交成功',
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
			});
		},
		//流程图
		flowChartShow(itemData) {
			for (let i = 0; i < itemData.length; i++) {}
			console.log('itemData', itemData);
			itemData.sort((a, b) => {
				console.log('a.relate', a.relate);
				console.log('b.relate', b.relate);
				return b.relate > a.relate;
			});
			console.log('itemData1', itemData);

			this.flowChartVisible = true;
			this.$nextTick(() => {
				this.$refs.FlowChart.init(itemData);
			});
		},
		//审核/批量审核
		audits(id) {
			var itemIds = id
				? [id]
				: this.dataListSelections.map(item => {
						return item.id;
				  });
			this.auditsForm.id = itemIds;
			this.$confirm(`确定进行${id ? '审核' : '批量审核'}吗？`, '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			}).then(() => {
				this.auditsTitle = `确定${id ? '' : '批量'}通过核定？`;
				this.auditsvisible = true;
				this.$nextTick(() => {
					this.$refs['auditsForm'].resetFields();
				});
			});
		},
		//审核状态修改
		updateAudits() {
			this.$refs['auditsForm'].validate(valid => {
				if (valid) {
					this.$http({
						url: this.$http.adornUrl(`/matterService/matter/updateAudits`),
						method: 'post',
						data: this.$http.adornData({
							id: this.auditsForm.id,
							auditedStatus: this.auditsForm.auditedStatus,
							auditedReason: this.auditsForm.auditedReason
						})
					}).then(({ data }) => {
						if (data && data.code === 0) {
							this.$message({
								message: '操作成功',
								type: 'success',
								duration: 1500,
								onClose: () => {
									this.auditsvisible = false;
									this.getDataList();
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
.button-set .el-button {
	padding: 7px;
}

.button-set .el-button + .el-button {
	margin: 0;
}
</style>