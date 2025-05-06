// === Atualizar total de horas no index ===
document.addEventListener('DOMContentLoaded', () => {
  const horasSpan = document.getElementById('totalHoras');
  if (horasSpan) {
    const totalMinutos = parseInt(localStorage.getItem('totalMinutos') || '0');
    const horas = Math.floor(totalMinutos / 60);
    const minutos = totalMinutos % 60;
    horasSpan.textContent = `${horas}h ${minutos.toString().padStart(2, '0')}min`;
  }

  // Exibir insígnias no dashboard, se houver container
  const insigniaContainer = document.getElementById("insignia");
  if (insigniaContainer) {
    const totalMinutos = parseInt(localStorage.getItem("totalMinutos") || "0");

    function adicionarInsignia(nome, imagem) {
      const div = document.createElement("div");
      div.innerHTML = `
        <div class="text-center">
          <img src="${imagem}" width="60" alt="${nome}" title="${nome}"/>
          <p class="mb-0">${nome}</p>
        </div>
      `;
      insigniaContainer.appendChild(div);
    }

    // Limpa insígnias antes de adicionar novamente
    insigniaContainer.innerHTML = "";

    if (totalMinutos >= 1) {
      adicionarInsignia("Cadete", "bronze.png");
    }
    if (totalMinutos >= 3) {
      adicionarInsignia("Tenente", "bronze.png");
    }
    if (totalMinutos >= 5) {
      adicionarInsignia("Capitão", "bronze.png");
    }
    if (totalMinutos >= 10) {
      adicionarInsignia("Comandante", "bronze.png");
    }
  }
});

// === Resetar dados ===
function resetarDados() {
  if (confirm("Tem certeza que deseja resetar todos os dados? Isso não poderá ser desfeito.")) {
    localStorage.clear();
    alert("Dados resetados com sucesso!");
    location.reload();
  }
}

// === Cronômetro ===
let tempoInicial = 0;
let intervalo;
let emAndamento = false;

function formatarTempo(segundos) {
  const h = Math.floor(segundos / 3600);
  const m = Math.floor((segundos % 3600) / 60);
  const s = segundos % 60;
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

function iniciar() {
  if (emAndamento) return;
  emAndamento = true;
  tempoInicial = 0;
  intervalo = setInterval(() => {
    tempoInicial++;
    document.getElementById('cronometro').textContent = formatarTempo(tempoInicial);
  }, 1000);
}

// Verificar insígnias ao finalizar voo
function verificarInsignia(tempoVooSegundos) {
  let insig = '';

  if (tempoVooSegundos >= 18 && tempoVooSegundos < 36) {
    insig = 'bronze';
  } else if (tempoVooSegundos >= 36 && tempoVooSegundos < 5400) {
    insig = 'prata';
  } else if (tempoVooSegundos >= 5400) {
    insig = 'ouro';
  }

  if (insig) {
    const insigAnterior = localStorage.getItem('insignia');
    if (!insigAnterior || insig !== insigAnterior) {
      localStorage.setItem('insignia', insig);
      alert(`Parabéns! Você ganhou a insígnia: ${insig}`);
    }
  }
}

// Finalizar voo
function parar() {
  if (!emAndamento) return;
  clearInterval(intervalo);
  emAndamento = false;

  const tempoVooSegundos = tempoInicial;
  const minutosTotais = parseInt(localStorage.getItem('totalMinutos') || '0');
  const novoTotal = minutosTotais + Math.floor(tempoVooSegundos / 60);
  localStorage.setItem('totalMinutos', novoTotal.toString());

  verificarInsignia(tempoVooSegundos);
  alert(`Voo finalizado. Tempo voado: ${formatarTempo(tempoVooSegundos)}`);
  window.location.href = 'index.html';
}
