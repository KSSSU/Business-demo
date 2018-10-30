/*
 * @Author: Jimmy
 * @Date: 2018-10-18
 * @Description: 办事指南 - 公共服务 (入口文件) 根据type显示不同的页面
 * @Last Modified by:    
 * @Last Modified time: 
 */

<template>
  <guide v-bind="props"></guide>
</template>

<script>
import Guide from './template';
export default {
	data() {
		return {
			props: {
				// 类型（0-全部、1-行政许可、2-公共服务）
				type: 2,

				// 页面标识，用来区分每个页面的请求路径
				identif: 'guide',

				// 是否有权限审核，用来区分普通页面和审核页面（0-没有权限、1-有权限）
				isAudit: false
			}
		};
	},
	components: {
		Guide
	}
};
</script>