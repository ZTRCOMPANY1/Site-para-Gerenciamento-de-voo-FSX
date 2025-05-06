function cadastro() {
    const nome = document.getElementById('nome').value;
    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;

    const piloto = { nome, email, senha };
    localStorage.setItem('piloto', JSON.stringify(piloto));

    alert('Cadastro realizado com sucesso!');
    window.location.href = 'login.html';
}
