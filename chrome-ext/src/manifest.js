import { defineManifest } from "@crxjs/vite-plugin";
export default defineManifest({
    manifest_version: 3,
    name: "My MV3 Extension",
    version: "0.1.0",
    description: "Vite + TS + CRXJS minimal starter",
    action: { default_popup: "popup/index.html" },
    background: { service_worker: "background.js", type: "module" },
    content_scripts: [
        { matches: ["https://*/*", "http://*/*"], js: ["content.js"] }
    ],
    permissions: ["storage", "activeTab", "scripting"],
    host_permissions: ["https://*/*", "http://*/*"]
});
