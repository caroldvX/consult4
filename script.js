function ValidaDigitosVerificadores(cpf) {
    var soma = 0;
    for (var i = 0; i < 9; i++) {
        soma += parseInt(cpf.charAt(i)) * (10 - i);
    }
    var resto = soma % 11;
    var digitoVerificador1 = resto < 2 ? 0 : 11 - resto;
    if (parseInt(cpf.charAt(9)) !== digitoVerificador1) {
        return false;
    }
    soma = 0;
    for (var i = 0; i < 10; i++) {
        soma += parseInt(cpf.charAt(i)) * (11 - i);
    }
    resto = soma % 11;
    var digitoVerificador2 = resto < 2 ? 0 : 11 - resto;
    return parseInt(cpf.charAt(10)) === digitoVerificador2;
}

function fMasc(objeto, mascara) {
    objeto.onkeyup = function() {
        var obj = objeto.value;
        var masc = mascara;
        var resultado = masc(obj);
        objeto.value = resultado;
    }
}

function mCPF(cpf) {
    cpf = cpf.replace(/\D/g, "");
    cpf = cpf.replace(/(\d{3})(\d)/, "$1.$2");
    cpf = cpf.replace(/(\d{3})(\d)/, "$1.$2");
    cpf = cpf.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    return cpf;
}

document.addEventListener("DOMContentLoaded", function() {
    var cpfInput = document.getElementById("cpf");
    fMasc(cpfInput, mCPF);
});

async function consultarCPF() {
    const cpfInput = document.getElementById('cpf');
    const cpf = cpfInput.value.replace(/\D/g, ""); // Remove formatação
    if (!ValidaDigitosVerificadores(cpf)) {
        alert("CPF inválido. Por favor, verifique o número e tente novamente.");
        return;
    }

    const url = `https://api-typebot-ten.vercel.app/validate-cpf?cpf=${cpf}`;
    const resultadoDiv = document.getElementById('resultado');
    resultadoDiv.innerHTML = '<div class="loader"></div>';

    try {
        const response = await fetch(url);
        const data = await response.json();
        resultadoDiv.innerHTML = '';

        if (response.ok) {
            for (const [key, value] of Object.entries(data)) {
                const p = document.createElement('p');
                p.textContent = `${key}: ${value}`;
                resultadoDiv.appendChild(p);
            }
        } else {
            resultadoDiv.innerText = 'Erro na consulta ou CPF inválido.';
        }
    } catch (error) {
        console.error('Erro na consulta:', error);
        resultadoDiv.innerHTML = 'Erro na consulta. Tente novamente.';
    }
}
