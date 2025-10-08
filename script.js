const form = document.getElementById("ticketForm");
const listaChamados = document.getElementById("listaChamados");

let chamados = JSON.parse(localStorage.getItem("chamados")) || [];

function deletarChamado(i) {
  if (confirm("Tem certeza que deseja arquivar este chamado?")) {
    chamados[i].status = "Arquivado";
    localStorage.setItem("chamados", JSON.stringify(chamados));
    renderizarChamados();
  }
}

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
        <button onclick="deletarChamado(${i})" style="background-color:#c10000; margin-left:5px;">✖ Arquivar</button>
      `;
      listaChamados.appendChild(div);
    }
  });
}


// ----- NOVA FUNÇÃO: DELETAR CHAMADO -----
function deletarChamado(i) {
  if (confirm("Tem certeza que deseja deletar este chamado?")) {
    chamados.splice(i, 1); // remove o chamado do array
    localStorage.setItem("chamados", JSON.stringify(chamados)); // atualiza localStorage
    renderizarChamados(); // re-renderiza a lista
  }
}
});

function alterarStatus(i) {
  chamados[i].status = "Concluído";
  localStorage.setItem("chamados", JSON.stringify(chamados));
  renderizarChamados();
}

renderizarChamados();
