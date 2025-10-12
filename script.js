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
