<template>
  <el-table-column :prop="prop" :width="width" :label="label">
    <template slot-scope="scope">
      <el-tag v-if="scope.row.audited_status === 0" size="small" type="info">待提交</el-tag>
      <el-tag v-else-if="scope.row.audited_status === 1" size="small" type="warning">等待初步核定</el-tag>
      <el-tag v-else-if="scope.row.audited_status === 2" size="small" type="warning" hit>等待最终审定</el-tag>
      <el-tag v-else-if="scope.row.audited_status === 3" size="small" type="success">已审定</el-tag>
      <el-tag v-else-if="scope.row.audited_status === 4 && !scope.row.audited_reason" size="small" type="danger">初审驳回</el-tag>
      <el-tag v-else-if="scope.row.audited_status === 5 && !scope.row.audited_reason" size="small" type="danger" hit>终审驳回</el-tag>
      
      <el-tooltip v-else-if="scope.row.audited_status === 4 && scope.row.audited_reason" :content="scope.row.audited_reason" class="item" placement="top">
        <el-tag size="small" type="danger">初审驳回 &nbsp;<i class="el-icon-warning"></i></el-tag>
      </el-tooltip>
      <el-tooltip v-else-if="scope.row.audited_status === 5 && scope.row.audited_reason" :content="scope.row.audited_reason" class="item" placement="top">
        <el-tag size="small" type="danger" hit>终审驳回 &nbsp;<i class="el-icon-warning"></i></el-tag>
      </el-tooltip>
    </template>
  </el-table-column>
</template>

<script>
export default {
	name: 'audit-status',
	props: {
		prop: {
			type: String
		},
		width: {
			type: String
		},
		label: {
			type: String
		},
		identif: {
			type: String
		}
	}
};
</script>

