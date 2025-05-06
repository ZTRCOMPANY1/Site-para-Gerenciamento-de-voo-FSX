function uploadPlano() {
    const arquivo = document.getElementById('planoDeVoo').files[0];

    if (arquivo && arquivo.name.endsWith('.pln')) {
        alert('Plano de voo carregado com sucesso!');
        document.getElementById('imagemMapa').style.display = 'block';
    } else {
        alert('Por favor, carregue um arquivo .pln válido.');
    }
}
