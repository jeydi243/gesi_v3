export default defineNuxtRouteMiddleware((to) => {
    // if (to.params.id === '1') {
    //   return abortNavigation()
    // }
    if (to.path !== '/') {
      return navigateTo('/login')
    }
  })
