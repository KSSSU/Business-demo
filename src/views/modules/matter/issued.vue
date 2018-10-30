/*
 * @Author: Jimmy
 * @Date: 2018-10-29
 * @Description: 已发布事项的主页面
 * @Last Modified by:    
 * @Last Modified time: 
 */

<template>
  <Matter v-bind="props"></Matter>
</template>

<script>
import Matter from './template';
export default {
	data() {
		return {
			props: {
				// 类型（0-全部、1-行政许可、2-公共服务）
				type: 0,

				// 页面标识，用来区分每个页面的请求路径
				identif: 'matter',

				// 是否有权限审核，用来区分普通页面和审核页面
				isAudit: false,

				// 是否已发布
				isIssued: true
			}
		};
	},
	components: {
		Matter
	}
};
</script>