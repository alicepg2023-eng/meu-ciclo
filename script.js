const inputInicio = document.getElementById("inicio");
const inputFim = document.getElementById("fim");
const botaoSalvar = document.getElementById("salvar");
const divHistorico = document.getElementById("historico");

let registros = JSON.parse(localStorage.getItem("registros")) || [];
let editandoIndex = null; // null = não está editando

function salvarNoNavegador() {
  localStorage.setItem("registros", JSON.stringify(registros));
}

function calcularDias(inicio, fim) {
  if (!fim) return null;
  const dataInicio = new Date(inicio);
  const dataFim = new Date(fim);
  const diff = dataFim - dataInicio;
  return Math.round(diff / (1000 * 60 * 60 * 24)) + 1;
}

function limparFormulario() {
  inputInicio.value = "";
  inputFim.value = "";
  editandoIndex = null;
  botaoSalvar.textContent = "Salvar";
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
      <p><strong>Fim:</strong> ${registro.fim ? registro.fim : "— (ainda não)"}</p>
      <p><strong>Duração:</strong> ${dias ? dias + " dia(s)" : "—"}</p>

      ${registro.fim ? "" : `<button class="finalizar" data-index="${index}">Finalizar</button>`}
      <button class="editar" data-index="${index}">Editar</button>
      <button class="apagar" data-index="${index}">Apagar</button>
      <hr>
    `;

    divHistorico.appendChild(item);
  });

  // Apagar
  document.querySelectorAll(".apagar").forEach((btn) => {
    btn.addEventListener("click", () => {
      const i = Number(btn.dataset.index);
      registros.splice(i, 1);
      salvarNoNavegador();
      // se estava editando esse item, cancela a edição
      if (editandoIndex === i) limparFormulario();
      renderizarHistorico();
    });
  });

  // Editar (usa os inputs de cima -> abre calendário)
  document.querySelectorAll(".editar").forEach((btn) => {
    btn.addEventListener("click", () => {
      const i = Number(btn.dataset.index);
      editandoIndex = i;

      inputInicio.value = registros[i].inicio;
      inputFim.value = registros[i].fim || "";

      botaoSalvar.textContent = "Salvar alterações";
      inputInicio.scrollIntoView({ behavior: "smooth", block: "center" });
      inputInicio.focus(); // no celular, tocar abre o calendário quando clicar no campo
    });
  });

  // Finalizar (também usa inputs de cima)
  document.querySelectorAll(".finalizar").forEach((btn) => {
    btn.addEventListener("click", () => {
      const i = Number(btn.dataset.index);
      editandoIndex = i;

      inputInicio.value = registros[i].inicio;
      inputFim.value = ""; // foco no fim
      botaoSalvar.textContent = "Salvar alterações";

      inputFim.scrollIntoView({ behavior: "smooth", block: "center" });
      inputFim.focus();
    });
  });
}

botaoSalvar.addEventListener("click", () => {
  const inicio = inputInicio.value;
  const fim = inputFim.value;

  if (!inicio) {
    alert("Preencha pelo menos a data de início 🙂");
    return;
  }

  if (fim && fim < inicio) {
    alert("A data de fim não pode ser antes da data de início 🙂");
    return;
  }

  // Se está editando, atualiza; se não, cria novo
  if (editandoIndex !== null) {
    registros[editandoIndex].inicio = inicio;
    registros[editandoIndex].fim = fim || "";
  } else {
    registros.push({ inicio, fim: fim || "" });
  }

  salvarNoNavegador();
  limparFormulario();
  renderizarHistorico();
});

renderizarHistorico();
const botaoTema = document.getElementById("toggleTema");

// Carrega tema salvo
if (localStorage.getItem("tema") === "dark") {
  document.body.classList.add("dark");
  botaoTema.textContent = "☀️";
}

botaoTema.addEventListener("click", () => {
  document.body.classList.toggle("dark");

  if (document.body.classList.contains("dark")) {
    localStorage.setItem("tema", "dark");
    botaoTema.textContent = "☀️";
  } else {
    localStorage.setItem("tema", "light");
    botaoTema.textContent = "🌙";
  }
});
