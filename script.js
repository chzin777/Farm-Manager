document.addEventListener('DOMContentLoaded', () => {
    const pageTitle = document.title;

    if (pageTitle.includes('Home')) {
        initializeHomeCharts();
    } else if (pageTitle.includes('Vendas')) {
        initializeSalesCharts();
        loadVendas();
    } else if (pageTitle.includes('Relatórios')) {
        initializeReportCharts();
        setupExportButtons();
    } else if (pageTitle.includes('Fornecedores')) {
        loadFornecedores();
        setupFornecedorForm();
    }

    if (document.querySelectorAll('.progress-bar').length > 0) {
        updateProgressBars();
    }
});

// Função para inicializar gráficos na Home
function initializeHomeCharts() {
    const salesPieCanvas = document.getElementById('salesPieChart');
    const productionBarCanvas = document.getElementById('productionBarChart');

    if (!salesPieCanvas || !productionBarCanvas) {
        console.error('Elementos <canvas> para gráficos na Home não encontrados.');
        return;
    }

    createPieChart(salesPieCanvas, ['Produto A', 'Produto B', 'Produto C'], [300, 150, 100], ['#f97f24', '#f9a224', '#f9c924']);
    createBarChart(productionBarCanvas, ['Produto A', 'Produto B', 'Produto C'], [500, 200, 300], ['#36a2eb', '#4bc0c0', '#ff6384']);
}

// Função para inicializar gráficos na página de Vendas
function initializeSalesCharts() {
    const salesPieCanvas = document.getElementById('salesPieChart');

    if (!salesPieCanvas) {
        console.error('Elemento <canvas> para gráfico de vendas não encontrado.');
        return;
    }

    createPieChart(salesPieCanvas, ['Produto A', 'Produto B', 'Produto C'], [300, 150, 100], ['#f97f24', '#f9a224', '#f9c924']);
}

// Função para inicializar gráficos na página de Relatórios
function initializeReportCharts() {
    const salesPieCanvas = document.getElementById('salesPieChart');
    const productionBarCanvas = document.getElementById('productionBarChart');

    if (salesPieCanvas) {
        createPieChart(salesPieCanvas, ['Produto A', 'Produto B', 'Produto C'], [300, 150, 100], ['#f97f24', '#f9a224', '#f9c924']);
    }

    if (productionBarCanvas) {
        createBarChart(productionBarCanvas, ['Produto A', 'Produto B', 'Produto C'], [750, 300, 400], ['#36a2eb', '#4bc0c0', '#ff6384']);
    }
}

// Função genérica para criar gráficos de pizza
function createPieChart(canvas, labels, data, colors) {
    new Chart(canvas.getContext('2d'), {
        type: 'pie',
        data: {
            labels,
            datasets: [{ data, backgroundColor: colors }]
        },
        options: { responsive: true }
    });
}

// Função genérica para criar gráficos de barra
function createBarChart(canvas, labels, data, colors) {
    new Chart(canvas.getContext('2d'), {
        type: 'bar',
        data: {
            labels,
            datasets: [{ label: 'Produção', data, backgroundColor: colors }]
        },
        options: {
            responsive: true,
            scales: { y: { beginAtZero: true } }
        }
    });
}

// Configurar botões de exportação na página de Relatórios
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

// Função para carregar vendas
function loadVendas() {
    const vendasList = document.getElementById('vendasList');
    if (!vendasList) return;

    vendasList.innerHTML = '';
    const vendas = JSON.parse(localStorage.getItem('vendas')) || [];

    vendas.forEach(venda => {
        const vendaCard = document.createElement('div');
        vendaCard.classList.add('venda-card');
        vendaCard.innerHTML = `
            <p><strong>Produto:</strong> ${venda.produto}</p>
            <p><strong>Quantidade:</strong> ${venda.quantidade}kg</p>
            <p><strong>Valor Total:</strong> R$ ${venda.valor}</p>
        `;
        vendasList.appendChild(vendaCard);
    });
}

// Função para carregar fornecedores
function loadFornecedores() {
    const fornecedoresList = document.getElementById('fornecedoresList');
    if (!fornecedoresList) return;

    fornecedoresList.innerHTML = '';
    const fornecedores = JSON.parse(localStorage.getItem('fornecedores')) || [];

    if (fornecedores.length === 0) {
        fornecedoresList.innerHTML = '<p>Nenhum fornecedor cadastrado.</p>';
        return;
    }

    fornecedores.forEach((fornecedor, index) => {
        const card = document.createElement('div');
        card.className = 'fornecedor-card';
        card.innerHTML = `
            <h3>${fornecedor.name}</h3>
            <p><strong>Contato:</strong> ${fornecedor.contact}</p>
            <p><strong>Produto:</strong> ${fornecedor.product}</p>
            <button onclick="removeFornecedor(${index})" class="remove-btn">Remover</button>
        `;
        fornecedoresList.appendChild(card);
    });
}

// Configurar o formulário de fornecedores
function setupFornecedorForm() {
    const form = document.getElementById('fornecedorForm');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        addFornecedor();
    });
}

// Adicionar fornecedor ao LocalStorage
function addFornecedor() {
    const name = document.getElementById('fornecedorName').value.trim();
    const contact = document.getElementById('fornecedorContact').value.trim();
    const product = document.getElementById('fornecedorProduct').value.trim();

    if (!name || !contact || !product) {
        alert('Preencha todos os campos.');
        return;
    }

    const newFornecedor = { name, contact, product };
    const fornecedores = JSON.parse(localStorage.getItem('fornecedores')) || [];
    fornecedores.push(newFornecedor);

    localStorage.setItem('fornecedores', JSON.stringify(fornecedores));
    loadFornecedores();
    document.getElementById('fornecedorForm').reset();
}

// Remover fornecedor
function removeFornecedor(index) {
    const fornecedores = JSON.parse(localStorage.getItem('fornecedores')) || [];
    fornecedores.splice(index, 1);

    localStorage.setItem('fornecedores', JSON.stringify(fornecedores));
    loadFornecedores();
}

// Atualizar barras de progresso
function updateProgressBars() {
    document.querySelectorAll('.progress-bar').forEach(bar => {
        const progress = bar.getAttribute('data-progress') || 0;
        bar.style.width = `${progress}%`;
    });
}
