document.addEventListener('DOMContentLoaded', () => {
    const aeronaveForm = document.getElementById('aeronaveForm');
    if (aeronaveForm) {
      aeronaveForm.addEventListener('submit', e => {
        e.preventDefault();
  
        const aeronaves = JSON.parse(localStorage.getItem('aeronaves')) || [];
  
        const nova = {
          nome: document.getElementById('modelo').value,
          matricula: document.getElementById('matricula').value,
          velocidade: document.getElementById('velocidade').value,
          alcance: document.getElementById('alcance').value,
          imagem: document.getElementById('imagem').value
        };
  
        aeronaves.push(nova);
        localStorage.setItem('aeronaves', JSON.stringify(aeronaves));
        aeronaveForm.reset();
        carregarAeronavesCadastradas();
      });
  
      carregarAeronavesCadastradas();
    }
  });
  
  function carregarAeronavesCadastradas() {
    const container = document.getElementById('listaAeronaves');
    if (!container) return;
  
    container.innerHTML = '';
    const aeronaves = JSON.parse(localStorage.getItem('aeronaves')) || [];
  
    aeronaves.forEach((aeronave, index) => {
      const col = document.createElement('div');
      col.className = 'col-md-6';
  
      col.innerHTML = `
        <div class="card">
          <img src="${aeronave.imagem}" class="card-img-top" alt="${aeronave.nome}">
          <div class="card-body">
            <h5 class="card-title">${aeronave.nome}</h5>
            <p class="card-text">Matrícula: ${aeronave.matricula}<br>
            Velocidade: ${aeronave.velocidade} kt<br>
            Alcance: ${aeronave.alcance} NM</p>
            <button class="btn btn-danger btn-sm" onclick="removerAeronave(${index})">Remover</button>
          </div>
        </div>
      `;
  
      container.appendChild(col);
    });
  }
  
  function removerAeronave(index) {
    const aeronaves = JSON.parse(localStorage.getItem('aeronaves')) || [];
    aeronaves.splice(index, 1);
    localStorage.setItem('aeronaves', JSON.stringify(aeronaves));
    carregarAeronavesCadastradas();
  }