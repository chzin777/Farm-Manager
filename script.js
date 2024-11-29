document.addEventListener('DOMContentLoaded', () => {
    // Detecta a página atual pelo título
    const pageTitle = document.title;

    if (pageTitle.includes('Home')) {
        initializeHomeCharts();
    } else if (pageTitle.includes('Vendas')) {
        initializeSalesCharts();
    } else if (pageTitle.includes('Relatórios')) {
        initializeReportCharts();
        setupExportButtons();
    }

    // Carrega os fornecedores, se aplicável
    if (document.getElementById('fornecedoresList')) {
        loadFornecedores();
    }

    // Atualiza as barras de progresso, se aplicável
    if (document.querySelectorAll('.progress-bar').length > 0) {
        updateProgressBars();
    }
});

// Função para inicializar os gráficos na Home
function initializeHomeCharts() {
    const salesPieCanvas = document.getElementById('salesPieChart');
    const productionBarCanvas = document.getElementById('productionBarChart');

    if (!salesPieCanvas || !productionBarCanvas) {
        console.error('Os elementos <canvas> para os gráficos da Home não foram encontrados.');
        return;
    }

    // Gráfico de Vendas (Pizza)
    new Chart(salesPieCanvas.getContext('2d'), {
        type: 'pie',
        data: {
            labels: ['Produto A', 'Produto B', 'Produto C'],
            datasets: [{
                label: 'Vendas',
                data: [300, 150, 100],
                backgroundColor: ['#f97f24', '#f9a224', '#f9c924']
            }]
        },
        options: {
            responsive: true
        }
    });

    // Gráfico de Produção (Barra)
    new Chart(productionBarCanvas.getContext('2d'), {
        type: 'bar',
        data: {
            labels: ['Produto A', 'Produto B', 'Produto C'],
            datasets: [{
                label: 'Produção',
                data: [500, 200, 300],
                backgroundColor: ['#36a2eb', '#4bc0c0', '#ff6384']
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

// Função para inicializar os gráficos na página de Vendas
function initializeSalesCharts() {
    const salesPieCanvas = document.getElementById('salesPieChart');

    if (!salesPieCanvas) {
        console.error('O elemento <canvas> para o gráfico de vendas não foi encontrado.');
        return;
    }

    // Gráfico de Vendas (Pizza)
    new Chart(salesPieCanvas.getContext('2d'), {
        type: 'pie',
        data: {
            labels: ['Produto A', 'Produto B', 'Produto C'],
            datasets: [{
                label: 'Vendas',
                data: [300, 150, 100],
                backgroundColor: ['#f97f24', '#f9a224', '#f9c924']
            }]
        },
        options: {
            responsive: true
        }
    });
}

// Função para inicializar os gráficos na página de Relatórios
function initializeReportCharts() {
    const salesPieCanvas = document.getElementById('salesPieChart');
    const productionBarCanvas = document.getElementById('productionBarChart');

    if (salesPieCanvas) {
        new Chart(salesPieCanvas.getContext('2d'), {
            type: 'pie',
            data: {
                labels: ['Produto A', 'Produto B', 'Produto C'],
                datasets: [{
                    label: 'Vendas',
                    data: [300, 150, 100],
                    backgroundColor: ['#f97f24', '#f9a224', '#f9c924']
                }]
            },
            options: {
                responsive: true
            }
        });
    }

    if (productionBarCanvas) {
        new Chart(productionBarCanvas.getContext('2d'), {
            type: 'bar',
            data: {
                labels: ['Produto A', 'Produto B', 'Produto C'],
                datasets: [{
                    label: 'Produção',
                    data: [750, 300, 400],
                    backgroundColor: ['#36a2eb', '#4bc0c0', '#ff6384']
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }
}

// Função para configurar os botões de exportação na página de Relatórios
function setupExportButtons() {
    document.getElementById('exportExcelButton')?.addEventListener('click', generateExcelReport);
    document.getElementById('exportTextButton')?.addEventListener('click', generateTextReport);
}

// Função para gerar relatório em Excel
function generateExcelReport() {
    const data = [
        { Produto: 'Produto A', Meta: '1000kg', Produzido: '750kg', Desempenho: '75%' },
        { Produto: 'Produto B', Meta: '500kg', Produzido: '300kg', Desempenho: '60%' },
        { Produto: 'Produto C', Meta: '800kg', Produzido: '400kg', Desempenho: '50%' }
    ];

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Relatório');
    XLSX.writeFile(workbook, 'Relatorio_Farm_Manager.xlsx');
}

// Função para gerar relatório em texto
function generateTextReport() {
    const data = [
        { Produto: 'Produto A', Meta: 1000, Produzido: 750, Desempenho: '75%' },
        { Produto: 'Produto B', Meta: 500, Produzido: 300, Desempenho: '60%' },
        { Produto: 'Produto C', Meta: 800, Produzido: 400, Desempenho: '50%' }
    ];

    let report = 'Relatório de Produção:\n\n';
    data.forEach(item => {
        report += `Produto: ${item.Produto}\nMeta: ${item.Meta}kg\nProduzido: ${item.Produzido}kg\nDesempenho: ${item.Desempenho}\n\n`;
    });

    const blob = new Blob([report], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'Relatorio_Farm_Manager.txt';
    link.click();
}

// Função para carregar fornecedores do localStorage
function loadFornecedores() {
    const fornecedoresList = document.getElementById('fornecedoresList');

    if (!fornecedoresList) {
        console.error('Elemento fornecedoresList não encontrado.');
        return;
    }

    fornecedoresList.innerHTML = ''; // Limpa a lista antes de carregar
    const fornecedores = JSON.parse(localStorage.getItem('fornecedores')) || [];

    fornecedores.forEach((fornecedor, index) => {
        const card = document.createElement('div');
        card.className = 'fornecedor-card';
        card.innerHTML = `
            <img src="https://cdn-icons-png.flaticon.com/512/8847/8847137.png" alt="Fornecedor">
            <h3>${fornecedor.name}</h3>
            <p>Contato: ${fornecedor.contact}</p>
            <p>Produto: ${fornecedor.product}</p>
            <button onclick="removeFornecedor(${index})" class="remove-btn">Remover</button>
        `;
        fornecedoresList.appendChild(card);
    });
}

// Função para remover um fornecedor
function removeFornecedor(index) {
    const fornecedores = JSON.parse(localStorage.getItem('fornecedores')) || [];
    fornecedores.splice(index, 1); // Remove o fornecedor pelo índice
    localStorage.setItem('fornecedores', JSON.stringify(fornecedores)); // Atualiza o localStorage
    loadFornecedores(); // Atualiza a interface
}

// Função para atualizar barras de progresso
function updateProgressBars() {
    const progressBars = document.querySelectorAll('.progress-bar');
    progressBars.forEach(bar => {
        const progress = Math.max(bar.getAttribute('data-progress') || 0, 50); // Progresso mínimo de 50%
        bar.style.width = `${progress}%`;
    });
}
