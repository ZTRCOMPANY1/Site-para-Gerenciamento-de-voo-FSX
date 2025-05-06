let cronometroInterval;
let segundos = 33;
let minutos = 0;
let horas = 0;

// Função para iniciar o cronômetro
function iniciarCronometro() {
    cronometroInterval = setInterval(function() {
        segundos++;
        if (segundos >= 60) {
            segundos = 0;
            minutos++;
        }
        if (minutos >= 60) {
            minutos = 0;
            horas++;
        }

        // Atualiza o tempo no display
        document.getElementById('tempoVoo').textContent = formatarTempo(horas, minutos, segundos);

        // Verifica se atingiu a meta de tempo para ganhar insígnia
        verificarInsignia();
    }, 1000);
}

// Função para parar o cronômetro
function pararCronometro() {
    clearInterval(cronometroInterval);
    salvarTempoVoo();
}

// Formatar tempo no formato HH:MM:SS
function formatarTempo(horas, minutos, segundos) {
    return `${pad(horas)}:${pad(minutos)}:${pad(segundos)}`;
}

// Adiciona zero à esquerda se o número for menor que 10
function pad(num) {
    return num < 10 ? '0' + num : num;
}

// Verifica se o piloto atingiu a meta de tempo para ganhar uma insígnia
function verificarInsignia() {
    const tempoVoo = horas * 3600 + minutos * 60 + segundos; // Tempo total em segundos

    // Modifique os limites para facilitar o teste (usando 33 segundos)
    if (tempoVoo >= 30 && tempoVoo < 60) {
        mostrarInsignia('bronze');
    } else if (tempoVoo >= 60 && tempoVoo < 90) {
        mostrarInsignia('prata');
    } else if (tempoVoo >= 90) {
        mostrarInsignia('ouro');
    }
}

// Exibe a insígnia correspondente
function mostrarInsignia(tipo) {
    const insigniaContainer = document.getElementById('insignia');
    let insigniaHTML = '';

    switch(tipo) {
        case 'bronze':
            insigniaHTML = '<img src="bronze.png" alt="Insígnia Bronze" title="Piloto Bronze">';
            break;
        case 'prata':
            insigniaHTML = '<img src="prata.png" alt="Insígnia Prata" title="Piloto Prata">';
            break;
        case 'ouro':
            insigniaHTML = '<img src="ouro.png" alt="Insígnia Ouro" title="Piloto Ouro">';
            break;
    }

    insigniaContainer.innerHTML = insigniaHTML;
}

// Função para salvar o tempo de voo no localStorage
function salvarTempoVoo() {
    const tempoTotal = (horas * 3600) + (minutos * 60) + segundos; // Tempo total em segundos
    localStorage.setItem('tempoVoo', tempoTotal);
    alert('Tempo de voo registrado!');
}

// Carregar o perfil e as informações do piloto
window.onload = function() {
    const piloto = JSON.parse(localStorage.getItem('piloto'));

    if (piloto) {
        document.getElementById('nomePiloto').textContent = piloto.nome;

        // Carregar pontos acumulados
        const pontos = localStorage.getItem('pontos') || 0;
        document.getElementById('pontosPiloto').textContent = pontos;

        // Carregar tempo de voo e verificar insígnias
        const tempoVoo = localStorage.getItem('tempoVoo') || 0;
        horas = Math.floor(tempoVoo / 3600);
        minutos = Math.floor((tempoVoo % 3600) / 60);
        segundos = tempoVoo % 60;

        document.getElementById('tempoVoo').textContent = formatarTempo(horas, minutos, segundos);
        verificarInsignia();
    } else {
        alert('Por favor, faça login para acessar seu perfil.');
        window.location.href = 'login.html';
    }
};
