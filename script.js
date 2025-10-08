// ---------- UTILITÁRIOS ----------
function $(id){ return document.getElementById(id); }

// ---------- AUTENTICAÇÃO (login / cadastro / sessão) ----------
document.addEventListener("DOMContentLoaded", () => {
  // elementos
  const loginForm = $("loginForm");
  const registerForm = $("registerForm");
  const showRegister = $("showRegister");
  const showLogin = $("showLogin");
  const registerCard = $("registerCard");

  // alternar exibição
  if (showRegister) showRegister.addEventListener("click", e => {
    e.preventDefault();
    registerCard.classList.remove("hidden");
    loginForm.closest(".card").classList.add("hidden");
  });
  if (showLogin) showLogin.addEventListener("click", e => {
    e.preventDefault();
    registerCard.classList.add("hidden");
    loginForm.closest(".card").classList.remove("hidden");
  });

  // cadastro
  if (registerForm) {
    registerForm.addEventListener("submit", e => {
      e.preventDefault();
      const nome = $("regNome").value.trim();
      const email = $("regEmail").value.trim().toLowerCase();
      const senha = $("regSenha").value;
      const plano = $("regPlano").value;

      if (!nome || !email || !senha) { alert("Preencha todos os campos."); return; }

      const users = JSON.parse(localStorage.getItem("users") || "[]");
      if (users.find(u => u.email === email)) { alert("E-mail já cadastrado."); return; }

      users.push({ nome, email, senha, plano });
      localStorage.setItem("users", JSON.stringify(users));
      // já faz login após cadastro
      localStorage.setItem("currentUser", JSON.stringify({ nome, email, plano }));
      window.location.href = "dashboard.html";
    });
  }

  // login
  if (loginForm) {
    loginForm.addEventListener("submit", e => {
      e.preventDefault();
      const email = $("loginEmail").value.trim().toLowerCase();
      const senha = $("loginSenha").value;

      const users = JSON.parse(localStorage.getItem("users") || "[]");
      const user = users.find(u => u.email === email && u.senha === senha);

      if (user) {
        localStorage.setItem("currentUser", JSON.stringify({ nome: user.nome, email: user.email, plano: user.plano }));
        window.location.href = "dashboard.html";
      } else {
        alert("E-mail ou senha incorretos.");
      }
    });
  }

  // Se já estiver em dashboard, inicializa funcionalidades de pedidos
  if (window.location.pathname.endsWith("dashboard.html")) {
    initDashboard();
  }
});

// logout
function logout(){
  localStorage.removeItem("currentUser");
  window.location.href = "index.html";
}

// ---------- DASHBOARD: validação de sessão e pedidos por usuário ----------
function initDashboard(){
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  if (!currentUser) {
    // se não estiver logado, volta para index
    window.location.href = "index.html";
    return;
  }

  // mostra info do usuário no nav
  const userInfo = $("userInfo");
  if (userInfo) userInfo.textContent = `${currentUser.nome} (${currentUser.plano})`;

  // elementos pedidos
  const listaPedidos = $("listaPedidos");
  const inputPedido = $("novoPedido");
  const btnAdd = $("btnAdd");
  const filterStatus = $("filterStatus");

  // carrega pedidos globais (array de objetos)
  let pedidos = JSON.parse(localStorage.getItem("pedidos") || "[]");

  // filtra apenas pedidos do usuário atual
  function meusPedidos() {
    return pedidos.filter(p => p.owner === currentUser.email);
  }

  function salvarPedidos() {
    localStorage.setItem("pedidos", JSON.stringify(pedidos));
  }

  function renderizar() {
    if (!listaPedidos) return;
    const filtro = filterStatus ? filterStatus.value : "Todos";
    listaPedidos.innerHTML = "";

    const items = meusPedidos().filter(p => filtro === "Todos" ? true : p.status === filtro);
    if (items.length === 0) {
      listaPedidos.innerHTML = "<li class='empty'>Nenhum pedido encontrado.</li>";
      return;
    }

    items.forEach((p, i) => {
      // índice global
      const globalIndex = pedidos.indexOf(p);
      const li = document.createElement("li");
      li.className = "pedido-item";
      li.innerHTML = `
        <div class="pedido-text">
          <strong>${p.texto}</strong>
          <div class="meta">Status: ${p.status} • Criado: ${p.date}</div>
        </div>
        <div class="acoes">
          ${p.status !== "Concluído" ? `<button onclick="concluirPedido(${globalIndex})" title="Concluir">✔</button>` : `<button disabled>✔</button>`}
          <button onclick="arquivarPedido(${globalIndex})" title="Arquivar">🗄</button>
          <button onclick="deletarPedido(${globalIndex})" class="danger" title="Deletar">✖</button>
        </div>
      `;
      listaPedidos.appendChild(li);
    });
  }

  // adicionar
  if (btnAdd) {
    btnAdd.addEventListener("click", () => {
      const texto = inputPedido.value.trim();
      if (!texto) return alert("Digite a descrição do pedido.");
      const novo = {
        owner: currentUser.email,
        texto,
        status: "Ativo",
        date: new Date().toLocaleString()
      };
      pedidos.push(novo);
      salvarPedidos();
      inputPedido.value = "";
      renderizar();
    });
  }

  // filtros
  if (filterStatus) filterStatus.addEventListener("change", renderizar);

  // funções globais usadas nos botões (definidas globalmente)
  window.concluirPedido = function(index){
    if (!confirm("Marcar como concluído?")) return;
    pedidos[index].status = "Concluído";
    salvarPedidos();
    renderizar();
  };

  window.arquivarPedido = function(index){
    if (!confirm("Arquivar este pedido?")) return;
    pedidos[index].status = "Arquivado";
    salvarPedidos();
    renderizar();
  };

  window.deletarPedido = function(index){
    if (!confirm("Deletar permanentemente?")) return;
    pedidos.splice(index, 1);
    salvarPedidos();
    renderizar();
  };

  // primeiro render
  renderizar();
}
