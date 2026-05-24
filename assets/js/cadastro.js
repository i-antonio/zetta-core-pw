const form = document.querySelector('#register_form');
const emailInput = document.querySelector('#email-reg');
const senhaInput = document.querySelector('#pass-reg');
const confirmarSenhaInput = document.querySelector('#confirmar-senha');

if (form) {
  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const nome = document.querySelector('#name-reg')?.value.trim() || '';
    const email = emailInput?.value.trim() || '';
    const senha = senhaInput?.value || '';
    const confirmarSenha = confirmarSenhaInput?.value || '';

    if (!nome || !email || !senha || !confirmarSenha) {
      alert('Preencha todos os campos.');
      return;
    }

    if (senha !== confirmarSenha) {
      alert('As senhas não conferem! Tente novamente.');
      return;
    }

    const usuarios = JSON.parse(localStorage.getItem('usuariosRegistrados')) || [];
    const emailExistente = usuarios.some(usuario => usuario.email === email);
    if (emailExistente) {
      alert('Este e-mail já está registrado. Tente outro.');
      return;
    }

    const usuario = {
      nome,
      email,
      senha
    };

    usuarios.push(usuario);
    localStorage.setItem('usuariosRegistrados', JSON.stringify(usuarios));
    alert('Registro salvo com sucesso!');
    form.reset();
    window.location.href = 'login.html';
  });
} else {
  console.warn('Formulário #register_form não encontrado.');
}
