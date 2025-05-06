function login() {
    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;

    const piloto = JSON.parse(localStorage.getItem('piloto'));

    if (piloto && piloto.email === email && piloto.senha === senha) {
        alert('Login bem-sucedido!');
        window.location.href = 'perfil.html';
    } else {
        alert('E-mail ou senha incorretos!');
    }
}
