const vooForm = document.getElementById('vooForm');
const voosLista = document.getElementById('voosLista');
const historicoLista = document.getElementById('historicoLista');
const mapaDiv = document.getElementById('mapa');
const statusFiltro = document.getElementById('statusFiltro');
const dataFiltro = document.getElementById('dataFiltro');
const aeronaveSelect = document.getElementById('aeronaveSelect');

let mapa = L.map('mapa').setView([-15.78, -47.93], 4);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap'
}).addTo(mapa);
let rotaAtual = [];

let rotaVisivel = false;
let rotaIdAtual = null;

// Dados de aeronaves e voos
let aeronaves = JSON.parse(localStorage.getItem('aeronaves')) || [];
let voos = JSON.parse(localStorage.getItem('voos')) || [];

function salvarVoo(voo) {
  voos.push(voo);
  localStorage.setItem('voos', JSON.stringify(voos));
}

function carregarVoos() {
  voosLista.innerHTML = '';
  const filtroStatus = statusFiltro.value;
  const filtroData = dataFiltro.value;

  // Filtrando voos por status e data
  const voosFiltrados = voos.filter(voo => {
    const dataVoo = `${voo.dia}/${voo.mes}`;
    const statusCondicao = filtroStatus === 'Todos' || voo.status === filtroStatus;
    const dataCondicao = !filtroData || `${voo.dia}/${voo.mes}` === filtroData;

    return statusCondicao && dataCondicao;
  });

  voosFiltrados.forEach((voo, index) => {
    const col = document.createElement('div');
    col.className = 'col-md-6';

    let statusClass = 'badge-planejado';
    if (voo.status === 'Em Voo') statusClass = 'badge-emvoo';
    if (voo.status === 'Pousado') statusClass = 'badge-pousado';
    if (voo.status === 'Cancelado') statusClass = 'badge-cancelado';

    col.innerHTML = `
      <div class="card">
        <h5>Plano ${index + 1}</h5>
        <p><strong>Origem:</strong> ${voo.origem}</p>
        <p><strong>Destino:</strong> ${voo.destino}</p>
        <p><strong>Data:</strong> ${voo.dia}/${voo.mes} às ${voo.hora}</p>
        <p><strong>Aeronave:</strong> ${voo.aeronave}</p>
        <p><strong>Status:</strong> <span class="badge ${statusClass}">${voo.status}</span></p>
       
        <button class="btn btn-sm btn-warning ms-2 alterarStatus" data-index="${index}">Alterar Status</button>
        <button class="btn btn-sm btn-danger ms-2 removerVoo" data-index="${index}">Remover</button>
      </div>
    `;
    voosLista.appendChild(col);
  });
}

function carregarHistorico() {
  historicoLista.innerHTML = '';

  voos.forEach((voo, index) => {
    const col = document.createElement('div');
    col.className = 'col-md-6';

    let statusClass = 'badge-planejado';
    if (voo.status === 'Em Voo') statusClass = 'badge-emvoo';
    if (voo.status === 'Pousado') statusClass = 'badge-pousado';
    if (voo.status === 'Cancelado') statusClass = 'badge-cancelado';

    col.innerHTML = `
      <div class="card">
        <h5>Plano ${index + 1}</h5>
        <p><strong>Origem:</strong> ${voo.origem}</p>
        <p><strong>Destino:</strong> ${voo.destino}</p>
        <p><strong>Data:</strong> ${voo.dia}/${voo.mes} às ${voo.hora}</p>
        <p><strong>Aeronave:</strong> ${voo.aeronave}</p>
        <p><strong>Status:</strong> <span class="badge ${statusClass}">${voo.status}</span></p>
      </div>
    `;
    historicoLista.appendChild(col);
  });
}

function carregarAeronaves() {
  aeronaveSelect.innerHTML = '<option value="" disabled selected>Escolha uma aeronave</option>';
  aeronaves.forEach(aeronave => {
    const option = document.createElement('option');
    option.value = aeronave.nome;
    option.textContent = aeronave.nome;
    aeronaveSelect.appendChild(option);
  });
}

function salvarAeronave(aeronave) {
  aeronaves.push(aeronave);
  localStorage.setItem('aeronaves', JSON.stringify(aeronaves));
}

function mostrarRota(index) {
  if (rotaVisivel && rotaIdAtual === index) {
    mapaDiv.style.display = 'none';
    rotaVisivel = false;
    rotaIdAtual = null;
  } else {
    const voo = voos[index];
    const origem = voo.origem;
    const destino = voo.destino;
    
    const origemLatLon = getLatLon(origem);
    const destinoLatLon = getLatLon(destino);
    
    const rota = [
      [origemLatLon.lat, origemLatLon.lon],
      [destinoLatLon.lat, destinoLatLon.lon]
    ];
    
    if (rotaAtual) {
      rotaAtual.setLatLngs(rota);
    } else {
      rotaAtual = L.polyline(rota, { color: 'blue' }).addTo(mapa);
    }
    
    mapa.setView(origemLatLon, 6);
    mapaDiv.style.display = 'block';
    rotaVisivel = true;
    rotaIdAtual = index;
  }
}

function getLatLon(icaoCode) {
  // Simulação de um sistema de coordenadas ICAO para fins de exemplo.
  // Um serviço real seria necessário para obter as coordenadas com precisão.
  const icaoCoordinates = {
    SBGR: { lat: -23.4356, lon: -46.4731 },
    SBCT: { lat: -27.5954, lon: -48.5480 },
    SBJ: { lat: -26.0868, lon: -48.6355 },
    // Adicionar mais coordenadas conforme necessário...
  };
  
  return icaoCoordinates[icaoCode] || { lat: -15.78, lon: -47.93 }; // Default (Brasília)
}

function alterarStatus(index) {
  const statusOrdem = ['Planejado', 'Em Voo', 'Pousado', 'Cancelado'];
  const voo = voos[index];
  const statusAtual = voo.status;
  const atualIndex = statusOrdem.indexOf(statusAtual);
  const proximoStatus = statusOrdem[(atualIndex + 1) % statusOrdem.length];

  voos[index].status = proximoStatus;
  localStorage.setItem('voos', JSON.stringify(voos));
  carregarVoos();
}

function removerVoo(index) {
  voos.splice(index, 1);
  localStorage.setItem('voos', JSON.stringify(voos));
  carregarVoos();
}





function carregarAeronaves() {
    const select = document.getElementById('aeronaveSelect');
    if (!select) return; // só executa na página principal
  
    const aeronaves = JSON.parse(localStorage.getItem('aeronaves')) || [];
  
    select.innerHTML = '<option value="">Selecione uma aeronave</option>';
    aeronaves.forEach(aero => {
      const option = document.createElement('option');
      option.value = aero.nome;
      option.textContent = `${aero.nome} - ${aero.matricula}`;
      select.appendChild(option);
    });
  }
  
  carregarAeronaves(); // Chama ao carregar a página

vooForm.addEventListener('submit', function (e) {
  e.preventDefault();

  const origem = document.getElementById('origem').value;
  const destino = document.getElementById('destino').value;
  const dia = document.getElementById('dia').value;
  const mes = document.getElementById('mes').value;
  const hora = document.getElementById('hora').value;
  const aeronave = document.getElementById('aeronaveSelect').value;
  const status = document.getElementById('status').value;

  const voo = { origem, destino, dia, mes, hora, aeronave, status };
  salvarVoo(voo);

  vooForm.reset();
  carregarVoos();
  carregarHistorico();
});

document.getElementById('statusFiltro').addEventListener('change', carregarVoos);
document.getElementById('dataFiltro').addEventListener('change', carregarVoos);

document.addEventListener('DOMContentLoaded', function () {
  carregarVoos();
  carregarHistorico();
  carregarAeronaves();
});

voosLista.addEventListener('click', function (e) {
  if (e.target.classList.contains('verRota')) {
    const index = e.target.dataset.index;
    mostrarRota(index);
  }
  if (e.target.classList.contains('alterarStatus')) {
    const index = e.target.dataset.index;
    alterarStatus(index);
  }
  if (e.target.classList.contains('removerVoo')) {
    const index = e.target.dataset.index;
    removerVoo(index);
  }
});


