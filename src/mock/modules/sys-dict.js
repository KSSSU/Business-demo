import Mock from "mockjs";

// 生成数据列表
var dataList = [];
for (let i = 0; i < Math.floor(Math.random() * 10 + 1); i++) {
  dataList.push(
    Mock.mock({
      id: "@increment",
      name: "是否删除" + i,
      value: "del_flag" + i,
      state: "无",
      parentId: 1,
      sort: 1,
      remarks: "无"
    })
  );
}

// 获取字典列表
export function list() {
  return {
    // isOpen: false,
    url: "/sys/dict/list",
    type: "get",
    data: {
      msg: "success",
      code: 0,
      page: {
        totalCount: dataList.length,
        pageSize: 10,
        totalPage: 1,
        currPage: 1,
        list: dataList
      }
    }
  };
}

// 获取字典信息
export function info() {
  return {
    // isOpen: false,
    url: "/sys/dict/info",
    type: "get",
    data: {
      msg: "success",
      code: 0,
      dict: dataList[0]
    }
  };
}

// 添加字典
export function add() {
  return {
    // isOpen: false,
    url: "/sys/dict/save",
    type: "post",
    data: {
      msg: "success",
      code: 0
    }
  };
}

// 修改字典
export function update() {
  return {
    // isOpen: false,
    url: "/sys/dict/update",
    type: "post",
    data: {
      msg: "success",
      code: 0
    }
  };
}

// 删除字典
export function del() {
  return {
    // isOpen: false,
    url: "/sys/dict/delete",
    type: "post",
    data: {
      msg: "success",
      code: 0
    }
  };
}
