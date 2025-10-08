// Login simulado
const loginForm = document.getElementById("loginForm");
if (loginForm) {
  loginForm.addEventListener("submit", function(e) {
    e.preventDefault();
    const email = document.getElementById("email").value;
    const senha = document.getElementById("senha").value;
    // Salva usuário no localStorage
    localStorage.setItem("usuario", JSON.stringify({ email }));
    window.location.href = "dashboard.html";
  });
}

// Logout
function logout() {
  localStorage.removeItem("usuario");
}

// Pedidos (Dashboard)
const listaPedidos = document.getElementById("listaPedidos");
const inputPedido = document.getElementById("novoPedido");

let pedidos = JSON.parse(localStorage.getItem("pedidos")) || [];

function renderizarPedidos() {
  if (!listaPedidos) return;
  listaPedidos.innerHTML = "";
  pedidos.forEach((p, i) => {
    const li = document.createElement("li");
    li.innerHTML = `
      ${p}
      <button onclick="deletarPedido(${i})">Deletar</button>
    `;
    listaPedidos.appendChild(li);
  });
}

function adicionarPedido() {
  if (!inputPedido.value) return;
  pedidos.push(inputPedido.value);
  localStorage.setItem("pedidos", JSON.stringify(pedidos));
  inputPedido.value = "";
  renderizarPedidos();
}

function deletarPedido(i) {
  pedidos.splice(i, 1);
  localStorage.setItem("pedidos", JSON.stringify(pedidos));
  renderizarPedidos();
}

renderizarPedidos();
