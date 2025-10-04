console.log('CoolBeans background running')

chrome.runtime.onInstalled.addListener(() => {
  console.log('CoolBeans installed')
})
