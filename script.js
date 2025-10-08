// ========== LOGIN & CADASTRO ==========
const loginForm = document.getElementById("loginForm");

if (loginForm) {
  loginForm.addEventListener("submit", function(e) {
    e.preventDefault();
    const email = document.getElementById("email").value;
    const senha = document.getElementById("senha").value;

    const usuario = JSON.parse(localStorage.getItem("usuario"));

    if (usuario && usuario.email === email && usuario.senha === senha) {
      window.location.href = "dashboard.html";
    } else {
      alert("E-mail ou senha incorretos!");
    }
  });
}

function abrirCadastro() {
  const email = prompt("Digite seu e-mail");
  const senha = prompt("Digite sua senha");

  if (email && senha) {
    localStorage.setItem("usuario", JSON.stringify({ email, senha }));
    alert("Cadastro concluído! Agora faça login.");
  } else {
    alert("E-mail e senha obrigatórios!");
  }
}

function logout() {
  localStorage.removeItem("usuario");
  window.location.href = "index.html";
}

// ========== PEDIDOS ==========
const listaPedidos = document.getElementById("listaPedidos");
const inputPedido = document.getElementById("novoPedido");

let pedidos = JSON.parse(localStorage.getItem("pedidos")) || [];

function renderizarPedidos() {
  if (!listaPedidos) return;
  listaPedidos.innerHTML = "";
  pedidos.forEach((p, i) => {
    const li = document.createElement("li");
    li.innerHTML = `
      ${p.texto || p}
      <span>
        <button onclick="concluirPedido(${i})">✔</button>
        <button onclick="deletarPedido(${i})" style="background:#c10000; color:white;">✖</button>
      </span>
    `;
    listaPedidos.appendChild(li);
  });
}

function adicionarPedido() {
  if (!inputPedido.value) return;
  pedidos.push({ texto: inputPedido.value, status: "Ativo" });
  localStorage.setItem("pedidos", JSON.stringify(pedidos));
  inputPedido.value = "";
  renderizarPedidos();
}

function concluirPedido(i) {
  pedidos[i].status = "Concluído";
  localStorage.setItem("pedidos", JSON.stringify(pedidos));
  renderizarPedidos();
}

function deletarPedido(i) {
  if (confirm("Deseja realmente deletar este pedido?")) {
    pedidos.splice(i, 1);
    localStorage.setItem("pedidos", JSON.stringify(pedidos));
    renderizarPedidos();
  }
}

renderizarPedidos();
