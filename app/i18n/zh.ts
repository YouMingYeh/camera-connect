const zh = {
  common: {
    ok: "確定！",
    cancel: "取消",
    back: "返回",
    logOut: "登出",
  },
  welcomeScreen: {
    postscript:
      "嘿 — 這可能不是你的應用程式實際的樣子。 (除非你的設計師交給你這些畫面，那樣的話，就這樣上線吧！)",
    readyForLaunch: "你的應用程式，幾乎準備好要上線了！",
    exciting: "（哦，這真令人興奮！）",
    letsGo: "我們開始吧！",
  },
  errorScreen: {
    title: "出錯了！",
    friendlySubtitle:
      "這是用戶在生產環境遇到錯誤時會看到的畫面。你會想要自定義這個消息（位於 `app/i18n/en.ts`）並可能也會自定義佈局（位於 `app/screens/ErrorScreen`）。如果你想要完全移除它，查看 `app/app.tsx` 中的 <ErrorBoundary> 組件。",
    reset: "重置應用程式",
    traceTitle: "來自 %{name} 堆棧的錯誤",
  },
  emptyStateComponent: {
    generic: {
      heading: "太空了...太悲傷了",
      content: "還沒有找到數據。試著點擊按鈕刷新或重新加載應用。",
      button: "再試一次",
    },
  },

  errors: {
    invalidEmail: "無效的電子郵件地址。",
  },
  loginScreen: {
    signIn: "登入",
    enterDetails:
      "在下面輸入你的詳細資料以解鎖極秘信息。你絕對猜不到我們在等什麼。或許你會猜到；這裡不是火箭科學。",
    emailFieldLabel: "電子郵件",
    passwordFieldLabel: "密碼",
    emailFieldPlaceholder: "輸入你的電子郵件地址",
    passwordFieldPlaceholder: "在這裡輸入超級秘密的密碼",
    tapToSignIn: "點擊登入！",
    hint: "提示：你可以使用任何電子郵件地址和你最喜歡的密碼 :)",
  },
  demoNavigator: {
    componentsTab: "組件",
    debugTab: "調試",
    communityTab: "社區",
    podcastListTab: "播客",
    cameraTab: "相機",
    albumTab: "相簿",
    exploreTab: "探索",
    notificationsTab: "通知",
    settingsTab: "設定",
    profileTab: "個人資料",
  },
  demoCommunityScreen: {
    title: "與社區連接",
    tagLine: "加入 Infinite Red 的 React Native 工程師社區，提升你的應用開發能力！",
    joinUsOnSlackTitle: "加入 Slack",
    joinUsOnSlack:
      "希望有個地方能與世界各地的 React Native 工程師連接嗎？加入 Infinite Red Community Slack 的對話！我們不斷增長的社區是一個安全的空間，可以提問、向他人學習並擴展你的網絡。",
    joinSlackLink: "加入 Slack 社區",
    makeIgniteEvenBetterTitle: "讓 Ignite 變得更好",
    makeIgniteEvenBetter:
      "有想法讓 Ignite 變得更好嗎？我們很高興聽到這個！我們一直在尋找其他想要幫助我們構建最佳 React Native 工具的人。加入我們在 GitHub 上的行列，共同建設 Ignite 的未來。",
    contributeToIgniteLink: "貢獻 Ignite",
    theLatestInReactNativeTitle: "React Native 的最新資訊",
    theLatestInReactNative: "我們在這裡為你提供 React Native 所有的最新資訊。",
    reactNativeRadioLink: "React Native 電台",
    reactNativeNewsletterLink: "React Native 通訊",
    reactNativeLiveLink: "React Native 直播",
    chainReactConferenceLink: "Chain React 會議",
    hireUsTitle: "雇用 Infinite Red 為你的下一個項目",
    hireUs:
      "無論是運行整個項目還是通過我們的實操訓練讓團隊加速，Infinite Red 都可以幫助解決幾乎任何 React Native 項目。",
    hireUsLink: "給我們留言",
  },
  demoShowroomScreen: {
    jumpStart: "組件讓你的項目快速啟動！",
    lorem2Sentences:
      "Nulla cupidatat deserunt amet quis aliquip nostrud do adipisicing. Adipisicing excepteur elit laborum Lorem adipisicing do duis.",
    demoHeaderTxExample: "耶",
    demoViaTxProp: "透過 `tx` 屬性",
    demoViaSpecifiedTxProp: "透過 `{{prop}}Tx` 屬性",
  },
  demoDebugScreen: {
    howTo: "如何操作",
    title: "調試",
    tagLine: "恭喜，你擁有一個非常先進的 React Native 應用模板。利用這個範本吧！",
    reactotron: "發送到 Reactotron",
    reportBugs: "報告錯誤",
    demoList: "示例列表",
    demoPodcastList: "示例播客列表",
    androidReactotronHint:
      "如果這不起作用，確保 Reactotron 桌面應用正在運行，從你的終端運行 adb reverse tcp:9090 tcp:9090，並重新加載應用。",
    iosReactotronHint: "如果這不起作用，確保 Reactotron 桌面應用正在運行並重新加載應用。",
    macosReactotronHint: "如果這不起作用，確保 Reactotron 桌面應用正在運行並重新加載應用。",
    webReactotronHint: "如果這不起作用，確保 Reactotron 桌面應用正在運行並重新加載應用。",
    windowsReactotronHint: "如果這不起作用，確保 Reactotron 桌面應用正在運行並重新加載應用。",
  },
  demoPodcastListScreen: {
    title: "React Native Radio 節目",
    onlyFavorites: "只顯示收藏",
    favoriteButton: "收藏",
    unfavoriteButton: "取消收藏",
    accessibility: {
      cardHint: "雙擊以聆聽節目。長按並雙擊以{{action}}此節目。",
      switch: "打開以僅顯示收藏",
      favoriteAction: "切換收藏",
      favoriteIcon: "未收藏的節目",
      unfavoriteIcon: "已收藏的節目",
      publishLabel: "發布日期 {{date}}",
      durationLabel: "時長：{{hours}}小時 {{minutes}}分鐘 {{seconds}}秒",
    },
    noFavoritesEmptyState: {
      heading: "這裡看起來有點空",
      content: "還沒有添加任何收藏。點擊節目上的心形圖標，將它添加到你的收藏中！",
    },
  },
}

export default zh
export type Translations = typeof zh
