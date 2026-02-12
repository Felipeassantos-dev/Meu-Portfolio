// CTA: após navegar até o contato, foca no campo "Nome"
const cta = document.querySelector('.btn-cta');
const inputNomeFocus = document.getElementById('nome');

if (cta && inputNomeFocus) {
  cta.addEventListener('click', () => {
    setTimeout(() => inputNomeFocus.focus(), 500);
  });
}

// Formulário: validação no front-end + feedback visual
const form = document.getElementById('form-contato');
const inputNome = document.getElementById('nome');
const inputEmail = document.getElementById('email');
const inputMsg = document.getElementById('mensagem-form');
const feedback = document.getElementById('feedback-form');

function setFeedback(texto, tipo) {
  feedback.textContent = texto;
  feedback.classList.remove('ok', 'error');
  feedback.classList.add(tipo);
}

function emailValido(email) {
  return email.includes('@') && email.includes('.') && email.length >= 6;
}

if (form) {
  form.addEventListener('submit', (evento) => {
    evento.preventDefault();

    const nome = inputNome.value.trim();
    const email = inputEmail.value.trim();
    const mensagem = inputMsg.value.trim();

    if (nome.length < 3) {
      setFeedback('Por favor, insira um nome válido (mínimo 3 caracteres).', 'error');
      inputNome.focus();
      return;
    }

    if (!emailValido(email)) {
      setFeedback('Por favor, insira um email válido.', 'error');
      inputEmail.focus();
      return;
    }

    if (mensagem.length < 10) {
      setFeedback('Por favor, insira uma mensagem válida (mínimo 10 caracteres).', 'error');
      inputMsg.focus();
      return;
    }

    setFeedback('Mensagem enviada com sucesso! Obrigado pelo contato 😄.', 'ok');
    form.reset();
  });
}

// Rodapé: ano automático
const ano = document.getElementById('ano');
if (ano) {
  ano.textContent = new Date().getFullYear();
}
