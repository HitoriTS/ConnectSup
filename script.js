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
    
    input.value = "";
    carregarPedidos();
}

function carregarPedidos() {
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

    // Carregar e mostrar pedidos
    const pedidos = JSON.parse(localStorage.getItem("pedidos")) || [];
    const filtro = document.getElementById("filterStatus").value;
    const lista = document.getElementById("listaPedidos");
    
    if (!lista) return;
    
    lista.innerHTML = "";
    
    // Aplicar filtro
    const pedidosFiltrados = filtro === "Todos" 
        ? pedidos 
        : pedidos.filter(pedido => pedido.status === filtro);
    
    if (pedidosFiltrados.length === 0) {
        lista.innerHTML = '<li class="vazio">Nenhum pedido encontrado</li>';
        return;
    }

    // Adicionar pedidos na lista
    pedidosFiltrados.forEach(pedido => {
        const li = document.createElement("li");
        li.className = `pedido-item ${pedido.status.toLowerCase()}`;
        li.innerHTML = `
            <div class="pedido-content">
                <span class="pedido-texto">${pedido.descricao}</span>
                <small class="pedido-data">${pedido.data}</small>
            </div>
            <div class="pedido-controles">
                <span class="status-badge ${pedido.status.toLowerCase()}">${pedido.status}</span>
                <button onclick="concluirPedido(${pedido.id})" class="btn-success">✓</button>
                <button onclick="arquivarPedido(${pedido.id})" class="btn-warning">📁</button>
                <button onclick="excluirPedido(${pedido.id})" class="btn-danger">🗑️</button>
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

// ===== INICIALIZAÇÃO =====
// Configurar eventos quando a página carregar
document.addEventListener('DOMContentLoaded', function() {
    // Configurar dashboard se estivermos nele
    if (window.location.href.includes('dashboard.html')) {
        const btnAdd = document.getElementById('btnAdd');
        const filterSelect = document.getElementById('filterStatus');
        
        if (btnAdd) {
            btnAdd.addEventListener('click', adicionarPedido);
        }
        
        if (filterSelect) {
            filterSelect.addEventListener('change', carregarPedidos);
        }
        
        // Também permitir adicionar com Enter
        const inputPedido = document.getElementById('novoPedido');
        if (inputPedido) {
            inputPedido.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    adicionarPedido();
                }
            });
        }
        
        // Carregar pedidos iniciais
        carregarPedidos();
    }
    
    // Verificar se usuário está logado em páginas protegidas
    const paginasProtegidas = ['dashboard.html', 'sobre.html', 'ajuda.html'];
    const paginaAtual = window.location.pathname;
    const usuarioLogado = localStorage.getItem('usuarioLogado');
    
    const estaEmPaginaProtegida = paginasProtegidas.some(pagina => 
        paginaAtual.includes(pagina)
    );
    
    if (estaEmPaginaProtegida && !usuarioLogado) {
        window.location.href = 'index.html';
    }
});
