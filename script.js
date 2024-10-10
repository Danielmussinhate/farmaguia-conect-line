// script.js

document.addEventListener('DOMContentLoaded', () => {
    const formulario = document.getElementById('doseForm');
    const resultadoSection = document.getElementById('resultado');
    const doseInfoDiv = document.getElementById('doseInfo');
    const alertasDiv = document.getElementById('alertas');
    const apresentacaoSelect = document.getElementById('apresentacao');

    // Estrutura de dados dos medicamentos
    const medicamentos = {
        dipirona: {
            name: 'Dipirona',
            apresentacoes: {
                oral: [
                    { descricao: 'Gotas (200mg/mL) 13,3mg/gota', calculoMenor: 'peso * 10 / 13.3', calculoMaior: 'peso * 12 / 13.3', calculoMaxima: 'peso * 18.75 / 13.3', prescricao: 'Administrar entre X e Z gotas por VO a cada 8 horas, se necessário.', alerta: 'Não administrar dose maior que (peso * 18.75 / 13.3) gotas; dose tóxica é de (peso * 120 / 13.3) gotas.' }
                ],
                retal: [
                    { descricao: 'Supositório 125 mg', prescricao: 'Administrar 1 supositório de 125 mg por via retal a cada 6 horas, se necessário.', alerta: 'Não administrar dose maior que 4 supositórios ao dia.' }
                ]
            }
        },
        paracetamol: {
            name: 'Paracetamol',
            apresentacoes: {
                oral: [
                    { descricao: 'Gotas (200mg/mL) 13,3mg/gota', calculoMenor: 'peso * 10 / 13.3', calculoMaior: 'peso * 15 / 13.3', calculoMaxima: 'peso * 18.75 / 13.3', prescricao: 'Administrar entre X e Z gotas por VO a cada 6 horas, se necessário.', alerta: 'Não administrar dose maior que (peso * 18.75 / 13.3) gotas.' }
                ]
            }
        },
        ibuprofeno: {
            name: 'Ibuprofeno',
            apresentacoes: {
                oral: [
                    { descricao: 'Gotas 50mg/mL, 5mg/gota', calculoMenor: 'peso * 5 / 5', calculoMaior: 'peso * 10 / 5', calculoMaxima: '40', prescricao: 'Administrar entre X e Z gotas por VO a cada 6 horas, se necessário.', alerta: 'Não administrar dose maior que 40 gotas por vez.' }
                ]
            }
        }
    };

    // Função para preencher as opções de apresentação
    const preencherApresentacao = () => {
        const medicamento = document.getElementById('medicamento').value;
        const via = document.getElementById('via').value;

        // Limpar opções anteriores
        apresentacaoSelect.innerHTML = '<option value="" disabled selected>Escolha a apresentação</option>';

        if (medicamentos[medicamento] && medicamentos[medicamento].apresentacoes[via]) {
            medicamentos[medicamento].apresentacoes[via].forEach(apresentacao => {
                const option = document.createElement('option');
                option.value = JSON.stringify(apresentacao);
                option.textContent = apresentacao.descricao;
                apresentacaoSelect.appendChild(option);
            });
        }
    };

    // Eventos para preencher a apresentação quando medicamento ou via mudar
    document.getElementById('medicamento').addEventListener('change', preencherApresentacao);
    document.getElementById('via').addEventListener('change', preencherApresentacao);

    // Evento para calcular a dose
    formulario.addEventListener('submit', (e) => {
        e.preventDefault();

        const medicamento = document.getElementById('medicamento').value;
        const via = document.getElementById('via').value;
        const apresentacao = JSON.parse(document.getElementById('apresentacao').value);
        const peso = parseFloat(document.getElementById('peso').value);

        if (!medicamento || !via || !apresentacao || isNaN(peso)) {
            alert('Por favor, preencha todos os campos corretamente.');
            return;
        }

        // Cálculo das doses
        const doseMenor = eval(apresentacao.calculoMenor.replace(/peso/g, peso.toString()));
        const doseMaior = eval(apresentacao.calculoMaior.replace(/peso/g, peso.toString()));
        const doseMaxima = eval(apresentacao.calculoMaxima.replace(/peso/g, peso.toString()));

        // Exibir resultados de forma moderna
        doseInfoDiv.innerHTML = `
            <div class="mb-2"><strong>Dose Menor:</strong> ${doseMenor.toFixed(2)} gotas/mL</div>
            <div class="mb-2"><strong>Dose Maior:</strong> ${doseMaior.toFixed(2)} gotas/mL</div>
            <div class="mb-2"><strong>Dose Máxima:</strong> ${doseMaxima.toFixed(2)} gotas/mL</div>
            <div class="mb-2"><strong>Prescrição:</strong> ${apresentacao.prescricao.replace(/X/g, doseMenor.toFixed(2)).replace(/Z/g, doseMaior.toFixed(2))}</div>
        `;

        // Gerar alertas em vermelho e negrito
        alertasDiv.innerHTML = `<p class="alerta"><strong>Alerta:</strong> ${apresentacao.alerta}</p>`;

        // Exibir resultado
        resultadoSection.style.display = 'block';
    });
});
