setTimeout(() => {
  const nivelElement = document.querySelector(".medicao-principal__nivel--normal");
  const cotaElement = document.querySelector(".medicao-principal__cota-alerta");
  const label = document.querySelector(".medicao-principal__label");
  const tendencia = document.querySelector(".medicao-principal__tendencia");

  const nivel = parseFloat(nivelElement?.textContent.replace(",", ".") || "0");
  const cota = 17.5; // Valor fixo da cota de alerta de Lajeado

  if (nivelElement && cotaElement && nivel >= cota) {
    console.error("Cota de alerta atingida ou ultrapassada!");
    chrome.runtime.sendMessage({
      action: "alertaCota",
      nivel: nivelElement.textContent.trim()
    });
  }

  localStorage.setItem("nivel", nivelElement?.textContent.trim());
  localStorage.setItem("label", label?.textContent.trim());
  localStorage.setItem("tendencia", tendencia?.textContent.trim());

  chrome.runtime.sendMessage({ action: "closeTab" });
}, 4000);
