const inputInicio = document.getElementById("inicio");
const inputFim = document.getElementById("fim");
const botaoSalvar = document.getElementById("salvar");
const divHistorico = document.getElementById("historico");

let registros = JSON.parse(localStorage.getItem("registros")) || [];

function calcularDias(inicio, fim) {
  const dataInicio = new Date(inicio);
  const dataFim = new Date(fim);

  // diferença em milissegundos
  const diff = dataFim - dataInicio;

  // converte para dias
  const dias = Math.round(diff / (1000 * 60 * 60 * 24)) + 1; // +1 pra contar o dia inicial também
  return dias;
}

function renderizarHistorico() {
  divHistorico.innerHTML = "";

  if (registros.length === 0) {
    divHistorico.innerHTML = "<p>Nenhum registro ainda.</p>";
    return;
  }

  registros.forEach((registro, index) => {
    const dias = calcularDias(registro.inicio, registro.fim);

    const item = document.createElement("div");
    item.className = "item";

    item.innerHTML = `
      <p><strong>Início:</strong> ${registro.inicio}</p>
      <p><strong>Fim:</strong> ${registro.fim}</p>
      <p><strong>Duração:</strong> ${dias} dia(s)</p>
      <button class="apagar" data-index="${index}">Apagar</button>
      <hr>
    `;

    divHistorico.appendChild(item);
  });

  document.querySelectorAll(".apagar").forEach((btn) => {
    btn.addEventListener("click", () => {
      const i = Number(btn.dataset.index);
      registros.splice(i, 1);
      localStorage.setItem("registros", JSON.stringify(registros));
      renderizarHistorico();
    });
  });
}

botaoSalvar.addEventListener("click", () => {
  const inicio = inputInicio.value;
  const fim = inputFim.value;

  if (!inicio || !fim) {
    alert("Preencha as duas datas 🙂");
    return;
  }

  // validação: fim não pode ser antes do início
  if (fim < inicio) {
    alert("A data de fim não pode ser antes da data de início 🙂");
    return;
  }

  registros.push({ inicio, fim });
  localStorage.setItem("registros", JSON.stringify(registros));

  inputInicio.value = "";
  inputFim.value = "";
  renderizarHistorico();
});

renderizarHistorico();
