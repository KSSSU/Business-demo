// 生成数据列表
var dataList = [
  {
    id: 1,
    parentId: 0,
    parentName: "无",
    name: "广东省",
    code: "440000000000",
    comLevel: "省级",
    sort: 0,
    state: "2",
    list: null
  },
  {
    id: 2,
    parentId: 1,
    parentName: "广东省",
    name: "广州市",
    code: "440100000000",
    comLevel: "市级",
    sort: 1,
    state: "2",
    list: null
  },
  {
    id: 3,
    parentId: 1,
    parentName: "广东省",
    name: "佛山市",
    code: "440600000000",
    comLevel: "市级",
    sort: 1,
    state: "2",
    list: null
  },
  {
    id: 4,
    parentId: 2,
    parentName: "广州市",
    name: "荔湾",
    code: "440103000000",
    comLevel: "县级",
    sort: 1,
    state: "2",
    list: null
  },
  {
    id: 5,
    parentId: 2,
    parentName: "广州市",
    name: "越秀",
    code: "440104000000",
    comLevel: "县级",
    sort: 1,
    state: "2",
    list: null
  }
];
// var navDataList = [
//   {
//     menuId: 1,
//     parentId: 0,
//     parentName: null,
//     name: "系统配置",
//     url: null,
//     perms: null,
//     type: 0,
//     icon: "system",
//     sort: 0,
//     remarks: "1",
//     state: "2",
//     permission: "3",
//     open: null,
//     list: [
//       {
//         menuId: 2,
//         parentId: 1,
//         parentName: null,
//         name: "行政区划管理",
//         url: "sys/area",
//         perms: null,
//         type: 1,
//         icon: "admin",
//         sort: 1,
//         remarks: "1",
//         state: "2",
//         permission: "3",
//         open: null,
//         list: null
//       },
//       {
//         menuId: 3,
//         parentId: 1,
//         parentName: null,
//         name: "部门管理",
//         url: "sys/depart",
//         perms: null,
//         type: 1,
//         icon: "admin",
//         sort: 2,
//         remarks: "1",
//         state: "2",
//         permission: "3",
//         open: null,
//         list: null
//       },
//       {
//         menuId: 4,
//         parentId: 1,
//         parentName: null,
//         name: "用户管理",
//         url: "sys/user",
//         perms: null,
//         type: 1,
//         icon: "admin",
//         sort: 3,
//         remarks: "1",
//         state: "2",
//         permission: "3",
//         open: null,
//         list: null
//       },
//       {
//         menuId: 5,
//         parentId: 1,
//         parentName: null,
//         name: "角色管理",
//         url: "sys/role",
//         perms: null,
//         type: 1,
//         icon: "role",
//         sort: 4,
//         remarks: "1",
//         state: "2",
//         permission: "3",
//         open: null,
//         list: null
//       },
//       {
//         menuId: 6,
//         parentId: 1,
//         parentName: null,
//         name: "菜单管理",
//         url: "sys/menu",
//         perms: null,
//         type: 1,
//         icon: "menu",
//         sort: 5,
//         remarks: "1",
//         state: "2",
//         permission: "3",
//         open: null,
//         list: null
//       },
//       {
//         menuId: 7,
//         parentId: 1,
//         parentName: null,
//         name: "字典配置",
//         url: "sys/dict",
//         perms: null,
//         type: 1,
//         icon: "job",
//         sort: 6,
//         remarks: "1",
//         state: "2",
//         permission: "3",
//         open: null,
//         list: null
//       },
//       {
//         menuId: 8,
//         parentId: 1,
//         parentName: null,
//         name: "系统监控",
//         url: null,
//         perms: null,
//         type: 1,
//         icon: "sql",
//         sort: 7,
//         remarks: "1",
//         state: "2",
//         permission: "3",
//         open: null,
//         list: [
//           {
//             menuId: 9,
//             parentId: 8,
//             parentName: null,
//             name: "业务日志",
//             url: null,
//             perms: "sys:log:list",
//             type: 1,
//             icon: "log",
//             sort: 1,
//             remarks: "1",
//             state: "2",
//             permission: "3",
//             open: null,
//             list: null
//           },
//           {
//             menuId: 10,
//             parentId: 8,
//             parentName: null,
//             name: "操作日志",
//             url: "sys/log",
//             perms: "sys:log:list",
//             type: 1,
//             icon: "log",
//             sort: 2,
//             remarks: "1",
//             state: "2",
//             permission: "3",
//             open: null,
//             list: null
//           },
//           {
//             menuId: 11,
//             parentId: 8,
//             parentName: null,
//             name: "连接池监控",
//             url: "http://localhost:8080/renren-fast/druid/sql.html",
//             perms: null,
//             type: 1,
//             icon: "sql",
//             sort: 3,
//             remarks: "1",
//             state: "2",
//             permission: "3",
//             open: null,
//             list: null
//           }
//         ]
//       }
//     ]
//   }
// ];

// 获取菜单列表
export function list() {
  return {
    // isOpen: false,
    url: "/sys/area/list",
    type: "get",
    data: dataList
  };
}

// 获取上级菜单
// export function select() {
//   let dataList = JSON.parse(JSON.stringify(navDataList));
//   dataList = dataList.concat(dataList[0].list);
//   return {
//     // isOpen: false,
//     url: "/sys/menu/select",
//     type: "get",
//     data: {
//       msg: "success",
//       code: 0,
//       menuList: dataList
//     }
//   };
// }

// 获取行政区划管理信息
export function info() {
  return {
    // isOpen: false,
    url: "/sys/area/info",
    type: "get",
    data: {
      msg: "success",
      code: 0,
      area: dataList[0]
    }
  };
}

// 添加行政区划管理
export function add() {
  return {
    // isOpen: false,
    url: "/sys/area/save",
    type: "post",
    data: {
      msg: "success",
      code: 0
    }
  };
}

// 修改行政区划管理
export function update() {
  return {
    // isOpen: false,
    url: "/sys/area/update",
    type: "post",
    data: {
      msg: "success",
      code: 0
    }
  };
}

// 删除行政区划管理
export function del() {
  return {
    // isOpen: false,
    url: "/sys/area/delete",
    type: "post",
    data: {
      msg: "success",
      code: 0
    }
  };
}
