function cadastrar() {
  const nome = document.getElementById("cadNome").value;
  const email = document.getElementById("cadEmail").value;
  const senha = document.getElementById("cadSenha").value;
  const plano = document.getElementById("cadPlano").value;

  if (!nome || !email || !senha) {
    alert("Preencha todos os campos!");
    return;
  }

  const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
  const existe = usuarios.find(u => u.email === email);

  if (existe) {
    alert("E-mail já cadastrado!");
    return;
  }

  usuarios.push({ nome, email, senha, plano });
  localStorage.setItem("usuarios", JSON.stringify(usuarios));

  alert("Conta criada com sucesso!");
  window.location.href = "index.html";
}

function login() {
  const email = document.getElementById("loginEmail").value;
  const senha = document.getElementById("loginSenha").value;

  const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
  const user = usuarios.find(u => u.email === email && u.senha === senha);

  if (user) {
    localStorage.setItem("usuarioLogado", JSON.stringify(user));
    window.location.href = "Dashboard.html";
  } else {
    alert("E-mail ou senha incorretos!");
  }
}

// Funções para o Dashboard
function carregarPedidos() {
    const usuario = JSON.parse(localStorage.getItem("usuarioLogado"));
    if (!usuario) {
        window.location.href = "index.html";
        return;
    }

    document.getElementById("userInfo").textContent = usuario.nome;
    
    const pedidos = JSON.parse(localStorage.getItem("pedidos")) || [];
    const filtro = document.getElementById("filterStatus").value;
    const lista = document.getElementById("listaPedidos");
    
    lista.innerHTML = "";
    
    const pedidosFiltrados = pedidos.filter(pedido => {
        if (filtro === "Todos") return true;
        return pedido.status === filtro;
    });
    
    pedidosFiltrados.forEach((pedido, index) => {
        const li = document.createElement("li");
        li.className = `pedido-item ${pedido.status.toLowerCase()}`;
        li.innerHTML = `
            <span>${pedido.descricao}</span>
            <span class="status">${pedido.status}</span>
            <div>
                <button onclick="mudarStatus(${index}, 'Concluído')">✓</button>
                <button onclick="mudarStatus(${index}, 'Arquivado')">📁</button>
                <button onclick="excluirPedido(${index})">🗑️</button>
            </div>
        `;
        lista.appendChild(li);
    });
}

function adicionarPedido() {
    const input = document.getElementById("novoPedido");
    const descricao = input.value.trim();
    
    if (!descricao) {
        alert("Digite uma descrição para o pedido!");
        return;
    }
    
    const pedidos = JSON.parse(localStorage.getItem("pedidos")) || [];
    const novoPedido = {
        descricao: descricao,
        status: "Ativo",
        data: new Date().toLocaleDateString('pt-BR'),
        id: Date.now()
    };
    
    pedidos.push(novoPedido);
    localStorage.setItem("pedidos", JSON.stringify(pedidos));
    
    input.value = "";
    carregarPedidos();
}

function mudarStatus(index, novoStatus) {
    const pedidos = JSON.parse(localStorage.getItem("pedidos")) || [];
    if (pedidos[index]) {
        pedidos[index].status = novoStatus;
        localStorage.setItem("pedidos", JSON.stringify(pedidos));
        carregarPedidos();
    }
}

function excluirPedido(index) {
    const pedidos = JSON.parse(localStorage.getItem("pedidos")) || [];
    pedidos.splice(index, 1);
    localStorage.setItem("pedidos", JSON.stringify(pedidos));
    carregarPedidos();
}

function logout() {
    localStorage.removeItem("usuarioLogado");
    window.location.href = "index.html";
}

// Inicialização quando a página carrega
document.addEventListener('DOMContentLoaded', function() {
    // Configurar botões do Dashboard
    const btnAdd = document.getElementById("btnAdd");
    const filterStatus = document.getElementById("filterStatus");
    
    if (btnAdd) {
        btnAdd.addEventListener("click", adicionarPedido);
    }
    
    if (filterStatus) {
        filterStatus.addEventListener("change", carregarPedidos);
    }
    
    // Carregar pedidos se estiver no dashboard
    if (window.location.pathname.includes("dashboard.html") || 
        window.location.pathname.includes("Dashboard.html")) {
        carregarPedidos();
    }
});
