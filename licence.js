var json = {  // true:表示拥有全功能点权限   '':表示只有查看权限   false:表示禁止访问   
    "p01": true,    //首页     
    "p02":{
        "01": 'add-del-mod-ena-grp-tag-ie-rmv', //用户管理    add:增加  del:删除  mod:修改      ena(enable):激活   grp(group):移动至组   tag:添加标签   ie(import/export):导入导出   rop(remove out policy):策略详情移除操作
        "02": 'add-del-mod-iog', //用户组       add:增加  del:删除  mod:修改    iog(input/output group):用户移入移出用户组
        "03": 'add-del-mod-iot' //用户标签     add:增加  del:删除  mod:修改    iot(input/output tag):用户移入移出标签
    },
    "p03":{
        "01": 'map-ls-spw-ed-rst-bell-unb-eli' //设备管理     map:查看地理位置  ls(lockscreen):锁屏  spw(screen_pw):锁屏密码  ed(erasedata):擦除企业数据 rst(reset)：恢复出厂设置 bell:响铃追踪   unb(unbind):解绑  eli(eliminate):淘汰   
    },
    "p04":{
        "01": 'add-del-mod-iio-ioo-pub-act-rop', //设备策略     add:增加  del:删除  mod:修改    iio(issue in org):机构内下发  ioo(issue other org):下发至其它（即下级）机构  pub(publish):发布  act:启用/禁用   rop(remove out policy):移除策略
        "02": 'add-del-mod-iio-ioo-pub-act-rop', //合规策略     add:增加  del:删除  mod:修改    iio(issue in org):机构内下发  ioo(issue other org):下发至其它（即下级）机构  pub(publish):发布  act:启用/禁用   rop(remove out policy):移除策略
        "03": 'add-del-mod-iio-ioo-pub-act-rop', //围栏策略     add:增加  del:删除  mod:修改    iio(issue in org):机构内下发  ioo(issue other org):下发至其它（即下级）机构  pub(publish):发布  act:启用/禁用   rop(remove out policy):移除策略
        "04": 'add-del-mod-iio-ioo-pub-act-rop', //应用策略     add:增加  del:删除  mod:修改    iio(issue in org):机构内下发  ioo(issue other org):下发至其它（即下级）机构  pub(publish):发布  act:启用/禁用   rop(remove out policy):移除策略
        "01": 'add-del-mod-iio-ioo-pub-act-rop'  //客服端策略   add:增加  del:删除  mod:修改    iio(issue in org):机构内下发  ioo(issue other org):下发至其它（即下级）机构  pub(publish):发布  act:启用/禁用   rop(remove out policy):移除策略
    },
    "p05":{
        "01": 'add-del-mod-iss', //文件管理     add:增加  del:删除  mod:修改    iss(issue):下发
    },
    "p06":{
        "01": 'add-del-mod-iss', //应用商店     add:增加  del:删除  mod:修改    iss(issue):下发
        "02": 'add-del-mod-act', //黑白名单     add:增加  del:删除  mod:修改    act:启用/禁用
        "03": 'add-del-mod', //应用标签     add:增加  del:删除  mod:修改
    },
    "p07":{
        "01": 'exp', //客户端日志   exp(export): 导出
        "02": 'exp', //应用日志     exp(export): 导出
        "03": 'exp', //用户管理日志 exp(export): 导出
        "04": 'exp', //设备管理日志 exp(export): 导出
        "05": 'exp', //文件管理日志 exp(export): 导出
        "06": 'exp', //应用管理日志 exp(export): 导出
        "07": 'exp', //策略管理日志 exp(export): 导出
        "08": 'exp', //管理员日志   exp(export): 导出
        "09": 'exp', //违规情况日志 exp(export): 导出
    },  
    "p08":{
        "01": 'add-del-mod-ie', //机构树       add:增加  del:删除  mod:修改    ie(import/export):导入导出
        "02": 'add-del-mod-act',  //管理员       add:增加  del:删除  mod:修改    act:启用/禁用
    } 
};


var licPath = {  // true:表示拥有全功能点权限   '':表示只有查看权限   false:表示禁止访问   
    p01: true,    //首页     
    p0201: 'add-del-mod-ena-grp-tag-ie-rmv', //用户管理    add:增加  del:删除  mod:修改      ena(enable):激活   grp(group):移动至组   tag:添加标签   ie(import/export):导入导出   rop(remove out policy):策略详情移除操作
    p0202: 'add-del-mod-iog', //用户组       add:增加  del:删除  mod:修改    iog(input/output group):用户移入移出用户组
    p0203: 'add-del-mod-iot', //用户标签     add:增加  del:删除  mod:修改    iot(input/output tag):用户移入移出标签
    p0301: 'map-ls-spw-ed-rst-bell-unb-eli', //设备管理     map:查看地理位置  ls(lockscreen):锁屏  spw(screen_pw):锁屏密码  ed(erasedata):擦除企业数据 rst(reset)：恢复出厂设置 bell:响铃追踪   unb(unbind):解绑  eli(eliminate):淘汰   
    p0401: 'add-del-mod-iio-ioo-pub-act-rop', //设备策略     add:增加  del:删除  mod:修改    iio(issue in org):机构内下发  ioo(issue other org):下发至其它（即下级）机构  pub(publish):发布  act:启用/禁用   rop(remove out policy):移除策略
    p0402: 'add-del-mod-iio-ioo-pub-act-rop', //合规策略     add:增加  del:删除  mod:修改    iio(issue in org):机构内下发  ioo(issue other org):下发至其它（即下级）机构  pub(publish):发布  act:启用/禁用   rop(remove out policy):移除策略
    p0403: 'add-del-mod-iio-ioo-pub-act-rop', //围栏策略     add:增加  del:删除  mod:修改    iio(issue in org):机构内下发  ioo(issue other org):下发至其它（即下级）机构  pub(publish):发布  act:启用/禁用   rop(remove out policy):移除策略
    p0404: 'add-del-mod-iio-ioo-pub-act-rop', //应用策略     add:增加  del:删除  mod:修改    iio(issue in org):机构内下发  ioo(issue other org):下发至其它（即下级）机构  pub(publish):发布  act:启用/禁用   rop(remove out policy):移除策略
    p0401: 'add-del-mod-iio-ioo-pub-act-rop', //客服端策略   add:增加  del:删除  mod:修改    iio(issue in org):机构内下发  ioo(issue other org):下发至其它（即下级）机构  pub(publish):发布  act:启用/禁用   rop(remove out policy):移除策略
    p0501: 'add-del-mod-iss', //文件管理     add:增加  del:删除  mod:修改    iss(issue):下发
    p0601: 'add-del-mod-iss', //应用商店     add:增加  del:删除  mod:修改    iss(issue):下发
    p0602: 'add-del-mod-act', //黑白名单     add:增加  del:删除  mod:修改    act:启用/禁用
    p0603: 'add-del-mod', //应用标签     add:增加  del:删除  mod:修改
    p0701: 'exp', //客户端日志   exp(export): 导出
    p0702: 'exp', //应用日志     exp(export): 导出
    p0703: 'exp', //用户管理日志 exp(export): 导出
    p0704: 'exp', //设备管理日志 exp(export): 导出
    p0705: 'exp', //文件管理日志 exp(export): 导出
    p0706: 'exp', //应用管理日志 exp(export): 导出
    p0707: 'exp', //策略管理日志 exp(export): 导出
    p0708: 'exp', //管理员日志   exp(export): 导出
    p0709: 'exp', //违规情况日志 exp(export): 导出
    p0801: 'add-del-mod-ie', //机构树       add:增加  del:删除  mod:修改    ie(import/export):导入导出
    p0802: 'add-del-mod-act',  //管理员       add:增加  del:删除  mod:修改    act:启用/禁用
};