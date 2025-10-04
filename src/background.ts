console.log('CoolBeans background running')

chrome.runtime.onInstalled.addListener(() => {
  console.log('CoolBeans installed')
})

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('background received message', message, 'from', sender)
  // simple echo response
  sendResponse({ ok: true, echo: message })
  // returning true would indicate async response; not needed here
})
