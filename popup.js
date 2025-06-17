async function fetchDados() {
  try {
    const res = await fetch("https://nivelguaiba.com.br/lajeado");
    const html = await res.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");

    const nivelText = doc.querySelector(".medicao-principal__nivel--normal")?.textContent.trim();
    const labelText = doc.querySelector(".medicao-principal__label")?.textContent.trim();
    const tendenciaText = doc.querySelector(".medicao-principal__tendencia")?.textContent.trim();

    const nivel = parseFloat(nivelText.replace(",", "."));

    // Extrair número da cota do texto do label com regex
    const cotaAlerta = 19; // Valor fixo da cota de alerta de Lajeado

    const nivelDiv = document.getElementById("nivel");
    nivelDiv.textContent = nivelText;

    // Aplicar cor baseada na diferença entre nível e cota
    nivelDiv.classList.remove("nivel-verde", "nivel-amarelo", "nivel-vermelho");

    if (cotaAlerta !== null) {
      const diferenca = cotaAlerta - nivel;

      if (diferenca >= 2) {
        nivelDiv.classList.add("nivel-verde");
      } else if (diferenca >= 0.5) {
        nivelDiv.classList.add("nivel-amarelo");
      } else  {
        nivelDiv.classList.add("nivel-vermelho");
      }
    }

    document.getElementById("label").textContent = labelText;
    document.getElementById("tendencia").textContent = tendenciaText;

    // Atualiza localStorage (opcional)
    localStorage.setItem("nivel", nivelText);
    localStorage.setItem("label", labelText);
    localStorage.setItem("tendencia", tendenciaText);

  } catch (error) {
    document.getElementById("nivel").textContent = "Erro";
    document.getElementById("label").textContent = "";
    document.getElementById("tendencia").textContent = "";
    console.error("Erro ao buscar dados:", error);
  }
}

document.addEventListener("DOMContentLoaded", fetchDados);
