const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  visitedViews: state => state.tagsView.visitedViews,
  cachedViews: state => state.tagsView.cachedViews,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  roles: state => state.user.roles,
  size: state => state.app.size,
  errorLogs: state => state.errorLog.logs,
  permission_routers: state => state.permission.routers,
  addRouters: state => state.permission.addRouters,
  userInfo: state => state.user.userInfo,

}
export default getters