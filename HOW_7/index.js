// Consulta os pagamentos acumulados por imóvel.
async function getTotal() {
    try {
        // Aguarda a resposta da API e converte o corpo para JSON.
        const response = await fetch('http://localhost:3000/get_total');
        const total = await response.json();
        console.log(total);
    } catch (error) {
        console.error('Erro ao requisitar as informacoes');
    }
}

// Consulta os pagamentos agrupados por mês.
async function getPerMonth() {
    try {
        const response = await fetch('http://localhost:3000/get_per_month');
        const total = await response.json();
        console.log(total);
    } catch (error) {
        console.error('Erro ao requisitar as informacoes');
    }
}

// Consulta a participação percentual das vendas por tipo de imóvel.
async function getPerType() {
    try {
        const response = await fetch('http://localhost:3000/get_per_type');
        const total = await response.json();
        console.log(total);
    } catch (error) {
        console.error('Erro ao requisitar as informacoes');
    }
}

// Executa as três consultas à API.
getTotal();
getPerMonth();
getPerType();
