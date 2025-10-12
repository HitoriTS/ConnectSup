// ===== FUNÇÕES DE LOGIN E CADASTRO =====
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
        window.location.href = "dashboard.html";
    } else {
        alert("E-mail ou senha incorretos!");
    }
}

function logout() {
    localStorage.removeItem("usuarioLogado");
    window.location.href = "index.html";
}

// ===== FUNÇÕES DO DASHBOARD =====
function carregarPedidos() {
    console.log("Carregando pedidos...");
    
    // Verificar se está logado
    const usuario = JSON.parse(localStorage.getItem("usuarioLogado"));
    if (!usuario) {
        window.location.href = "index.html";
        return;
    }

    // Mostrar info do usuário
    const userInfo = document.getElementById("userInfo");
    if (userInfo) {
        userInfo.textContent = usuario.nome;
    }

    // Carregar pedidos do localStorage
    const pedidos = JSON.parse(localStorage.getItem("pedidos")) || [];
    console.log("Pedidos encontrados:", pedidos);
    
    const filtro = document.getElementById("filterStatus").value;
    const lista = document.getElementById("listaPedidos");
    
    if (!lista) {
        console.error("Elemento listaPedidos não encontrado!");
        return;
    }
    
    // Limpar lista
    lista.innerHTML = "";
    
    // Aplicar filtro
    const pedidosFiltrados = filtro === "Todos" 
        ? pedidos 
        : pedidos.filter(pedido => pedido.status === filtro);
    
    console.log("Pedidos filtrados:", pedidosFiltrados);

    if (pedidosFiltrados.length === 0) {
        lista.innerHTML = '<li class="vazio">Nenhum pedido encontrado</li>';
        return;
    }

    // Adicionar pedidos à lista
    pedidosFiltrados.forEach((pedido, index) => {
        const li = document.createElement("li");
        li.className = `pedido-item ${pedido.status.toLowerCase()}`;
        li.innerHTML = `
            <div class="pedido-info">
                <span class="pedido-desc">${pedido.descricao}</span>
                <span class="pedido-data">${pedido.data || ''}</span>
            </div>
            <div class="pedido-actions">
                <span class="status ${pedido.status.toLowerCase()}">${pedido.status}</span>
                <button class="btn-action" onclick="mudarStatus(${pedido.id}, 'Concluído')" title="Concluir">✓</button>
                <button class="btn-action" onclick="mudarStatus(${pedido.id}, 'Arquivado')" title="Arquivar">📁</button>
                <button class="btn-action btn-delete" onclick="excluirPedido(${pedido.id})" title="Excluir">🗑️</button>
            </div>
        `;
        lista.appendChild(li);
    });
}

function adicionarPedido() {
    console.log("Tentando adicionar pedido...");
    
    const input = document.getElementById("novoPedido");
    const descricao = input.value.trim();
    
    if (!descricao) {
        alert("Digite uma descrição para o pedido!");
        return;
    }
    
    const pedidos = JSON.parse(localStorage.getItem("pedidos")) || [];
    const novoPedido = {
        id: Date.now(), // ID único baseado no timestamp
        descricao: descricao,
        status: "Ativo",
        data: new Date().toLocaleDateString('pt-BR'),
        usuario: JSON.parse(localStorage.getItem("usuarioLogado")).email
    };
    
    pedidos.push(novoPedido);
    localStorage.setItem("pedidos", JSON.stringify(pedidos));
    
    console.log("Novo pedido adicionado:", novoPedido);
    
    input.value = "";
    carregarPedidos(); // Recarregar a lista
}

function mudarStatus(id, novoStatus) {
    console.log(`Mudando status do pedido ${id} para ${novoStatus}`);
    
    const pedidos = JSON.parse(localStorage.getItem("pedidos")) || [];
    const pedidoIndex = pedidos.findIndex(p => p.id === id);
    
    if (pedidoIndex !== -1) {
        pedidos[pedidoIndex].status = novoStatus;
        localStorage.setItem("pedidos", JSON.stringify(pedidos));
        carregarPedidos();
    }
}

function excluirPedido(id) {
    if (!confirm("Tem certeza que deseja excluir este pedido?")) {
        return;
    }
    
    console.log(`Excluindo pedido ${id}`);
    
    const pedidos = JSON.parse(localStorage.getItem("pedidos")) || [];
    const novosPedidos = pedidos.filter(p => p.id !== id);
    
    localStorage.setItem("pedidos", JSON.stringify(novosPedidos));
    carregarPedidos();
}

// ===== INICIALIZAÇÃO =====
document.addEventListener('DOMContentLoaded', function() {
    console.log("Página carregada, inicializando...");
    
    // Configurar Dashboard
    const btnAdd = document.getElementById("btnAdd");
    const filterStatus = document.getElementById("filterStatus");
    const novoPedidoInput = document.getElementById("novoPedido");
    
    if (btnAdd) {
        console.log("Botão adicionar encontrado");
        btnAdd.addEventListener("click", adicionarPedido);
    }
    
    if (novoPedidoInput) {
        novoPedidoInput.addEventListener("keypress", function(e) {
            if (e.key === 'Enter') {
                adicionarPedido();
            }
        });
    }
    
    if (filterStatus) {
        console.log("Filtro encontrado");
        filterStatus.addEventListener("change", carregarPedidos);
    }
    
    // Verificar se estamos no dashboard e carregar pedidos
    if (window.location.pathname.includes("dashboard.html") || 
        window.location.pathname.includes("Dashboard.html")) {
        console.log("Estamos no dashboard, carregando pedidos...");
        carregarPedidos();
    }
    
    // Verificar login em páginas protegidas
    const usuarioLogado = localStorage.getItem("usuarioLogado");
    const paginasProtegidas = ["dashboard.html", "Dashboard.html", "sobre.html", "ajuda.html"];
    const paginaAtual = window.location.pathname;
    
    if (paginasProtegidas.some(pagina => paginaAtual.includes(pagina)) && !usuarioLogado) {
        window.location.href = "index.html";
    }
});
