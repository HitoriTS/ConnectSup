const form = document.getElementById("ticketForm");
const listaChamados = document.getElementById("listaChamados");

let chamados = JSON.parse(localStorage.getItem("chamados")) || [];

// ----- FUNÇÃO: ALTERAR STATUS -----
function alterarStatus(i) {
  chamados[i].status = "Concluído";
  localStorage.setItem("chamados", JSON.stringify(chamados));
  renderizarChamados();
}

// ----- FUNÇÃO: ARQUIVAR CHAMADO -----
function arquivarChamado(i) {
  if (confirm("Tem certeza que deseja arquivar este chamado?")) {
    chamados[i].status = "Arquivado";
    localStorage.setItem("chamados", JSON.stringify(chamados));
    renderizarChamados();
  }
}

// ----- FUNÇÃO: RENDERIZAR CHAMADOS -----
function renderizarChamados() {
  listaChamados.innerHTML = "";
  chamados.forEach((c, i) => {
    if (c.status !== "Arquivado") { // só mostra chamados ativos
      const div = document.createElement("div");
      div.classList.add("ticket");
      div.innerHTML = `
        <strong>${c.empresa}</strong> → ${c.fornecedor}<br>
        <em>${c.descricao}</em><br>
        <small>Status: ${c.status}</small><br>
        <button onclick="alterarStatus(${i})">✔ Concluir</button>
        <button onclick="arquivarChamado(${i})" style="background-color:#c10000; margin-left:5px;">✖ Arquivar</button>
      `;
      listaChamados.appendChild(div);
    }
  });
}

// ----- FUNÇÃO: ADICIONAR NOVO CHAMADO -----
form.addEventListener("submit", function (e) {
  e.preventDefault();

  const empresa = document.getElementById("empresa").value;
  const fornecedor = document.getElementById("fornecedor").value;
  const descricao = document.getElementById("descricao").value;

  const novoChamado = {
    empresa,
    fornecedor,
    descricao,
    status: "Pendente",
  };

  chamados.push(novoChamado);
  localStorage.setItem("chamados", JSON.stringify(chamados));

  form.reset();
  renderizarChamados();
});

// ----- INICIALIZAÇÃO -----
renderizarChamados();
