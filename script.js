// ===== FUNÇÕES DE USUÁRIO =====
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
function adicionarPedido() {
    console.log("Função adicionarPedido chamada!");
    
    const input = document.getElementById("novoPedido");
    const descricao = input.value.trim();
    
    if (!descricao) {
        alert("Digite uma descrição para o pedido!");
        return;
    }
    
    const pedidos = JSON.parse(localStorage.getItem("pedidos")) || [];
    const novoPedido = {
        id: Date.now(),
        descricao: descricao,
        status: "Ativo",
        data: new Date().toLocaleDateString('pt-BR')
    };
    
    pedidos.push(novoPedido);
    localStorage.setItem("pedidos", JSON.stringify(pedidos));
    
    console.log("Pedido adicionado:", novoPedido);
    
    input.value = "";
    carregarPedidos();
}

function carregarPedidos() {
    console.log("Carregando pedidos...");
    
    // Verificar login
    const usuario = JSON.parse(localStorage.getItem("usuarioLogado"));
    if (!usuario) {
        window.location.href = "index.html";
        return;
    }

    // Mostrar nome do usuário
    const userInfo = document.getElementById("userInfo");
    if (userInfo) {
        userInfo.textContent = usuario.nome;
    }

    // Carregar pedidos
    const pedidos = JSON.parse(localStorage.getItem("pedidos")) || [];
    const filtro = document.getElementById("filterStatus").value;
    const lista = document.getElementById("listaPedidos");
    
    lista.innerHTML = "";
    
    // Aplicar filtro
    const pedidosFiltrados = filtro === "Todos" 
        ? pedidos 
        : pedidos.filter(pedido => pedido.status === filtro);
    
    if (pedidosFiltrados.length === 0) {
        lista.innerHTML = '<li style="text-align: center; padding: 20px; color: #666;">Nenhum pedido encontrado</li>';
        return;
    }

    // Mostrar pedidos
    pedidosFiltrados.forEach(pedido => {
        const li = document.createElement("li");
        li.style.cssText = `
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 15px;
            margin: 10px 0;
            background: white;
            border-radius: 8px;
            border-left: 4px solid #0a4c9a;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        `;
        
        li.innerHTML = `
            <div>
                <div style="font-weight: 500;">${pedido.descricao}</div>
                <small style="color: #666;">${pedido.data}</small>
            </div>
            <div style="display: flex; align-items: center; gap: 8px;">
                <span style="padding: 4px 8px; background: #d4edda; color: #155724; border-radius: 4px; font-size: 12px; font-weight: bold;">
                    ${pedido.status}
                </span>
                <button onclick="concluirPedido(${pedido.id})" style="background: none; border: none; cursor: pointer;">✓</button>
                <button onclick="arquivarPedido(${pedido.id})" style="background: none; border: none; cursor: pointer;">📁</button>
                <button onclick="excluirPedido(${pedido.id})" style="background: none; border: none; cursor: pointer;">🗑️</button>
            </div>
        `;
        lista.appendChild(li);
    });
}

function concluirPedido(id) {
    mudarStatusPedido(id, "Concluído");
}

function arquivarPedido(id) {
    mudarStatusPedido(id, "Arquivado");
}

function mudarStatusPedido(id, novoStatus) {
    const pedidos = JSON.parse(localStorage.getItem("pedidos")) || [];
    const pedidoIndex = pedidos.findIndex(p => p.id === id);
    
    if (pedidoIndex !== -1) {
        pedidos[pedidoIndex].status = novoStatus;
        localStorage.setItem("pedidos", JSON.stringify(pedidos));
        carregarPedidos();
    }
}

function excluirPedido(id) {
    if (!confirm("Tem certeza que deseja excluir este pedido?")) return;
    
    const pedidos = JSON.parse(localStorage.getItem("pedidos")) || [];
    const novosPedidos = pedidos.filter(p => p.id !== id);
    localStorage.setItem("pedidos", JSON.stringify(novosPedidos));
    carregarPedidos();
}

// ===== CONFIGURAÇÃO DOS EVENTOS =====
document.addEventListener('DOMContentLoaded', function() {
    console.log("Página carregada!");
    
    // Configurar botão de adicionar pedido
    const btnAdd = document.getElementById("btnAdd");
    if (btnAdd) {
        console.log("Botão encontrado, adicionando evento...");
        btnAdd.addEventListener("click", adicionarPedido);
    } else {
        console.log("Botão não encontrado!");
    }
    
    // Configurar filtro
    const filterSelect = document.getElementById("filterStatus");
    if (filterSelect) {
        filterSelect.addEventListener("change", carregarPedidos);
    }
    
    // Enter no input
    const inputPedido = document.getElementById("novoPedido");
    if (inputPedido) {
        inputPedido.addEventListener("keypress", function(e) {
            if (e.key === "Enter") {
                adicionarPedido();
            }
        });
    }
    
    // Carregar pedidos se estiver no dashboard
    if (window.location.href.includes("dashboard.html")) {
        console.log("Inicializando dashboard...");
        carregarPedidos();
    }
});
