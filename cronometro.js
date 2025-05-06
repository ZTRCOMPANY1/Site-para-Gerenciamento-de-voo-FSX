// === Atualizar total de horas no index ===
document.addEventListener('DOMContentLoaded', () => {
    const horasSpan = document.getElementById('totalHoras');
    if (horasSpan) {
      const totalMinutos = parseInt(localStorage.getItem('totalMinutos') || '0');
      const horas = Math.floor(totalMinutos / 60);
      const minutos = totalMinutos % 60;
      horasSpan.textContent = `${horas}h ${minutos.toString().padStart(2, '0')}min`;
    }
  });
  
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
  
  function parar() {
    if (!emAndamento) return;
    clearInterval(intervalo);
    emAndamento = false;
  
    const minutosVoo = Math.floor(tempoInicial / 60);
    const minutosTotais = parseInt(localStorage.getItem('totalMinutos') || '0');
    const novoTotal = minutosTotais + minutosVoo;
    localStorage.setItem('totalMinutos', novoTotal.toString());
  
    alert(`Voo finalizado. Tempo voado: ${formatarTempo(tempoInicial)}`);
    window.location.href = 'index.html';
  }
  