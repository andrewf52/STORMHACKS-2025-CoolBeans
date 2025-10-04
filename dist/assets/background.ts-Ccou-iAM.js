console.log("CoolBeans background running");chrome.runtime.onInstalled.addListener(()=>{console.log("CoolBeans installed")});chrome.runtime.onMessage.addListener((e,o,n)=>{console.log("background received message",e,"from",o),n({ok:!0,echo:e})});
//# sourceMappingURL=background.ts-Ccou-iAM.js.map
