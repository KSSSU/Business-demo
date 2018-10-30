/*
 * @Author: Jimmy
 * @Date: 2018-10-22
 * @Description: 审核管理 - 事项清单 (入口文件) 筛选审核状态不为0的数据
 * @Last Modified by:    
 * @Last Modified time: 
 */

<template>
  <Matter v-bind="props"></Matter>
</template>

<script>
import Matter from '../matter/template';
export default {
	data() {
		return {
			props: {
				// 类型（0-全部、1-行政许可、2-公共服务）
				type: 0,

				// 页面标识，用来区分每个页面的请求路径
				identif: 'matter',

				// 是否有权限审核，用来区分普通页面和审核页面
				isAudit: true
			}
		};
	},
	components: {
		Matter
	}
};
</script>