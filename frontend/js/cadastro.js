const form = document.getElementById('cadastroForm');
const erro = document.getElementById('erro');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const nome = document.getElementById('nome').value;
  const sobrenome = document.getElementById('sobrenome').value;
  const email = document.getElementById('email').value;
  const senha = document.getElementById('senha').value;
  const confirmarSenha = document.getElementById('confirmarSenha').value;

  if (senha !== confirmarSenha) {
    erro.textContent = 'As senhas não coincidem.';
    return;
  }

  try {
    const response = await fetch('/cadastro', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nome, sobrenome, email, senha })
    });

    const data = await response.json();

    if (!response.ok) {
      erro.textContent = data.error || 'Erro no cadastro.';
    } else {
      alert('Cadastro realizado com sucesso!');
      form.reset();
    }
  } catch (err) {
    erro.textContent = 'Erro de conexão com o servidor.';
    console.error(err);
  }
});
