import Mock from "mockjs";

// 生成数据列表
var dataList = [];
for (let i = 0; i < Math.floor(Math.random() * 10 + 1); i++) {
  dataList.push(
    Mock.mock({
      id: "@increment",
      name: "@name",
      itemCode: "1100772001/000024002004000000008100/" + i,
      leadDept: "省公安厅" + i,
      deptNames: "公安局分局户政大厅" + i,
      auditedReason: "出生医学证明" + i,
      themeType: " 行政许可" + i,
      auditedStatus: 0 + i,
      childrenData: [
        {
          id: "@increment",
          matterName: "项目核准1",
          matterCode: "1100772001/000024002004000000008100",
          orgDept: "工商行政管理局1",
          typeFirst: "行政许可1",
          relate: 3
        },
        {
          id: "@increment",
          matterName: "项目核定2",
          matterCode: "1100772001/000024002004000000008100",
          orgDept: "工商行政管理局1",
          typeFirst: "行政许可1",
          relate: 2
        }
      ],
      fileList: [{ uid: "1", name: "1" }, { uid: "2", name: "2" }]
    })
  );
}
var statusList = [];
for (let i = 0; i < Math.floor(Math.random() * 10 + 1); i++) {
  statusList.push(
    Mock.mock({
      id: "@increment",
      name: "理" + i,
      itemCode: "1100772001/000024002004000000008100/" + i,
      leadDept: "省公安厅" + i,
      deptNames: "公安局分局户政大厅" + i,
      auditedReason: "出生医学证明" + i,
      themeType: " 行政许可" + i,
      auditedStatus: 0 + i,
      itemSort: 0,
      childrenData: [
        {
          id: "@increment",
          matterName: "项目核准1" + i,
          matterCode: "1100772001/000024002004000000008100" + i,
          orgDept: "工商行政管理局1" + i,
          typeFirst: "行政许可1" + i,
          relate: 0
        }
      ],
      fileList: [{ uid: "1", name: "1" }, { uid: "2", name: "2" }]
    })
  );
}

//获取主题事项信息
export function list() {
  return {
    url: "/matterService/matter/info",
    type: "get",
    data: {
      msg: "success",
      code: 0,
      page: {
        totalCount: dataList.length,
        pageSize: 10,
        totalPage: 1,
        curryPage: 1,
        list: dataList
      }
    }
  };
}

export function statuslist() {
  return {
    url: "/matterService/matter/status",
    type: "get",
    data: {
      msg: "success",
      code: 0,
      page: {
        totalCount: statusList.length,
        pageSize: 10,
        totalPage: 1,
        curryPage: 1,
        list: statusList
      }
    }
  };
}

//删除用户
export function del() {
  return {
    url: "/matterService/matter/delete",
    type: "post",
    data: {
      msg: "success",
      code: 0
    }
  };
}

//事项详情/修改
export function select() {
  return {
    url: "/matterService/matter/info",
    type: "post",
    data: {
      msg: "success",
      code: 0,
      item: dataList[0]
    }
  };
}

//事项提交
export function save() {
  return {
    url: "/matterService/matter/save",
    type: "post",
    data: {
      msg: "success",
      code: 0
    }
  };
}

//事项修改
export function update() {
  return {
    url: "/matterService/matter/update",
    type: "post",
    data: {
      msg: "success",
      code: 0
    }
  };
}

//上传文件
export function uploadFile() {
  return {
    url: "/matterService/matter/uploadFile",
    type: "post",
    data: {
      msg: "success",
      code: 0
    }
  };
}
