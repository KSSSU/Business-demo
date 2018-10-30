var dataList = [];
for (let i = 0; i < Math.floor(Math.random() * 10 + 1); i++) {
  dataList.push(
    Mock.mock({
      id: "@increment",
      name: "项目核准" + i,
      encrypt: "1100772001/000024002004000000008100" + i,
      deptName: "工商行政管理局" + i,
      typeFirst: "行政许可" + i
    })
  );
}

var dataLists = [];
for (let i = 0; i < Math.floor(Math.random() * 10 + 1); i++) {
  dataLists.push(
    Mock.mock({
      id: "@increment",
      matterName: "项目核准1" + i,
      matterCode: "1100772001/000024002004000000008100" + i,
      orgDept: "工商行政管理局1" + i,
      typeFirst: "行政许可1" + i,
      relate: 0
    })
  );
}

var matMatstorageList = [];
for (let i = 0; i < Math.floor(Math.random() * 10 + 1); i++) {
  matMatstorageList.push(
    Mock.mock({
      id: "@increment",
      name: "材料" + i,
      code: "0000000" + i,
      form: "材料来源" + i
    })
  );
}

//获取事项模板列表
export function matMatterList() {
  return {
    url: "/template/matMatter",
    type: "get",
    data: {
      message: "success",
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

//获取办事指南模板列表
export function matGuideList() {
  return {
    url: "/template/matGuide",
    type: "get",
    data: {
      message: "success",
      code: 0,
      page: {
        totalCount: dataLists.length,
        pageSize: 10,
        totalPage: 1,
        curryPage: 1,
        list: dataLists
      }
    }
  };
}

//获取材料库模板列表
export function matMatstorageList() {
  return {
    url: "/template/matMatstorage",
    type: "get",
    data: {
      message: "success",
      code: 0,
      page: {
        totalCount: matMatstorageList.length,
        pageSize: 10,
        totalPage: 1,
        curryPage: 1,
        list: matMatstorageList
      }
    }
  };
}

//设为模板(事项)
export function setTemplate() {
  return {
    url: "/template/matMatter/setTemplate",
    type: "post",
    data: {
      message: "success",
      code: 0
    }
  };
}

//取消模板(事项)
export function cancleTemplate() {
  return {
    url: "/template/matMatter/cancleTemplate",
    type: "post",
    data: {
      message: "success",
      code: 0
    }
  };
}

//批量无效(事项)
export function deleteAll() {
  return {
    url: "/template/matMatter/deleteAll",
    type: "post",
    data: {
      message: "success",
      code: 0
    }
  };
}

//下载(事项)
export function downLoad() {
  return {
    url: "/template/matMatter/downLoad",
    type: "post",
    data: {
      message: "success",
      code: 0
    }
  };
}

//设为模板(办事指南)
export function setTemplate1() {
  return {
    url: "/template/matGuide/setTemplate",
    type: "post",
    data: {
      message: "success",
      code: 0
    }
  };
}

//取消模板(办事指南)
export function cancleTemplate1() {
  return {
    url: "/template/matGuide/cancleTemplate",
    type: "post",
    data: {
      message: "success",
      code: 0
    }
  };
}

//批量无效(办事指南)
export function deleteAll1() {
  return {
    url: "/template/matGuide/deleteAll",
    type: "post",
    data: {
      message: "success",
      code: 0
    }
  };
}

//下载(办事指南)
export function downLoad1() {
  return {
    url: "/template/matGuide/downLoad",
    type: "post",
    data: {
      message: "success",
      code: 0
    }
  };
}

//设为模板(主题)
export function setTemplate2() {
  return {
    url: "/matterService/matter/info/setTemplate",
    type: "post",
    data: {
      message: "success",
      code: 0
    }
  };
}

//取消模板(主题)
export function cancleTemplate3() {
  return {
    url: "/matterService/matter/info/cancleTemplate",
    type: "post",
    data: {
      message: "success",
      code: 0
    }
  };
}

//批量无效(主题)
export function deleteAll4() {
  return {
    url: "/matterService/matter/info/deleteAll",
    type: "post",
    data: {
      message: "success",
      code: 0
    }
  };
}

//下载(主题)
export function downLoad5() {
  return {
    url: "/matterService/matter/info/downLoad",
    type: "post",
    data: {
      message: "success",
      code: 0
    }
  };
}
