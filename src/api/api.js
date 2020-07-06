let title = '';

if(location.origin.indexOf('localhost') > 0 ){
  title = 'https://beta.tickets.sanbinit.cn/api/';
}else{
  title = location.origin +'/api/';
}
// if(location.origin.indexOf('playmanager') > 0 || location.origin.indexOf('localhost') > 0 || location.origin.indexOf('playblog') > 0){
//   // title = 'http://10.0.8.110:7443/api/v2/';
//   title = 'https://planet.sanbinit.cn/api/v2/'; //测试
// }else if(location.origin.indexOf('premanager') > 0 || location.origin.indexOf('preblog') > 0){
//   title = 'https://pre2.bigxingxing.com/api/v2/'
// }else if(location.origin.indexOf('//manager.') >0 || location.origin.indexOf('//blog.') > 0){
//   title = 'https://www.bigxingxing.com/api/v2/';  // 正式
// }


const api = {
  login: title + 'user/admin_login',                                      // 用户登录
  auth_fresh: title + 'auth/fresh',                                       // 刷新token

  list_omstatus: title + 'order/list_omstatus',        //订单状态

  history_detail: title + 'order/history_detail',                         // 概览页历史数据
  get_admin_list: title + 'user/get_admin_list',                          // 获取管理员列表
  add_admin_by_superadmin: title + 'user/add_admin_by_superadmin',        // 添加管理员
  get_admin_all_status: title + 'user/get_admin_all_status',              // 获取所有管理员的状态
  get_admin_all_type: title + 'user/get_admin_all_type',                  // 获取管理员身份
  update_admin: title + 'user/update_admin',                              // 更新管理员
  update_admin_password: title + 'user/update_admin_password',            // 修改密码
  data_overview: title +'user/data_overview',                              //获取首页折线图

  supplizer_login: title + 'user/supplizer_login',                        // 供应商登录
  update_supplizer_password: title + 'supplizer/change_password',         // 供应商修改密码

  get_kw_list: title + 'product/get_kw_list',                            //获取关键词
  product_list: title + 'product/list',                                   // 获取商品列表
  product_get: title + 'product/get',                                     // 获取商品详情
  off_shelves_product: title + 'product/off_shelves_list',                // 批量下架商品
  delete_product: title + 'product/delete_list',                          // 删除商品
  create_product: title + 'product/create',                               // 添加商品
  update_product: title + 'product/update',                               // 修改商品
  resubmit_product: title + 'product/resubmit_product',                   // 重新提交审核商品
  get_evaluation: title + 'order/evaluation',                                 // 获取商品评价

  category_list: title + 'category/list',                                 // 获取类目
  create_category: title + 'category/create',                             // 新增类目
  update_category: title + 'category/update',                             // 修改类目
  delete_category: title + 'category/delete',                             // 删除类目

  scene_list: title + 'scene/list',                                       // 获取场景
  create_scene: title + 'scene/create',                                   // 新增场景
  update_scene: title + 'scene/update',                                   // 编辑场景


  brand_list: title + 'brand/list',                                       // 获取品牌
  create_brand: title + 'brand/create',                                   // 新增品牌
  update_brand: title + 'brand/update',                                   // 修改品牌
  off_shelves_brand: title + 'brand/off_shelves',                         // 下架品牌
  delete_brand: title + 'brand/delete',                                   // 删除品牌
  brand_get: title +'brand/get',                                         //获取单个品牌
  brand_get_banner: title +'brand/get_banner',                          //获取品牌banner


  items_list: title + 'items/list',                                       // 获取标签  0: 商品, 10:资讯, 20:优惠券, 40 品牌标签
  create_items: title + 'items/create',                                   // 创建标签
  update_items: title + 'items/update',                                   // 修改标签


  get_order_situation: title + 'order/get_order_situation',               // 获取订单概况
  get_all_order: title + 'order/list',                                    // 获取所有订单
  get_order_by_LOid: title + 'order/get',                                 // 获取订单详情
  order_count: title + 'order/count',                                     // 获取订单数量
  get_omfilter: title + 'order/get_omfilter',                             // 获取订单filter
  update_order_status: title + 'order/update_order_status',               // 更新订单状态
  update_order_price: title + 'order/update_price',                       // 待支付订单改价
  cancle_order: title + 'order/cancle',                                   // 取消订单

  get_list_company: title + 'logistic/list_company',                      // 快递公司
  send_order: title + 'logistic/send',                                    // 发货
  get_logistic: title + 'logistic/get',                                   // 获取物流


  supplizer_list: title + 'supplizer/list',                               // 供应商列表
  create_supplizer: title + 'supplizer/create',                           // 新增
  update_supplizer: title + 'supplizer/update',                           // 修改
  get_supplizer: title + 'supplizer/get',                                 // 获取供应商
  delete_supplizer: title + 'supplizer/delete',                           // 删除供应商
  set_user_level:title + 'subcommision/set_user_level',                     //设置用户等级
  subcommision_get_approval_list: title + 'subcommision/get_approval_list', //获取升级审批流列表


  //  审批
  agree_product: title + 'product/agree_product',                         // 同意上架商品

  get_all_qa: title + 'qa/get_all',                                       // 获取所有问题
  add_questanswer: title + 'qa/add_questanswer',                          // 添加问题
  add_questoutline: title + 'qa/add_questoutline',                        // 添加问题类型
  delete_questoutline: title + 'qa/delete_questoutline',                  // 删除问题分类
  delete_question: title + 'qa/delete_question',                          // 删除问题
  upload_file: title + 'file/upload?token=',                              // 上传图片
  batch_upload: title +'file/batch_upload',                    //批量上传图片
  excel_delivery:title +'excel/delivery',                     //上传批量发货
  excel_download:title +'excel/download',                //下载批量发货模版

  activity_list: title + 'activity/list',                                 // 获取正在进行中的活动
  activity_get: title + 'activity/get',                                   // 获取正在进行中的活动
  activity_update: title + 'activity/update',                             // 修改活动基础信息
  fresh_man_list: title + 'fresh_man/list_apply',                         // 获取新人首单商品列表
  fresh_man_apply_award: title + 'fresh_man/apply_award',                 // 申请参与新人首单
  fresh_man_reapply_award: title + 'fresh_man/reapply_award',                 // 重新申请参与新人首单
  fresh_man_update_award: title + 'fresh_man/update_award',               // 新人首单申请单修改
  fresh_man_shelf_award: title + 'fresh_man/shelf_award',                 // 撤销新人首单申请单申请
  guess_num_list: title + 'guess_num/list',                               // 获取自己的猜数字奖品申请列表
  guess_num_apply_award: title + 'guess_num/apply_award',                 // 申请添加猜数字奖品
  guess_num_shelf_award: title + 'guess_num/shelf_award',                 // 撤销自己猜数字奖品申请
  guess_num_update_apply: title + 'guess_num/update_apply',               // 修改猜数字奖品申请
  guess_num_delete: title + 'guess_num/delete',                           // 删除猜数字奖品申请
  guess_num_shelves: title + 'guess_num/shelves',                         // 下架猜数字奖品
  magic_box_list: title + 'magicbox/list',                                // 获取自己的魔盒奖品申请列表
  magic_box_apply_award: title + 'magicbox/apply_award',                  // 申请添加魔盒奖品
  magic_box_update_apply: title + 'magicbox/update_apply',                // 修改魔盒奖品申请
  magic_box_shelf_award: title + 'magicbox/shelf_award',                  // 撤销自己魔盒奖品申请
  magic_box_delete: title + 'magicbox/delete',                            // 删除魔盒奖品申请
  magic_box_shelves: title + 'magicbox/shelves',                          // 下架魔盒奖品

  get_commodity: title + 'commodity/get',                                 // 获取试用商品
  get_commodity_detail: title + 'commodity/get_commodity',                // 获取试用商品
  commodity_add: title + 'commodity/add',                                 // 添加试用商品
  update_commodity: title + 'commodity/update',                           // 修改试用商品
  del_commodity: title + 'commodity/del',                                 // 删除试用商品
  cancel_commodity: title + 'commodity/cancel',                           // 撤销试用商品
  resubmit_commodity: title + 'commodity/resubmit',                       // 重新提交试用商品
  shelves_commodity: title + 'commodity/shelves',                         // 下架试用商品

  timelimited_list:title +'timelimited/list_activity',                    //获取所有限时活动
  timelimited_product:title +'timelimited/list_product',                  //获取所有限时活动商品
  timelimited_create: title +'timelimited/create',                        //创建限时活动
  timelimited_update:title +'timelimited/update_activity',      //修改限时活动配置
  timelimited_apply_award:title +'timelimited/apply_award',     //限时活动添加商品
  timelimited_shelf_award:title + 'timelimited/shelf_award',    //撤销商品
  timelimited_del_award:title + 'timelimited/del_award',     //删除活动商品
  timelimited_update_award:title +'timelimited/update_award',    //编辑活动商品
  timelimited_get: title +'timelimited/get',           //获取限时商品详情
  integral_list: title +'integral/list',    //获取星币商城
  integral_get: title + 'integral/get', ///获取星币商城详情

  integral_cancel: title +'integral/cancel',//取消申请
  integral_apply: title +'integral/apply',//申请添加商品
  integral_update: title +'integral/update',//编辑商品
  integral_delete: title +'integral/delete',//删除申请
  integral_shelf: title +'integral/shelf',//下架

  guessgroup_list: title +'guessgroup/list',//  拼团竞猜列表
  guessgroup_apply: title +'guessgroup/apply',//申请拼团
  guessgroup_update: title +'guessgroup/update', //编辑拼图
  guessgroup_cancel: title +'guessgroup/cancel',//撤销拼团
  guessgroup_delete: title +'guessgroup/delete', //删除拼团
  guessgroup_shelf: title +'guessgroup/shelf',//下架商品


  get_all_news: title + 'news/get_all_news',                              // 获取资讯列表
  get_news_content: title + 'news/get_news_content',                      // 获取资讯详情
  create_news: title + 'news/create_news',                                // 发布资讯
  update_news: title + 'news/update_news',                                // 修改资讯
  del_news: title + 'news/del_news',                                      // 删除资讯
  news_shelves: title + 'news/news_shelves',                              // 资讯下架
  news_topic: title +'news/topic',                          //获取话题
  news_award: title +'news/award',                         //打赏圈子


  coupon_list: title + 'coupon/list',                                     // 获取平台优惠券列表
  coupon_create: title + 'coupon/create',                                 // 后台创建优惠券
  coupon_update: title + 'coupon/update',                                 // 后台修改优惠券
  coupon_delete: title + 'coupon/delete',                                 // 后台删除优惠券
  create_code: title + 'coupon/create_code',                //创建优惠吗
  update_code: title + 'coupon/update_code',           //开启/关闭兑换码
  get_code_list: title +'coupon/get_code_list',      //查看兑换码
  list_user_commison: title + 'user/list_user_commison',                  // 销售商列表(后台佣金)
  list_fans: title + 'user/list_fans',                                    // 销售商列表(后台佣金)
  update_user_commision: title + 'user/update_user_commision',            // 设置个人佣金
  get_commision: title + 'commision/get',                                 // 获取平台佣金详情
  update_commision: title + 'commision/update',                           // 设置平台佣金详情

  act_code_get_rule: title + 'act_code/get_rule',                         // 获取激活码规则
  act_code_set_rule: title + 'act_code/rule',                             // 设置激活码规则

  list_banner: title + 'index/list_banner',                               // 获取首页轮播图
  set_banner: title + 'index/set_banner',                                 // 设置首页轮播图
  update_banner: title + 'index/update_banner',                           // 修改首页轮播图

  get_entry: title +'index/get_entry',          //获取活动图
  set_entry: title + 'index/set_entry', ///修改活动图
  list_hypermarket_banner: title +'index/list_hypermarket_banner',    ///商城轮播图
  set_hypermarket_banner: title +'index/set_hypermarket_banner',     //修改商城轮播图

  get_inforcode: title + 'user/get_inforcode',                            // 获取验证码-管理员更改手机号

  agree_refund_apply: title + 'refund/agree_apply',                        // 售后订单
  back_confirm_recv: title + 'refund/back_confirm_recv',                   // 后台确认收货
  back_confirm_refund: title + 'refund/back_confirm_refund',               // 后台确认执行退款(售后订单确认收货后执行退款)
  get_all_address: title + 'user/get_all_address',                          // 获取用户所有地址
  add_address: title + 'user/add_address',                                  // 新增地址
  update_address: title + 'user/update_address',                            // 新增地址
  get_provinces: title + 'address/get_provinces',                            // 获取省份
  get_citys: title + 'address/get_citys',                            // 获取省份
  get_areas: title + 'address/get_areas',                            // 获取省份

  //  审批流
  get_dealing_approval: title + 'approval/get_dealing_approval',           // 管理员查看自己待审批数据-概览
  get_all_permissiontype: title + 'approval/get_all_permissiontype',       // 获取所有审批流类型
  get_approval_list: title + 'approval/get_approval_list',                 // 获取审批列表
  deal_approval: title + 'approval/deal_approval',                         // 管理员处理审批流
  get_approvalnotes: title + 'approval/get_approvalnotes',                 // 获取审批流所有流程
  list_approval_notes: title + 'approval/list_approval_notes',             // 获取审批流所有流程,跟上个相比不需要管理员token

  get_permissiontype: title + 'approval/get_permissiontype',                // 获取审批类型详情
  add_pi_and_pe_and_ap: title + 'approval/add_pi_and_pe_and_ap',           // 添加权限标签,修改用下面三个
  add_permissionitems: title + 'approval/add_permissionitems',             // 创建审批标签
  add_permission: title + 'approval/add_permission',                       // 给权限标签赋予权限
  add_adminpermission: title + 'approval/add_adminpermission',             // 绑定审批权限标签和管理员
  get_permission_admin_list: title + 'approval/get_permission_admin_list', // 获取审批权限下管理员列表
  delete_permission: title + 'approval/delete_permission',                  // 删除审批,多用途  pt:整个,pe:等级,pi标签

  get_all_signsetting: title + 'siginsetting/get_all_signsetting',          // 获取签到设置
  add_or_update_signsetting: title + 'siginsetting/add_or_update_signsetting',          // 新增获取修改签到设置
  get_signin_default: title + 'user/get_signin_default',                    // 新增获取修改签到设置
  set_signin_default: title + 'user/set_signin_default',                    // 设置默认签到规则

  get_cash_notes: title + 'user/get_cash_notes',                            // 获取提现申请
  apply_cash: title + 'user/apply_cash',                                    // 申请提现

  get_settlenment: title + 'user/get_settlenment',                           // 提现申请
  export_settlenment_xls: title + 'order/export_xls',                                    // 下载结算单
  settlenment: title + 'user/settlenment',                                   // 提现申请

  get_supplizeraccount: title + 'supplizer/get_supplizeraccount',            // 个人账户和开票信息
  set_supplizeraccount: title + 'supplizer/set_supplizeraccount',            // 设置个人账户和开票信息

  get_system_notes: title + 'supplizer/get_system_notes',                   // 获取通告
  add_update_notes: title + 'supplizer/add_update_notes',                    // 新增/修改通告

  get_club_list: title + 'club/list',//获取公告
  get_club_message: title + 'club/message',//获取公告详情
  create_club: title + 'club/create_message' ,///c创建公告
  update_club :title +'club/update_companymessage',//更新公告
  get_userwords: title +'club/get_userwords' ,///获取留言
  message_set: title +'message/set',             //编辑站内信
  message_get: title +'message/get',            //获取站内信
  news_location: title +'news/location',   //获取定位


//  小程序部分
  scenicspot_list: title +'scenicspot/list',//获取景区列表
  scenicspot_add: title +'scenicspot/add',//添加景区
  scenicspot_get: title +'scenicspot/get',//获取景区详情
  scenicspot_update: title +'scenicspot/update',//编辑景区
  scenicspot_delete: title +'scenicspot/delete',//删除景区

  set_play: title +'play/set_play',//创建活动
  get_play: title + 'play/get_play',//获取活动详情
  get_cost: title +'play/get_cost',//获取费用
  set_cost: title +'play/set_cost',//创建费用
  set_insurance: title +'play/set_insurance',//创建保险
  get_insurance: title +'play/get_insurance',//获取保险
  get_discount: title +'play/get_discount',//获取扣款
  set_discount: title +'play/set_discount',//设置扣款
  get_all_play: title +'play/get_all_play',//管理员获取活动列表
  get_play_list: title +'play/get_play_list',//个人获取活动列表
  download_team: title +'play/download_team',//下载报名信息表

  list_mp_banner: title +'index/list_mp_banner',//获取小程序轮播图
  set_mp_banner: title +'index/set_mp_banner',//设置小程序轮播图

  toilet_list: title +'scenicspot/toilet_list',//厕所列表
  get_toilet : title +'scenicspot/get_toilet',//获取厕所详情
  update_toilet: title +'scenicspot/update_toilet',//编辑厕所
  add_toilet: title +'scenicspot/add_toilet',//新增厕所

  travelrecord_list: title +'scenicspot/travelrecord_list',//获取游记或攻略
  get_travelrecord: title +'scenicspot/get_travelrecord',//获取游记或攻略的详情
  add_travelrecord: title +'scenicspot/add_travelrecord',//发布游记或攻略
  del_travelrecord : title +'scenicspot/del_travelrecord',//删除时光记录

  list_linkcontent: title +'index/list_linkcontent', //获取富文本详情
  set_linkcontent: title +'index/set_linkcontent',//设置富文本
  get_linkcontent: title +'index/get_linkcontent',//获取富文本详情

  feedback_list: title +'feedback/list',   //获取素材反馈
  feedback_details: title +'feedback/details',    // 获取反馈详情
  feedback_refund: title +'feedback/refund',     //返还押金
  feedback_refuse: title +'feedback/refuse', //拒绝
  ticket_list: title +'ticket/list',       //获取门票列表
  list_linkage: title +'ticket/list_linkage', //获取联动品台
  ticket_create: title +'ticket/create', //创建门票
  ticket_update: title +'ticket/update',//编辑门票
  ticket_get: title +'ticket/get', ///门票详情
  list_trade: title +'order/list_trade',//门票购买记录
  ticket_award: title +'ticket/award', //设置中奖

  list_activationtype: title +'activation/list_activationtype',//活跃分列表
  update_activationtype: title + 'activation/update_activationtype',//更新活跃分
  activation_select: title + 'activation/select',//加精
  activation_reward: title +'activation/reward',//打赏

  list_role: title +'play/list_role',//规则列表
  update_role: title +'play/update_role',//修改规则
  get_verifier: title +'supplizer/get_verifier',//获取核销员联系方式
  set_verifier: title +'supplizer/set_verifier',//设置核销员联系方式
};

export default api
