
async function getAllTransacoes() {
    try {
        const response = await fetch('http://localhost:3000/get_all');
        const transacoes = await response.json();
        console.log(transacoes);
    } catch (error) {
        console.error('Erro ao buscar: ', error);
    }
}

async function getTotal() {
    try {
        const response = await fetch('http://localhost:3000/get_total');
        const total = await response.json();
        console.log(total);
    } catch (error) {
        console.error('Erro ao requisitar as informacoes');
    }
}

async function getPerMonth() {
    try {
        const response = await fetch('http://localhost:3000/get_per_month');
        const total = await response.json();
        console.log(total);
    } catch (error) {
        console.error('Erro ao requisitar as informacoes');
    }
}

// Executar a função

// getAllTransacoes();
// getTotal();
getPerMonth();