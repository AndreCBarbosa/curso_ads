
// async function getAllTransacoes() {
//     try {
//         const response = await fetch('http://localhost:3000/get_all');
//         const trasacoes = await response.json();
//         console.log(trasacoes);
//     } catch (error) {
//         console.error('Erro ao buscar: ', error);
//     }
// }

async function getTotal() {
    try {
        const response = await fetch('http://localhost:3000/get_total');
        const total = await response.json();
        console.log(total);
    } catch (error) {
        console.error('Erro ao requisitar as informacoes');
    }
}

// Executar a função

// getAllTransacoes();
getTotal();
