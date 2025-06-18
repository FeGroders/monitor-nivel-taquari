async function fetchDados() {
  try {
    const res = await fetch("https://nivelguaiba.com.br/lajeado");
    const html = await res.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");

    const nomeRio =
      doc.querySelector(".cabecalho-pagina h1")?.textContent.trim() ||
      "Rio desconhecido";
    const nivelText = doc
      .querySelector(
        ".medicao-principal__nivel--normal, .medicao-principal__nivel--alerta, .medicao-principal__nivel--acima-cota"
      )
      ?.textContent.trim();
    const labelText = doc
      .querySelector(".medicao-principal__label")
      ?.textContent.trim();
    const tendenciaText = doc
      .querySelector(".medicao-principal__tendencia")
      ?.textContent.trim();

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
      } else {
        nivelDiv.classList.add("nivel-vermelho");
      }
    }

    document.getElementById("nomeRio").textContent = "🌊 " + nomeRio;
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

function renderReferencias() {
  const lista = document.getElementById("referencias-list");
  const referencias = JSON.parse(localStorage.getItem("referencias") || "[]");

  lista.innerHTML = "";

  referencias.forEach((ref, index) => {
    const item = document.createElement("div");
    item.className = "referencia-item";

    const nomeInput = document.createElement("input");
    nomeInput.type = "text";
    nomeInput.className = "input-nome";
    nomeInput.value = ref.nome;
    nomeInput.addEventListener("input", () => {
      referencias[index].nome = nomeInput.value;
      salvarReferencias(referencias);
    });

    const cotaInput = document.createElement("input");
    cotaInput.type = "number";
    cotaInput.className = "input-cota";
    cotaInput.step = "0.01";
    cotaInput.value = ref.cota;
    cotaInput.addEventListener("input", () => {
      referencias[index].cota = parseFloat(cotaInput.value);
      salvarReferencias(referencias);
    });

    const excluirBtn = document.createElement("button");
    excluirBtn.textContent = "🗑️";
    excluirBtn.addEventListener("click", () => {
      referencias.splice(index, 1);
      salvarReferencias(referencias);
      renderReferencias();
    });

    item.appendChild(nomeInput);
    item.appendChild(cotaInput);
    item.appendChild(excluirBtn);

    lista.appendChild(item);
  });
}

function salvarReferencias(referencias) {
  localStorage.setItem("referencias", JSON.stringify(referencias));
}

document.getElementById("btnAdicionar").addEventListener("click", () => {
  const referencias = JSON.parse(localStorage.getItem("referencias") || "[]");
  referencias.push({ nome: "", cota: 0 });
  salvarReferencias(referencias);
  renderReferencias();
});

document.addEventListener("DOMContentLoaded", renderReferencias);

document.addEventListener("DOMContentLoaded", fetchDados);
