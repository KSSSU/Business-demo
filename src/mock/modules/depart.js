var departList = [];
for (let i = 0; i < Math.floor(Math.random() * 10 + 1); i++) {
  departList.push(
    Mock.mock({
      id: "@increment",
      name: "省公安厅" + i,
      code: "00694001X" + i,
      level: 4042,
      areaName: "广东省",
      type: 4040,
      areaId: 4041
    })
  );
}

//获取部门信息
export function list() {
  return {
    url: "/sys/depart",
    type: "get",
    data: {
      msg: "success",
      code: 0,
      page: {
        totalCount: departList.length,
        pageSize: 10,
        totalPage: 1,
        curryPage: 1,
        list: departList
      }
    }
  };
}

// 获取部门详情
export function info() {
  return {
    url: "/sys/depart/info",
    type: "post",
    data: {
      msg: "success",
      code: 0,
      depart: departList[0]
    }
  };
}

// 添加部门
export function add() {
  return {
    // isOpen: false,
    url: "/sys/depart/save",
    type: "post",
    data: {
      msg: "success",
      code: 0
    }
  };
}

// 修改部门
export function update() {
  return {
    // isOpen: false,
    url: "/sys/depart/update",
    type: "post",
    data: {
      msg: "success",
      code: 0
    }
  };
}

// 删除部门
export function del() {
  return {
    // isOpen: false,
    url: "/sys/depart/delete",
    type: "post",
    data: {
      msg: "success",
      code: 0
    }
  };
}
