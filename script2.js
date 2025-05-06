// ========== DASHBOARD ==========
function gerarDashboard() {
    const voos = JSON.parse(localStorage.getItem('voos')) || [];
    const aeronaves = JSON.parse(localStorage.getItem('aeronaves')) || [];
  
    document.getElementById('total-voos').textContent = voos.length;
  
    let totalHoras = 0;
    const contadorAeroportos = {};
    const contadorAeronaves = {};
  
    voos.forEach(voo => {
      const aero = voo.aeronave;
      const origem = voo.origem;
      const destino = voo.destino;
  
      // Contagem de aeroportos
      contadorAeroportos[origem] = (contadorAeroportos[origem] || 0) + 1;
      contadorAeroportos[destino] = (contadorAeroportos[destino] || 0) + 1;
  
      // Contagem de aeronaves
      contadorAeronaves[aero] = (contadorAeronaves[aero] || 0) + 1;
  
      // Estimar tempo: distância fictícia 500km + velocidade
      const aeronave = aeronaves.find(a => `${a.modelo} (${a.matricula})` === aero);
      const velocidade = parseInt(aeronave?.velocidade || '500');
      totalHoras += 500 / velocidade; // estimado
    });
  
    document.getElementById('total-horas').textContent = totalHoras.toFixed(1) + 'h';
  
    // Aeroporto mais usado
    const aeroportoMais = Object.entries(contadorAeroportos).sort((a, b) => b[1] - a[1])[0];
    document.getElementById('aeroporto-mais').textContent = aeroportoMais ? `${aeroportoMais[0]} (${aeroportoMais[1]})` : '---';
  
    // Aeronave mais usada
    const aeronaveMais = Object.entries(contadorAeronaves).sort((a, b) => b[1] - a[1])[0];
    document.getElementById('aeronave-mais').textContent = aeronaveMais ? `${aeronaveMais[0]} (${aeronaveMais[1]})` : '---';
  
    // Gráficos
    new Chart(document.getElementById('graficoAeroportos'), {
      type: 'bar',
      data: {
        labels: Object.keys(contadorAeroportos),
        datasets: [{
          label: 'Usos de Aeroporto',
          data: Object.values(contadorAeroportos),
          backgroundColor: 'rgba(54, 162, 235, 0.6)'
        }]
      }
    });
  
    new Chart(document.getElementById('graficoAeronaves'), {
      type: 'pie',
      data: {
        labels: Object.keys(contadorAeronaves),
        datasets: [{
          label: 'Aeronaves',
          data: Object.values(contadorAeronaves),
          backgroundColor: ['#ff6384', '#36a2eb', '#ffce56', '#4bc0c0', '#9966ff']
        }]
      }
    });
  }
  
  document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('graficoAeroportos')) {
      gerarDashboard();
    }
  });
  