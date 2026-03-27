export interface RefreshPagePayload {
  path: string
}

export interface AppRuntimeDeps {
  primaryColor: string
  applyThemeColors: () => void
  setPrimaryColor: (color: string) => void
  subscribeRefreshPage: (
    handler: (payload: RefreshPagePayload) => void,
  ) => () => void
  notifyRefreshPage: (content: string) => void
  reloadPage: () => void
  startUpdateDetector: () => void | (() => void)
  destroyMessages: () => void
  destroyModals: () => void
  t: (key: string) => string
  scheduleReload?: (reload: () => void) => void
}

export function setupAppRuntime(deps: AppRuntimeDeps) {
  const {
    applyThemeColors,
    destroyMessages,
    destroyModals,
    notifyRefreshPage,
    primaryColor,
    reloadPage,
    scheduleReload = cb => cb(),
    setPrimaryColor,
    startUpdateDetector,
    subscribeRefreshPage,
    t,
  } = deps

  applyThemeColors()
  setPrimaryColor(primaryColor)

  const unsubscribeRefreshPage = subscribeRefreshPage(({ path }) => {
    if (!path) {
      return
    }

    notifyRefreshPage(`${t('app.event.reload.front')} ${path} ${t('app.event.reload.back')}`)
    scheduleReload(reloadPage)
  })

  const stopUpdateDetector = startUpdateDetector()

  return () => {
    unsubscribeRefreshPage()
    stopUpdateDetector?.()
    destroyMessages()
    destroyModals()
  }
}
