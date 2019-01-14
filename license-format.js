

var defaultLicense = {
    "p01": true, //首页 
    "p02": {  //用户：
        "01": "acc-add-del-mod-ena-lev-grp-tag-ie-rmp-rsp",//用户管理：查看-添加-删除-修改-激活-请假-移动至组-添加标签-导入导出-移除策略-重置密码功能  //示例：用户管理功能不可用 "01":false,
        "02": "acc-add-del-mod-iog",                //用户组：查看-添加-删除-修改-用户移入/移出用户组
        "03": "acc-add-del-mod-iot"                 //标签：查看-添加-删除-修改-用户移入/移出标签
    },
    "p03": {   //设备：
        "01": "acc-map-ls-spw-ed-rst-bell-unb-eli"  //设备管理：查看-查看地理位置-锁屏-锁屏密码-擦除企业数据-恢复出厂设置-响铃追踪-解绑-淘汰   
    },
    "p04": {   //策略：
        "01": "acc-add-del-mod-iio-ioo-pub-act-rmp",//设备策略：查看-增加-删除-修改-机构内下发-下发至其它（即下级）机构-发布-启用/禁用-移除策略
        "02": "acc-add-del-mod-iio-ioo-pub-act-rmp",//合规策略：查看-增加-删除-修改-机构内下发-下发至其它（即下级）机构-发布-启用/禁用-移除策略
        "03": "acc-add-del-mod-iio-ioo-pub-act-rmp",//围栏策略：查看-增加-删除-修改-机构内下发-下发至其它（即下级）机构-发布-启用/禁用-移除策略
        "04": "acc-add-del-mod-iio-ioo-pub-act-rmp",//应用策略：查看-增加-删除-修改-机构内下发-下发至其它（即下级）机构-发布-启用/禁用-移除策略
        "05": "acc-add-del-mod-iio-ioo-pub-act-rmp"//客户端策略：查看-增加-删除-修改-机构内下发-下发至其它（即下级）机构-发布-启用/禁用-移除策略
    },
    "p05": {   //文件：
        "01": "acc-add-del-mod-iss"                //文件管理：查看-增加-删除-修改-下发
    },
    "p06": {   //应用：
        "01": "acc-add-del-mod-iss",               //应用商店：查看-增加-删除-修改-下发
        "02": "acc-add-del-mod-act",               //黑白名单：查看-增加-删除-修改-启用/禁用
        "03": "acc-add-del-mod"                    //标签：查看-增加-删除-修改
    },
    "p07": {   //日志：
        "01": "acc-exp",                           //客户端日志：查看-导出
        "02": "acc-exp",                           //应用日志：查看-导出
        "03": "acc-exp",                           //用户管理日志：查看-导出
        "04": "acc-exp",                           //设备管理日志：查看-导出
        "05": "acc-exp",                           //文件管理日志：查看-导出
        "06": "acc-exp",                           //应用管理日志：查看-导出
        "07": "acc-exp",                           //策略管理日志：查看-导出
        "08": "acc-exp",                           //管理员日志：查看-导出
        "09": "acc-exp",                           //违规情况日志：查看-导出
        "10": "acc-exp"                            //机构管理日志：查看-导出
    },
    "p08": {    //机构：
        "01": "acc-add-del-mod-imp-exp",           //机构树：查看-增加-删除-修改-导入/导出
        "02": "acc-add-del-mod-act-rsp"            //管理员：查看-增加-删除-修改-启用/禁用-重置密码
    }
} 

var navyLicense = {
    "p01": true, //首页 
    "p02": {  //用户：
        "01": "acc-add-del-mod-ena-lev-grp-tag-ie-rmp-rsp",//用户管理：查看-添加-删除-修改-激活-请假-移动至组-添加标签-导入导出-移除策略-重置密码功能  //示例：用户管理功能不可用 "01":false,
        "02": "acc-add-del-mod-iog",                //用户组：查看-添加-删除-修改-用户移入/移出用户组
        "03": "acc-add-del-mod-iot"                 //标签：查看-添加-删除-修改-用户移入/移出标签
    },
    "p03": {   //设备：
        "01": "acc-map-ls-spw-ed-rst-bell-unb-eli"  //设备管理：查看-查看地理位置-锁屏-锁屏密码-擦除企业数据-恢复出厂设置-响铃追踪-解绑-淘汰   
    },
    "p04": {   //策略：
        "01": "acc-add-del-mod-iio-ioo-pub-act-rmp",//设备策略：查看-增加-删除-修改-机构内下发-下发至其它（即下级）机构-发布-启用/禁用-移除策略
        "02": "acc-add-del-mod-iio-ioo-pub-act-rmp",//合规策略：查看-增加-删除-修改-机构内下发-下发至其它（即下级）机构-发布-启用/禁用-移除策略
        "03": "acc-add-del-mod-iio-ioo-pub-act-rmp",//围栏策略：查看-增加-删除-修改-机构内下发-下发至其它（即下级）机构-发布-启用/禁用-移除策略
        "04": "acc-add-del-mod-iio-ioo-pub-act-rmp",//应用策略：查看-增加-删除-修改-机构内下发-下发至其它（即下级）机构-发布-启用/禁用-移除策略
        "05": "acc-add-del-mod-iio-ioo-pub-act-rmp"//客户端策略：查看-增加-删除-修改-机构内下发-下发至其它（即下级）机构-发布-启用/禁用-移除策略
    },
    "p05": {   //文件：
        "01": "acc-add-del-mod-iss"                //文件管理：查看-增加-删除-修改-下发
    },
    "p06": {   //应用：
        "01": "acc-add-del-mod-iss",               //应用商店：查看-增加-删除-修改-下发
        "02": "acc-add-del-mod-act",               //黑白名单：查看-增加-删除-修改-启用/禁用
        "03": "acc-add-del-mod"                    //标签：查看-增加-删除-修改
    },
    "p07": {   //日志：
        "01": "acc-exp",                           //客户端日志：查看-导出
        "02": "acc-exp",                           //应用日志：查看-导出
        "03": "acc-exp",                           //用户管理日志：查看-导出
        "04": "acc-exp",                           //设备管理日志：查看-导出
        "05": "acc-exp",                           //文件管理日志：查看-导出
        "06": "acc-exp",                           //应用管理日志：查看-导出
        "07": "acc-exp",                           //策略管理日志：查看-导出
        "08": "acc-exp",                           //管理员日志：查看-导出
        "09": "acc-exp",                           //违规情况日志：查看-导出
        "10": "acc-exp"                            //机构管理日志：查看-导出
    },
    "p08": {    //机构：
        "01": "acc-add-del-mod-imp-exp",           //机构树：查看-增加-删除-修改-导入-导出
        "02": "acc-add-del-mod-act-rsp"            //管理员：查看-增加-删除-修改-启用/禁用-重置密码
    }
}

var testLicense = {
    "p01": true, //首页 
    "p02": {  //用户：
        "01": "acc-add-del-mod-ena-lev-grp-tag-ie-rmp-rsp",//用户管理：查看-添加-删除-修改-激活-请假-移动至组-添加标签-导入导出-移除策略-重置密码功能  //示例：用户管理功能不可用 "01":false,
        "02": "acc-add-del-mod-iog",                //用户组：查看-添加-删除-修改-用户移入/移出用户组
        "03": "acc-add-del-mod-iot"                 //标签：查看-添加-删除-修改-用户移入/移出标签
    },
    "p03": {   //设备：
        "01": "acc-map-ls-spw-ed-rst-bell-unb-eli"  //设备管理：查看-查看地理位置-锁屏-锁屏密码-擦除企业数据-恢复出厂设置-响铃追踪-解绑-淘汰   
    },
    "p04": {   //策略：
        "01": "acc-add-del-mod-iio-ioo-pub-act-rmp",//设备策略：查看-增加-删除-修改-机构内下发-下发至其它（即下级）机构-发布-启用/禁用-移除策略
        "02": "acc-add-del-mod-iio-ioo-pub-act-rmp",//合规策略：查看-增加-删除-修改-机构内下发-下发至其它（即下级）机构-发布-启用/禁用-移除策略
        "03": "acc-add-del-mod-iio-ioo-pub-act-rmp",//围栏策略：查看-增加-删除-修改-机构内下发-下发至其它（即下级）机构-发布-启用/禁用-移除策略
        "04": "acc-add-del-mod-iio-ioo-pub-act-rmp",//应用策略：查看-增加-删除-修改-机构内下发-下发至其它（即下级）机构-发布-启用/禁用-移除策略
        "05": "acc-add-del"//客户端策略：查看-增加-删除-修改-机构内下发-下发至其它（即下级）机构-发布-启用/禁用-移除策略
    },
    "p05": {   //文件：
        "01": "acc-add-del-mod-iss"                //文件管理：查看-增加-删除-修改-下发
    },
    "p06": {   //应用：
        "01": "acc",               //应用商店：查看-增加-删除-修改-下发
        "02": "acc-add-del-mod-act",               //黑白名单：查看-增加-删除-修改-启用/禁用
        "03": "acc"                    //标签：查看-增加-删除-修改
    },
    "p07": {   //日志：
        "01": "acc-exp",                           //客户端日志：查看-导出
        "02": "acc",                           //应用日志：查看-导出
        "03": "acc-exp",                           //用户管理日志：查看-导出
        "04": "acc-exp",                           //设备管理日志：查看-导出
        "05": "acc",                           //文件管理日志：查看-导出
        "06": "acc",                           //应用管理日志：查看-导出
        "07": "acc-exp",                           //策略管理日志：查看-导出
        "08": "acc-exp",                           //管理员日志：查看-导出
        "09": "acc-exp",                           //违规情况日志：查看-导出
        "10": "acc-exp"                            //机构管理日志：查看-导出
    },
    "p08": {    //机构：
        "01": "acc-add-del-mod-imp-exp",           //机构树：查看-增加-删除-修改-导入-导出
        "02": "acc-add-del-mod-act-rsp"            //管理员：查看-增加-删除-修改-启用/禁用-重置密码
    }
}