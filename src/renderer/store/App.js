import { ipcRenderer } from 'electron'
import router from '../router'
import { LightTheme, DarkTheme } from '../utils/theme'
import Visibility from '~/src/constants/visibility'
import DisplayStyle from '~/src/constants/displayStyle'
import Theme from '~/src/constants/theme'
import TimeFormat from '~/src/constants/timeFormat'
import Language from '~/src/constants/language'

const App = {
  namespaced: true,
  state: {
    theme: LightTheme,
    fontSize: 14,
    displayNameStyle: DisplayStyle.DisplayNameAndUsername.value,
    tootVisibility: Visibility.Public.value,
    notify: {
      reply: true,
      reblog: true,
      favourite: true,
      follow: true
    },
    timeFormat: TimeFormat.Absolute.value,
    language: Language.en.key
  },
  mutations: {
    updateTheme (state, themeKey) {
      switch (themeKey) {
        case Theme.Light.key:
          state.theme = LightTheme
          break
        case Theme.Dark.key:
          state.theme = DarkTheme
          break
        default:
          state.theme = LightTheme
          break
      }
    },
    updateFontSize (state, value) {
      state.fontSize = value
    },
    updateDisplayNameStyle (state, value) {
      state.displayNameStyle = value
    },
    updateTootVisibility (state, value) {
      state.tootVisibility = value
    },
    updateNotify (state, notify) {
      state.notify = notify
    },
    updateTimeFormat (state, format) {
      state.timeFormat = format
    },
    updateLanguage (state, key) {
      state.language = key
    }
  },
  actions: {
    watchShortcutsEvents () {
      ipcRenderer.on('open-preferences', (event) => {
        router.push('/preferences/general')
      })
    },
    removeShortcutsEvents () {
      ipcRenderer.removeAllListeners('open-preferences')
    },
    loadPreferences ({ commit }) {
      return new Promise((resolve, reject) => {
        ipcRenderer.send('get-preferences')
        ipcRenderer.once('error-get-preferences', (event, err) => {
          ipcRenderer.removeAllListeners('response-get-preferences')
          reject(err)
        })
        ipcRenderer.once('response-get-preferences', (event, conf) => {
          ipcRenderer.removeAllListeners('error-get-preferences')
          commit('updateTheme', conf.general.theme)
          commit('updateDisplayNameStyle', conf.general.displayNameStyle)
          commit('updateFontSize', conf.general.fontSize)
          commit('updateTootVisibility', conf.general.tootVisibility)
          commit('updateNotify', conf.notification.notify)
          commit('updateTimeFormat', conf.general.timeFormat)
          commit('updateLanguage', conf.language.language)
          resolve(conf)
        })
      })
    }
  }
}

export default App
