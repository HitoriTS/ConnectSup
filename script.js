const form = document.getElementById("ticketForm");
const listaChamados = document.getElementById("listaChamados");

let chamados = JSON.parse(localStorage.getItem("chamados")) || [];

function renderizarChamados() {
  listaChamados.innerHTML = "";
  chamados.forEach((c, i) => {
    const div = document.createElement("div");
    div.classList.add("ticket");
    div.innerHTML = `
      <strong>${c.empresa}</strong> → ${c.fornecedor}<br>
      <em>${c.descricao}</em><br>
      <small>Status: ${c.status}</small>
      <button onclick="alterarStatus(${i})">✔ Concluir</button>
    `;
    listaChamados.appendChild(div);
  });
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const novo = {
    empresa: form.empresa.value,
    fornecedor: form.fornecedor.value,
    descricao: form.descricao.value,
    status: "Pendente"
  };
  chamados.push(novo);
  localStorage.setItem("chamados", JSON.stringify(chamados));
  form.reset();
  renderizarChamados();
});

function alterarStatus(i) {
  chamados[i].status = "Concluído";
  localStorage.setItem("chamados", JSON.stringify(chamados));
  renderizarChamados();
}

renderizarChamados();
