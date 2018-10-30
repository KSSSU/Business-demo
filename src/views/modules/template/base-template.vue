<template>

<div class="mod-baseTemplate">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="fetchDataList()">
   
      <el-form-item v-if="templateName!='matMatstorage'">
         <el-input placeholder="请输入事项名称或代码" v-model="dataForm.name" clearable></el-input>
     </el-form-item> 

     <el-form-item v-if="templateName!='matMatstorage'">
       <el-select placeholder="=是否模板=" v-model="dataForm.isTemplate">
           <el-option  label="是" value="1"></el-option>
           <el-option  label="否" value="2"></el-option>
       </el-select>
    </el-form-item>

     <el-form-item v-if="templateName=='matMatstorage'">
         <el-input placeholder="请输入材料名称或标识符" v-model="dataForm.matMatstorageName" clearable></el-input>
     </el-form-item> 

     <el-form-item v-if="templateName=='matMatstorage'">
       <el-input placeholder="请输入事项名称" v-model="dataForm.matterName" clearable></el-input>
    </el-form-item>

    <el-form-item >
        <el-button icon="el-icon-search" type="primary" @click="fetchDataList()">搜索</el-button>
        <el-button icon="el-icon-printer" type="warning" :disabled="dataListSelections.length<=0" @click="setTemplate()" v-if="templateName!='matMatstorage'">批量设为模板</el-button>
        <el-button icon="el-icon-printer" class="btn-cyan" :disabled="dataListSelections.length<=0" @click="cancleTemplate()" v-if="templateName!='matMatstorage'">批量取消模板</el-button>
        <el-button icon="el-icon-delete" type="info" :disabled="dataListSelections.length<=0" @click="deleteAll()" v-if="templateName!='matMatstorage'">批量无效</el-button>
        <el-button icon="el-icon-download" class="btn-blue" @click="downLoadData" v-if="templateName!='matMatstorage'">导出数据</el-button>
        <el-button icon="el-icon-download" type="primary" @click="downLoad()" :disabled="dataListSelections.length<=0" v-if="templateName=='matMatstorage'" >批量下载</el-button>
    </el-form-item> 

    </el-form>

 <table-component :tableHeader="tableHeader" :url="url"
  :pathParams="dataForm" ref="tableComponent" @buttonEven="buttonEven"
   @selectionChangeHandle="selectionChangeHandle"></table-component>
   <!-- 下载 -->
  <down-load-template v-if="downLoadVisible" ref="downLoadTemplate" ></down-load-template>
  <!-- 主题详情 -->
  <matter-handle ref="MatterHandle" v-if="matterVisible"></matter-handle>
</div>

</template>

<script>
import TableComponent from '../common/tableComponent';
import DownLoadTemplate from './downLoad-template';
import MatterHandle from '../matterService/matter-handle';
export default {
	data() {
		return {
			dataListSelections: [],
			dataForm: {
				isTemplate: '',
				name: '',
				matMatstorageName: '',
				matterName: ''
			},
			downLoadVisible: false,
			matterVisible: false
		};
	},
	props: {
		tableHeader: {
			type: Array,
			default: function() {
				return [];
			}
		},
		columnData: {
			type: Array,
			default: function() {
				return [];
			}
		},
		url: {
			type: String,
			default: ''
		},
		templateName: {
			type: String,
			default: ''
		}
	},
	components: {
		TableComponent,
		DownLoadTemplate,
		MatterHandle
	},
	methods: {
		//搜索
		fetchDataList() {
			this.$nextTick(() => {
				this.$refs['tableComponent'].getDataList();
			});
		},
		//多选触发
		selectionChangeHandle(val) {
			this.dataListSelections = val;
		},
		//按钮操作
		buttonEven(even, row) {
			if (even == 'setTemplate') {
				//设为模板
				this.setTemplate(row.id);
			} else if (even == 'detailHandle') {
				//详情
				if (this.templateName == 'themeMatter') {
					//主题模板
					this.matterVisible = true;
					this.$nextTick(() => {
						this.$refs.MatterHandle.init(row.id, true);
					});
				}
			} else {
				this.downLoad(row.id);
			}
		},
		//导出数据
		downLoadData() {
			this.downLoadVisible = true;
			this.$nextTick(() => {
				this.$refs['downLoadTemplate'].init(this.columnData);
			});
		},
		//设为模板
		setTemplate(id) {
			var itemIds = id
				? [id]
				: this.dataListSelections.map(item => {
						return item.id;
				  });
			this.$confirm('确认将已选中的事项设置为模板？', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			})
				.then(() => {
					this.$http({
						url: this.$http.adornUrl(this.url + '/setTemplate'),
						method: 'post',
						data: this.$http.adornData(itemIds, false)
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
		},
		//批量取消模板
		cancleTemplate() {
			var itemIds = this.dataListSelections.map(item => {
				return item.id;
			});
			this.$confirm('确认取消已选中的事项为模板？', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			})
				.then(() => {
					this.$http({
						url: this.$http.adornUrl(this.url + '/cancleTemplate'),
						method: 'post',
						data: this.$http.adornData(itemIds, false)
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
		},
		//批量无效
		deleteAll() {
			var itemIds = this.dataListSelections.map(item => {
				return item.id;
			});
			this.$confirm('确认无效所有选中数据？', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			})
				.then(() => {
					this.$http({
						url: this.$http.adornUrl(this.url + '/deleteAll'),
						method: 'post',
						data: this.$http.adornData(itemIds, false)
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
		},
		//下载/批量下载
		downLoad(id) {
			var itemIds = id
				? [id]
				: this.dataListSelections.map(item => {
						return item.id;
				  });
			this.$confirm(`确认${id ? '下载' : '批量下载'}此条事项？`, '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			})
				.then(() => {
					this.$http({
						url: this.$http.adornUrl(this.url + '/downLoad'),
						method: 'post',
						data: this.$http.adornData(itemIds, false)
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


<style lang="scss">
.btn-cyan {
	background-color: #12b2b4 !important;
	border-color: #12b2b4 !important;
	color: #fff !important;
}
.btn-blue {
	color: #fff !important;
	background-color: #20a0ff !important;
	border-color: #20a0ff !important;
}
</style>
