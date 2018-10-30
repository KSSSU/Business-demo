<template>
 <div>
 <el-table :data="tableDate" 
            border v-loading="loading" 
            @sort-change="sortChange" 
            @selection-change="selectionChangeHandle">
   
    <el-table-column type="selection"  width="55" align="center"></el-table-column>
      <el-table-column v-for="(th,key) in tableHeader"
      :key="key"
      :prop="th.prop"
      :label="th.label"
      :width="th.label == '操作' ? '114' : th.minWidth"
      :sortable="th.sortable"
      align="left">
 
         <template slot-scope="scope"> 
            <div class="template-button-set" v-if="th.oper">
              
                <el-button v-for="(o,key) in th.oper" 
                :key="key"  
                :type="o.buttonType" 
                :icon="o.buttonIcon"
                size='mini'
                @click="click(o.clickFun,scope.row)"></el-button>
               
            </div>  
            <div v-else>
                  <span v-if="!th.formatData">{{scope.row[th.prop]}}</span>
                 <span v-else>{{scope.row[th.prop] | formatters(th.formatData) }}</span> 
            </div>  
        </template>  
     
    
      </el-table-column>
 </el-table>
 
 <el-pagination 
  @size-change="handleSizeChange"
  @current-change="handleCurrentChange"
  :page-size="page.pageSize"
  :total="page.totalPage"
  :current-page="page.pageIndex"
 :page-sizes="[10,25,50,100]" 
 layout="total,sizes,prev,pager,next,jumper">
 </el-pagination> 
 
 </div>
</template>

<script>
export default {
	data() {
		return {
			tableDate: [],
			loading: false,
			page: {
				pageIndex: 1,
				pageSize: 10,
				totalPage: 0
			},
			order: '',
			prop: ''
		};
	},
	props: {
		tableHeader: {
			type: Array,
			default: function() {
				return [];
			}
		},
		url: {
			type: String,
			default: ''
		},
		pathParams: {
			type: Object,
			default: function() {
				return { params: {} };
			}
		},
		buttonShow: {
			type: String,
			default: ''
		}
	},
	activated() {
		this.getDataList();
	},
	methods: {
		//获取数据
		getDataList() {
			this.pathParams['curryPage'] = this.page.pageIndex;
			this.pathParams['pageSize'] = this.page.pageSize;
			this.pathParams['prop'] = this.prop;
			this.pathParams['order'] = this.order;
			this.loading = true;
			this.$http({
				url: this.$http.adornUrl(this.url),
				method: 'get',
				params: this.$http.adornParams(this.pathParams)
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
			this.$emit('selectionChangeHandle', val);
		},
		//表格里的按钮事件
		click(buttonEven, row) {
			this.$emit('buttonEven', buttonEven, row);
		}
	}
};
</script>

<style lang="scss">
.template-button-set .el-button {
	padding: 7px;
	margin-right: 4px;
}

.template-button-set .el-button + .el-button {
	margin: 0 4px 0 0;
}

.template-button-set .el-button + .el-button:last-child {
	margin: 0;
}
</style>