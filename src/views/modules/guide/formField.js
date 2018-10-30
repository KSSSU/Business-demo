/*
 * @Author: Jimmy
 * @Date: 2018-10-18
 * @Description: 办事指南-行政许可 / 公共服务的表格字段
 * @Last Modified by:    
 * @Last Modified time: 
 */

module.exports = {
  id: 0,
  audited_status: 0,
  audited_reason: '',

  // 基本本素
  mould_id: '',
  theme_id: '',
  matter_id: '',
  matter_original_code: '', //事项原代码-未定义
  matter_code: '',
  service_object: [],
  item_type: '',
  operate_scope: '',
  org_dept: '',
  unit_dept: '',
  subject_property: '',
  subject: '',
  is_joint: '',
  joint_dept: '',
  exercise_type: '',
  exercise_level: [],
  run_system: '',
  power_divide: '',
  exercise_content: '',
  count_limit: '',
  result_name: '',
  result_sample: '',
  legal_time: '',
  legal_unit: '',
  promise_time: '',
  promise_unit: '',
  consult_tel: '',
  supervise_tel: '',

  // 受理环节
  admissibility: '',
  is_window: 1,
  window_desc: '',
  is_online: 0,
  online_desc: '',
  is_special: 0,
  special_procedure: [],
  other_special_procedure: '',
  procedurer: '',
  procedure_time: '',
  is_charge: 0,
  charge_standard: '',
  charge_basis: '',
  is_wdeal: 1,
  wdeal_place: '',
  wdeal_time: '',
  wdeal_traffic: '',
  is_odeal: 0,
  odeal_link: '',
  is_tdeal: 0,
  tdeal_tel: '',

  // 申请材料
  mater_id: [],

  // 权力义务救济
  law_right: '',
  law_duty: '',
  reconsider_dept: '',
  reconsider_address: '',
  reconsider_tel: '',
  reconsider_url: '',
  law_dept: '',
  law_address: '',
  law_tel: '',
  law_url: '',

  // 其他服务
  is_agency: '',
  agency_name: '',
  agency_content: '',
  is_acharge: '',
  acharge_standard: '',
  acharge_money: '',
  is_appoint: '',
  appoint_url: '',
  is_opayment: '',
  opayment_type: '',
  is_express: '',
  express_type: '',

  // 常见问题
  problem: ''
}
