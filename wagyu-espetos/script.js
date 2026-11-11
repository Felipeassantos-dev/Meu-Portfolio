// Horário de funcionamento (horário de Salvador): terça a sábado, 18h às 23h30
const DIAS_ABERTOS = [2, 3, 4, 5, 6];
const ABRE = 18 * 60;
const FECHA = 23 * 60 + 30;
const NOMES = ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado'];

// Dia da semana e minutos do dia em Salvador, independente do fuso do visitante
function agoraEmSalvador() {
  const partes = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/Bahia',
    weekday: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(new Date());

  const valor = (tipo) => partes.find((p) => p.type === tipo).value;
  const dia = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(valor('weekday'));
  return { dia, minutos: Number(valor('hour')) * 60 + Number(valor('minute')) };
}

function calcularStatus({ dia, minutos }) {
  const abreHoje = DIAS_ABERTOS.includes(dia);

  if (abreHoje && minutos >= ABRE && minutos < FECHA) {
    return { aberto: true, texto: 'Aberto agora · até 23h30', curto: 'Brasa acesa agora' };
  }
  if (abreHoje && minutos < ABRE) {
    return { aberto: false, texto: 'Fechado · abre hoje às 18h', curto: 'Abre hoje às 18h' };
  }

  // Próximo dia de funcionamento
  let proximo = dia;
  do { proximo = (proximo + 1) % 7; } while (!DIAS_ABERTOS.includes(proximo));
  const quando = proximo === (dia + 1) % 7 ? 'amanhã' : NOMES[proximo];
  return { aberto: false, texto: `Fechado · abre ${quando} às 18h`, curto: `Abre ${quando} às 18h` };
}

function atualizarStatus() {
  let agora;
  try {
    agora = agoraEmSalvador();
  } catch {
    return; // sem suporte a fuso horário: mantém o texto fixo do HTML
  }

  const status = calcularStatus(agora);
  const selo = document.getElementById('status');
  selo.classList.toggle('aberto', status.aberto);
  selo.classList.toggle('fechado', !status.aberto);
  document.getElementById('status-texto').textContent = status.texto;
  document.getElementById('barra-texto').textContent = status.curto;

  document.querySelectorAll('#horarios li').forEach((li) => {
    li.classList.toggle('hoje', Number(li.dataset.dia) === agora.dia);
  });
}

atualizarStatus();
setInterval(atualizarStatus, 60 * 1000);

// Barra de pedido: aparece depois que o botão principal sai da tela
const barra = document.getElementById('barra-pedido');
const acoes = document.querySelector('.hero-acoes');

if ('IntersectionObserver' in window) {
  new IntersectionObserver(([entrada]) => {
    barra.classList.toggle('visivel', !entrada.isIntersecting);
  }).observe(acoes);

  // Revela as seções conforme a rolagem
  const revelar = new IntersectionObserver((entradas) => {
    entradas.forEach((entrada) => {
      if (entrada.isIntersecting) {
        entrada.target.classList.add('visto');
        revelar.unobserve(entrada.target);
      }
    });
  }, { threshold: 0.15 });

  document.querySelectorAll('.cardapio-caixa, .passos li, .cartao, .insta').forEach((el) => {
    el.classList.add('revelar');
    revelar.observe(el);
  });
} else {
  barra.classList.add('visivel');
}
