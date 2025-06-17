chrome.runtime.onInstalled.addListener(() => {
  chrome.alarms.create("checarNivelTaquari", { periodInMinutes: 30 });
});

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === "checarNivelTaquari") {
    chrome.tabs.create({ url: "https://nivelguaiba.com.br/lajeado", active: false }, (tab) => {
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ["content.js"]
      });
    });
  }
});

chrome.runtime.onMessage.addListener((msg, sender) => {
  if (msg.action === "alertaCota") {
    chrome.notifications.create({
      type: "basic",
      iconUrl: "icon.png",
      title: "⚠️ Alerta: Cota de Alerta Atingida!",
      message: `Nível atual: ${msg.nivel}. Atenção necessária.`,
      priority: 2
    });
  }

  if (msg.action === "closeTab" && sender.tab?.id) {
    chrome.tabs.remove(sender.tab.id);
  }
});
