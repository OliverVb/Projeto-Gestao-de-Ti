// Variáveis globais para armazenar dados do banco
let tiData = [];
let impressorasData = [];
let internetData = [];
let equipamentosData = [];
let emailsData = [];
let vigenciasData = [];
let viagensData = [];

// Estado da aplicação
let currentTab = 'dashboard';
let viewMode = 'cards';
let searchQuery = '';
let isLoadingData = false;

// Elementos DOM
const navItems = document.querySelectorAll('.nav-item');
const tabContents = document.querySelectorAll('.tab-content');
const viewBtns = document.querySelectorAll('.view-btn');
const modal = document.getElementById('detailModal');
const modalClose = document.querySelector('.modal-close');

// =============================================
// FUNÇÕES DE CARREGAMENTO DE DADOS DO BANCO
// =============================================

async function loadDataFromDatabase() {
    if (isLoadingData) return;
    isLoadingData = true;
    
    try {
        showLoading();
        
        // Carregar todos os dados em paralelo
        const [tiResponse, impressorasResponse, internetResponse, equipamentosResponse, emailsResponse, vigenciasResponse, viagensResponse] = await Promise.all([
            fetch('api/get_equipe_ti.php'),
            fetch('api/get_impressoras.php'),
            fetch('api/get_internet.php'),
            fetch('api/get_equipamentos.php'),
            fetch('api/get_emails.php'),
            fetch('api/get_vigencias_internet.php'),
            fetch('api/get_viagens.php')
        ]);
        
        const tiResult = await tiResponse.json();
        const impressorasResult = await impressorasResponse.json();
        const internetResult = await internetResponse.json();
        const equipamentosResult = await equipamentosResponse.json();
        const emailsResult = await emailsResponse.json();
        const vigenciasResult = await vigenciasResponse.json();
        const viagensResult = await viagensResponse.json();
        
        if (tiResult.success) tiData = tiResult.data;
        if (impressorasResult.success) impressorasData = impressorasResult.data;
        if (internetResult.success) internetData = internetResult.data;
        if (equipamentosResult.success) equipamentosData = equipamentosResult.data;
        if (emailsResult.success) emailsData = emailsResult.data;
        if (vigenciasResult.success) vigenciasData = vigenciasResult.data;
        if (viagensResult.success) viagensData = viagensResult.data;
        
        console.log('✅ Dados carregados do banco:', {
            equipe_ti: tiData.length,
            impressoras: impressorasData.length,
            internet: internetData.length,
            equipamentos: equipamentosData.length,
            emails: emailsData.length,
            vigencias: vigenciasData.length,
            viagens: viagensData.length
        });
        
        hideLoading();
        return true;
        
    } catch (error) {
        console.error('❌ Erro ao carregar dados:', error);
        hideLoading();
        showError('Erro ao carregar dados do banco de dados. Verifique a conexão.');
        return false;
    } finally {
        isLoadingData = false;
    }
}

function showLoading() {
    const loader = document.createElement('div');
    loader.id = 'globalLoader';
    loader.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(255,255,255,0.9);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        flex-direction: column;
    `;
    loader.innerHTML = `
        <div style="text-align: center;">
            <div style="width: 50px; height: 50px; border: 4px solid #f3f3f3; border-top: 4px solid #57bd9e; border-radius: 50%; animation: spin 1s linear infinite;"></div>
            <p style="margin-top: 20px; color: #333; font-size: 16px;">Carregando dados do banco...</p>
        </div>
    `;
    document.body.appendChild(loader);
    
    const style = document.createElement('style');
    style.textContent = '@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }';
    document.head.appendChild(style);
}

function hideLoading() {
    const loader = document.getElementById('globalLoader');
    if (loader) loader.remove();
}

function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #f44336;
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        z-index: 10001;
        max-width: 400px;
    `;
    errorDiv.innerHTML = `<strong>⚠️ Erro:</strong> ${message}`;
    document.body.appendChild(errorDiv);
    
    setTimeout(() => errorDiv.remove(), 5000);
}

// =============================================
// INICIALIZAÇÃO
// =============================================

document.addEventListener('DOMContentLoaded', async () => {
    // Carregar dados do banco primeiro
    const loaded = await loadDataFromDatabase();
    
    if (loaded) {
        initializeApp();
        setupEventListeners();
        setupSidebarToggle();
        setupMobileMenuBtn();
        
        // Inicializa os dropdowns customizados após os dados serem carregados
        setTimeout(initCustomDropdowns, 200);
    }
});

// Botão de menu mobile para abrir a sidebar
function setupMobileMenuBtn() {
    const sidebar = document.querySelector('.sidebar');
    const btn = document.getElementById('mobileMenuBtn');
    if (!sidebar || !btn) return;
    btn.addEventListener('click', (e) => {
        e.stopPropagation();
        sidebar.classList.toggle('open');
        btn.classList.toggle('active');
    });
    // Fecha o menu ao clicar fora
    document.addEventListener('click', (e) => {
        if (window.innerWidth <= 900 && sidebar.classList.contains('open')) {
            if (!sidebar.contains(e.target) && !e.target.closest('#mobileMenuBtn')) {
                sidebar.classList.remove('open');
                btn.classList.remove('active');
            }
        }
    });
}
// Responsivo: alternar menu lateral em telas pequenas
function setupSidebarToggle() {
    const sidebar = document.querySelector('.sidebar');
    const sidebarToggle = document.getElementById('sidebarToggle');
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', () => {
            sidebar.classList.toggle('open');
        });
    }
    // Fechar menu ao clicar fora (mobile)
    document.addEventListener('click', (e) => {
        if (window.innerWidth <= 900 && sidebar.classList.contains('open')) {
            if (!sidebar.contains(e.target) && !e.target.closest('#sidebarToggle')) {
                sidebar.classList.remove('open');
            }
        }
    });
}

function initializeApp() {
    renderDashboard();
    renderAllTabs();
    populateFilters();
}

function setupEventListeners() {
    // Navegação entre tabs
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            const tab = item.dataset.tab;
            switchTab(tab);
        });
    });



    // Modo de visualização
    viewBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            viewMode = btn.dataset.view;
            viewBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            renderCurrentTab();
        });
    });

    // Modal
    modalClose.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    // Filtros
    setupFilterListeners();
}

function switchTab(tab) {
    currentTab = tab;
    
    // Atualizar navegação
    navItems.forEach(item => item.classList.remove('active'));
    document.querySelector(`[data-tab="${tab}"]`).classList.add('active');
    
    // Atualizar conteúdo
    tabContents.forEach(content => content.classList.remove('active'));
    document.getElementById(tab).classList.add('active');
    
    // Resetar busca
    globalSearch.value = '';
    searchQuery = '';
    
    // Renderizar conteúdo
    if (tab !== 'dashboard') {
        renderCurrentTab();
    }
}

function renderCurrentTab() {
    switch(currentTab) {
        case 'ti':
            renderTI();
            break;
        case 'impressoras':
            renderImpressoras();
            break;
        case 'internet':
            renderInternet();
            break;
        case 'equipamentos':
            renderEquipamentos();
            break;
        case 'emails':
            renderEmails();
            break;
        case 'vigencias':
            renderVigencias();
            break;
        case 'viagens':
            renderViagens();
            break;
    }
}

// Dashboard
let currentCitySource = 'ti'; // Fonte atual da distribuição por cidade

function renderDashboard() {
    const cityList = document.getElementById('cityList');
    
    // Atualizar os números dos cards do dashboard
    updateDashboardStats();
    
    // Configurar abas de cidade
    setupCityTabs();
    
    // Renderizar lista de cidades
    renderCityList();
}

function setupCityTabs() {
    const tabs = document.querySelectorAll('.city-tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            currentCitySource = tab.dataset.source;
            renderCityList();
        });
    });
}

function renderCityList() {
    const cityList = document.getElementById('cityList');
    if (!cityList) return;
    
    // Selecionar dados baseado na fonte atual
    let data;
    switch (currentCitySource) {
        case 'ti':
            data = tiData;
            break;
        case 'impressoras':
            data = impressorasData;
            break;
        case 'internet':
            data = internetData;
            break;
        case 'equipamentos':
            data = equipamentosData;
            break;
        default:
            data = tiData;
    }
    
    // Agrupar por cidade
    const cities = {};
    data.forEach(item => {
        if (item.cidade) {
            cities[item.cidade] = (cities[item.cidade] || 0) + 1;
        }
    });
    
    let html = '';
    const sortedCities = Object.entries(cities).sort((a, b) => b[1] - a[1]);
    
    if (sortedCities.length === 0) {
        html = '<div class="city-empty">Nenhum dado encontrado</div>';
    } else {
        sortedCities.forEach(([city, count]) => {
            html += `
                <div class="city-item" onclick="navigateToCity('${currentCitySource}', '${city.replace(/'/g, "\\'")}')"
                     style="cursor: pointer;" title="Clique para ver detalhes de ${city}">
                    <span class="city-name">${city}</span>
                    <span class="city-count">${count}</span>
                </div>
            `;
        });
    }
    
    cityList.innerHTML = html;
}

// Navegar para a aba correspondente e filtrar por cidade
function navigateToCity(tab, city) {
    // Mudar para a aba
    switchTab(tab);
    
    // Aplicar filtro de cidade
    setTimeout(() => {
        const filterSelect = document.getElementById(tab + 'CityFilter') || 
                            document.getElementById(tab === 'ti' ? 'tiCityFilter' : tab + 'CityFilter');
        if (filterSelect) {
            // Procurar a opção que corresponde à cidade
            for (let option of filterSelect.options) {
                if (option.value === city || option.text === city) {
                    filterSelect.value = option.value;
                    filterSelect.dispatchEvent(new Event('change'));
                    break;
                }
            }
        }
        renderCurrentTab();
    }, 100);
}

// Atualizar estatísticas do dashboard
function updateDashboardStats() {
    // Atualizar cada card com os valores corretos
    const cardEquipamentos = document.querySelector('#card-equipamentos .stat-info h3');
    const cardTi = document.querySelector('#card-ti .stat-info h3');
    const cardImpressoras = document.querySelector('#card-impressoras .stat-info h3');
    const cardInternet = document.querySelector('#card-internet .stat-info h3');
    const cardEmails = document.querySelector('#card-emails .stat-info h3');
    const cardVigencias = document.querySelector('#card-vigencias .stat-info h3');
    const cardViagens = document.querySelector('#card-viagens .stat-info h3');
    
    if (cardEquipamentos) cardEquipamentos.textContent = equipamentosData.length;
    if (cardTi) cardTi.textContent = tiData.length;
    if (cardImpressoras) cardImpressoras.textContent = impressorasData.length;
    if (cardInternet) cardInternet.textContent = internetData.length;
    if (cardEmails) cardEmails.textContent = emailsData.length;
    if (cardVigencias) cardVigencias.textContent = vigenciasData.length;
    // Para viagens, mostrar apenas as agendadas
    const viagensAgendadas = viagensData.filter(v => v.status === 'AGENDADA' || v.status === 'EM_ANDAMENTO').length;
    if (cardViagens) cardViagens.textContent = viagensAgendadas;
    
    // Atualizar badges da sidebar
    const navBadgeTi = document.getElementById('nav-badge-ti');
    const navBadgeImpressoras = document.getElementById('nav-badge-impressoras');
    const navBadgeInternet = document.getElementById('nav-badge-internet');
    const navBadgeEquipamentos = document.getElementById('nav-badge-equipamentos');
    const navBadgeEmails = document.getElementById('nav-badge-emails');
    const navBadgeVigencias = document.getElementById('nav-badge-vigencias');
    const navBadgeViagens = document.getElementById('nav-badge-viagens');
    
    if (navBadgeTi) navBadgeTi.textContent = tiData.length;
    if (navBadgeImpressoras) navBadgeImpressoras.textContent = impressorasData.length;
    if (navBadgeInternet) navBadgeInternet.textContent = internetData.length;
    if (navBadgeEquipamentos) navBadgeEquipamentos.textContent = equipamentosData.length;
    if (navBadgeEmails) navBadgeEmails.textContent = emailsData.length;
    if (navBadgeVigencias) navBadgeVigencias.textContent = vigenciasData.length;
    if (navBadgeViagens) navBadgeViagens.textContent = viagensAgendadas;
    
    // Atualizar resumos rápidos
    const impressorasFuncionando = document.getElementById('impressorasFuncionando');
    const linksAtivos = document.getElementById('linksAtivos');
    const equipamentosCadastrados = document.getElementById('equipamentosCadastrados');
    
    if (impressorasFuncionando) {
        const funcionando = impressorasData.filter(i => i.funcionando === 'SIM').length;
        impressorasFuncionando.textContent = funcionando;
    }
    if (linksAtivos) {
        linksAtivos.textContent = internetData.length;
    }
    if (equipamentosCadastrados) {
        equipamentosCadastrados.textContent = equipamentosData.length;
    }
}

// Função para normalizar string: remove acentos, caixa e espaços extras
function normalizeString(str) {
    return String(str)
        .toLowerCase()
        .normalize('NFD')
        .replace(/\p{Diacritic}/gu, '')
        .replace(/\s+/g, ' ')
        .trim();
}

// Renderizar TI
function renderTI() {
    const container = document.getElementById('tiContent');
    const cityFilter = document.getElementById('tiCityFilter').value;
    let filteredData = tiData.filter(item => {
        const matchSearch = !searchQuery ||
            Object.values(item).some(val =>
                normalizeString(val).includes(normalizeString(searchQuery))
            );
        const matchCity = !cityFilter || item.cidade === cityFilter;
        return matchSearch && matchCity && item.nome;
    });
    
    // Adicionar botão "Adicionar Novo"
    if (typeof addCrudButtons === 'function') {
        setTimeout(() => addCrudButtons('ti'), 0);
    }
    
    if (viewMode === 'cards') {
        container.className = 'data-container';
        container.innerHTML = filteredData.map(item => `
            <div class="data-card">
                <div class="card-header">
                    <div class="card-title">${item.nome}</div>
                    <div class="card-badge">💻 TI</div>
                </div>
                <div class="card-body" onclick='showDetails(${JSON.stringify(item)})'>
                    <div class="card-field">
                        <div class="card-field-label">COTEC</div>
                        <div class="card-field-value">${item.cotec}</div>
                    </div>
                    <div class="card-field">
                        <div class="card-field-label">Cidade</div>
                        <div class="card-field-value">${item.cidade}</div>
                    </div>
                    <div class="card-field">
                        <div class="card-field-label">Telefone</div>
                        <div class="card-field-value">${item.telefone || '-'}</div>
                    </div>
                    <div class="card-field">
                        <div class="card-field-label">Horário</div>
                        <div class="card-field-value">${item.horario || '-'}</div>
                    </div>
                </div>
                ${typeof addItemCrudButtons === 'function' ? addItemCrudButtons(item, 'ti') : ''}
            </div>
        `).join('');
    } else {
        container.className = 'data-container table-view';
        container.innerHTML = `
            <div class="data-table">
                <table>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Nome</th>
                            <th>COTEC</th>
                            <th>Cidade</th>
                            <th>Telefone</th>
                            <th>Horário</th>
                            <th style="width: 100px;">Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${filteredData.map((item, index) => `
                            <tr>
                                <td>${index + 1}</td>
                                <td><strong>${item.nome}</strong></td>
                                <td>${item.cotec}</td>
                                <td>${item.cidade}</td>
                                <td>${item.telefone || '-'}</td>
                                <td>${item.horario || '-'}</td>
                                <td style="white-space: nowrap;">
                                    <button class="crud-btn-mini crud-btn-edit" onclick='openCrudModal("ti", "edit", ${JSON.stringify(item)})' title="Editar">✏️</button>
                                    <button class="crud-btn-mini crud-btn-delete" onclick='crudDelete("ti", ${item.id})' title="Excluir">🗑️</button>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;
    }
    
    if (filteredData.length === 0) {
        container.innerHTML = '<div class="empty-state"><h3>🔍 Nenhum resultado encontrado</h3></div>';
    }
}

// Renderizar Impressoras
function renderImpressoras() {
    const container = document.getElementById('impressorasContent');
    const cityFilter = document.getElementById('impressoraCityFilter').value;
    const statusFilter = document.getElementById('impressoraStatusFilter').value;
    let filteredData = impressorasData.filter(item => {
        const matchSearch = !searchQuery ||
            Object.values(item).some(val =>
                normalizeString(val).includes(normalizeString(searchQuery))
            );
        const matchCity = !cityFilter || item.cidade === cityFilter;
        let matchStatus = true;
        if (statusFilter === 'SIM' || statusFilter === 'NÃO') {
            matchStatus = item.funcionando === statusFilter;
        } else if (statusFilter === 'LOCADAS') {
            matchStatus = item.obs && normalizeString(item.obs).includes('locada');
        } else if (statusFilter === 'PATRIMONIAIS') {
            matchStatus = item.obs && (
                normalizeString(item.obs).includes('patrimonial') ||
                normalizeString(item.obs).includes('impressoras do colegio') ||
                normalizeString(item.obs).includes('impressoras da escola')
            );
        }
        return matchSearch && matchCity && matchStatus;
    });
    
    // Adicionar botão "Adicionar Novo"
    if (typeof addCrudButtons === 'function') {
        setTimeout(() => addCrudButtons('impressoras'), 0);
    }
    
    if (viewMode === 'cards') {
        container.className = 'data-container';
        container.innerHTML = filteredData.map(item => {
            const totalMonos = parseInt(item.monocromatica) || 0;
            const totalPolis = parseInt(item.policromatica) || 0;
            const totalImpressoras = totalMonos + totalPolis;
            // Lógica para separar locadas e patrimoniais
            let locadasMono = 0, patrimoniaisMono = 0, locadasPoli = 0, patrimoniaisPoli = 0;
            const obsNorm = (item.obs || '').toLowerCase();
            // Se mencionar locada/mbm, considerar todas locadas
            if (obsNorm.includes('locada') || obsNorm.includes('mbm')) {
                locadasMono = totalMonos;
                locadasPoli = totalPolis;
            }
            // Se mencionar impressora do colégio/escola, considerar patrimoniais
            if (obsNorm.includes('impressora do colégio') || obsNorm.includes('impressoras do colégio') || obsNorm.includes('impressora da escola') || obsNorm.includes('impressoras da escola')) {
                // Tenta extrair o número de patrimoniais das observações
                const match = obsNorm.match(/(\d+) impressora[s]? (do col[eé]gio|da escola)/);
                if (match) {
                    patrimoniaisMono = parseInt(match[1]);
                } else {
                    patrimoniaisMono = totalMonos > 0 ? 1 : 0;
                }
                // Se todas monocromáticas são patrimoniais, locadas é zero
                if (patrimoniaisMono > 0 && patrimoniaisMono <= totalMonos) {
                    locadasMono = totalMonos - patrimoniaisMono;
                }
            }
            // Ajuste para não dar soma maior que o total
            if (locadasMono + patrimoniaisMono > totalMonos) {
                patrimoniaisMono = totalMonos - locadasMono;
            }
            // Exibição
            return `
                <div class="data-card">
                    <div class="card-header">
                        <div class="card-title">${item.cotec}</div>
                        <div class="card-badge">🖨️ ${totalImpressoras}</div>
                    </div>
                    <div class="card-body" onclick='showDetails(${JSON.stringify(item)})'>
                        <div class="card-field">
                            <div class="card-field-label">Cidade</div>
                            <div class="card-field-value">${item.cidade}</div>
                        </div>
                        <div class="card-field">
                            <div class="card-field-label">Monocromáticas</div>
                            <div class="card-field-value">
                                ${totalMonos}
                                ${locadasMono > 0 ? `<span style='color:#1976d2;font-size:0.9em;'> (${locadasMono} locada${locadasMono>1?'s':''})</span>` : ''}
                                ${patrimoniaisMono > 0 ? `<span style='color:#43a047;font-size:0.9em;'> (${patrimoniaisMono} patrimonial${patrimoniaisMono>1?'s':''})</span>` : ''}
                            </div>
                        </div>
                        <div class="card-field">
                            <div class="card-field-label">Policromáticas</div>
                            <div class="card-field-value">
                                ${totalPolis}
                                ${locadasPoli > 0 ? `<span style='color:#1976d2;font-size:0.9em;'> (${locadasPoli} locada${locadasPoli>1?'s':''})</span>` : ''}
                                ${patrimoniaisPoli > 0 ? `<span style='color:#43a047;font-size:0.9em;'> (${patrimoniaisPoli} patrimonial${patrimoniaisPoli>1?'s':''})</span>` : ''}
                            </div>
                        </div>
                        <div class="card-field">
                            <div class="card-field-label">Status</div>
                            <div class="card-field-value">
                                ${item.funcionando === 'SIM' ? '✅ Funcionando' : '❌ Com Problema'}
                            </div>
                        </div>
                        ${item.obs ? `
                            <div class="card-field">
                                <div class="card-field-label">Observações</div>
                                <div class="card-field-value">${item.obs}</div>
                            </div>
                        ` : ''}
                    </div>
                    ${typeof addItemCrudButtons === 'function' ? addItemCrudButtons(item, 'impressoras') : ''}
                </div>
            `;
        }).join('');
    } else {
        container.className = 'data-container table-view';
        container.innerHTML = `
            <div class="data-table">
                <table>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>COTEC</th>
                            <th>Cidade</th>
                            <th>Monocromática</th>
                            <th>Policromática</th>
                            <th>Status</th>
                            <th>Observações</th>
                            <th style="width: 100px;">Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${filteredData.map((item, index) => `
                            <tr>
                                <td>${index + 1}</td>
                                <td><strong>${item.cotec}</strong></td>
                                <td>${item.cidade}</td>
                                <td>${item.monocromatica}</td>
                                <td>${item.policromatica}</td>
                                <td>${item.funcionando === 'SIM' ? '✅' : '❌'} ${item.funcionando}</td>
                                <td>${item.obs || '-'}</td>
                                <td style="white-space: nowrap;">
                                    <button class="crud-btn-mini crud-btn-edit" onclick='openCrudModal("impressoras", "edit", ${JSON.stringify(item)})' title="Editar">✏️</button>
                                    <button class="crud-btn-mini crud-btn-delete" onclick='crudDelete("impressoras", ${item.id})' title="Excluir">🗑️</button>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;
    }
    
    if (filteredData.length === 0) {
        container.innerHTML = '<div class="empty-state"><h3>🔍 Nenhum resultado encontrado</h3></div>';
    }
}

// Renderizar Internet
function renderInternet() {
    const container = document.getElementById('internetContent');
    const cityFilter = document.getElementById('internetCityFilter').value;
    const operadoraFilter = document.getElementById('internetOperadoraFilter').value;
    
    let filteredData = internetData.filter(item => {
        const matchSearch = !searchQuery ||
            Object.values(item).some(val =>
                normalizeString(val).includes(normalizeString(searchQuery))
            );
        const matchCity = !cityFilter || item.cidade === cityFilter;
        const matchOperadora = !operadoraFilter || item.operadora === operadoraFilter;
        return matchSearch && matchCity && matchOperadora;
    });
    
    // Adicionar botão "Adicionar Novo"
    if (typeof addCrudButtons === 'function') {
        setTimeout(() => addCrudButtons('internet'), 0);
    }
    
    if (viewMode === 'cards') {
        container.className = 'data-container';
        container.innerHTML = filteredData.map(item => `
            <div class="data-card">
                <div class="card-header">
                    <div class="card-title">${item.cotec}</div>
                    <div class="card-badge">🌐 ${item.velocidadeLink || ''}</div>
                </div>
                <div class="card-body" onclick='showDetails(${JSON.stringify(item)})'>
                    <div class="card-field">
                        <div class="card-field-label">Cidade</div>
                        <div class="card-field-value">${item.cidade}</div>
                    </div>
                    <div class="card-field">
                        <div class="card-field-label">Operadora</div>
                        <div class="card-field-value">${item.operadora}</div>
                    </div>
                    <div class="card-field">
                        <div class="card-field-label">Velocidade Contratada</div>
                        <div class="card-field-value">${item.velocidadeLink}</div>
                    </div>
                    ${item.speedtest ? `
                        <div class="card-field">
                            <div class="card-field-label">SpeedTest</div>
                            <div class="card-field-value">${item.speedtest}</div>
                        </div>
                    ` : ''}
                    ${item.obs ? `
                        <div class="card-field">
                            <div class="card-field-label">Observações</div>
                            <div class="card-field-value">${item.obs}</div>
                        </div>
                    ` : ''}
                </div>
                ${typeof addItemCrudButtons === 'function' ? addItemCrudButtons(item, 'internet') : ''}
            </div>
        `).join('');
    } else {
        container.className = 'data-container table-view';
        container.innerHTML = `
            <div class="data-table">
                <table>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>COTEC</th>
                            <th>Cidade</th>
                            <th>Velocidade</th>
                            <th>Operadora</th>
                            <th>SpeedTest</th>
                            <th>Obs</th>
                            <th style="width: 100px;">Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${filteredData.map((item, index) => `
                            <tr>
                                <td>${index + 1}</td>
                                <td><strong>${item.cotec}</strong></td>
                                <td>${item.cidade}</td>
                                <td>${item.velocidadeLink || '-'}</td>
                                <td>${item.operadora || '-'}</td>
                                <td>${item.speedtest || '-'}</td>
                                <td>${item.obs || '-'}</td>
                                <td style="white-space: nowrap;">
                                    <button class="crud-btn-mini crud-btn-edit" onclick='openCrudModal("internet", "edit", ${JSON.stringify(item)})' title="Editar">✏️</button>
                                    <button class="crud-btn-mini crud-btn-delete" onclick='crudDelete("internet", ${item.id})' title="Excluir">🗑️</button>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;
    }
    
    if (filteredData.length === 0) {
        container.innerHTML = '<div class="empty-state"><h3>🔍 Nenhum resultado encontrado</h3></div>';
    }
}

// =============================================
// RENDERIZAÇÃO DE VIGÊNCIAS INTERNETS
// =============================================

function renderVigencias() {
    const container = document.getElementById('vigenciasContent');
    const searchFilter = document.getElementById('vigenciasSearchFilter')?.value || '';
    const cityFilter = document.getElementById('vigenciasCityFilter')?.value || '';
    const statusFilter = document.getElementById('vigenciasStatusFilter')?.value || '';
    
    let filteredData = vigenciasData.filter(item => {
        const matchSearch = !searchFilter ||
            normalizeString(item.fornecedorContrato || '').includes(normalizeString(searchFilter)) ||
            normalizeString(item.cidade || '').includes(normalizeString(searchFilter)) ||
            normalizeString(item.cotec || '').includes(normalizeString(searchFilter)) ||
            normalizeString(item.endereco || '').includes(normalizeString(searchFilter)) ||
            normalizeString(item.planoContratado || '').includes(normalizeString(searchFilter));
        const matchCity = !cityFilter || item.cidade === cityFilter;
        const matchStatus = !statusFilter || item.contratoOk === statusFilter;
        return matchSearch && matchCity && matchStatus;
    });
    
    // Atualizar resumo de totais
    renderVigenciasSummary(filteredData);
    
    // Adicionar botão "Adicionar Novo"
    if (typeof addCrudButtons === 'function') {
        setTimeout(() => addCrudButtons('vigencias'), 0);
    }
    
    if (viewMode === 'cards') {
        container.className = 'data-container';
        container.innerHTML = filteredData.map(item => {
            const statusClass = item.contratoOk === 'SIM' ? 'status-ok' : 
                               item.contratoOk === 'NÃO' ? 'status-erro' : 'status-pendente';
            const statusIcon = item.contratoOk === 'SIM' ? '✅' : 
                              item.contratoOk === 'NÃO' ? '❌' : '⏳';
            const statusText = item.contratoOk === 'SIM' ? 'Contrato OK' : 
                              item.contratoOk === 'NÃO' ? 'Com Problema' : 'Pendente';
            
            return `
                <div class="data-card vigencia-card ${statusClass}">
                    <div class="card-header">
                        <div class="card-title">${item.fornecedorContrato || 'Sem Fornecedor'}</div>
                        <div class="card-badge">${statusIcon} ${statusText}</div>
                    </div>
                    <div class="card-body" onclick='showVigenciaDetails(${JSON.stringify(item).replace(/'/g, "\\'")})'>
                        <div class="card-field">
                            <div class="card-field-label">Ti COTEC (Responsável)</div>
                            <div class="card-field-value">${item.tiCotec || '-'}</div>
                        </div>
                        <div class="card-field">
                            <div class="card-field-label">COTEC</div>
                            <div class="card-field-value">${item.cotec || '-'}</div>
                        </div>
                        <div class="card-field">
                            <div class="card-field-label">Cidade</div>
                            <div class="card-field-value">${item.cidade || '-'}</div>
                        </div>
                        <div class="card-field">
                            <div class="card-field-label">Plano Contratado</div>
                            <div class="card-field-value">${item.planoContratado || '-'}</div>
                        </div>
                        <div class="card-field">
                            <div class="card-field-label">Vigência</div>
                            <div class="card-field-value">${item.vigencia || '-'}</div>
                        </div>
                        <div class="card-field">
                            <div class="card-field-label">Valor Mensal</div>
                            <div class="card-field-value valor-destaque">${item.valorMensalFormatado || '-'}</div>
                        </div>
                        ${item.obs ? `
                            <div class="card-field obs-field">
                                <div class="card-field-label">Observações</div>
                                <div class="card-field-value">${item.obs}</div>
                            </div>
                        ` : ''}
                    </div>
                    ${typeof addItemCrudButtons === 'function' ? addItemCrudButtons(item, 'vigencias') : ''}
                </div>
            `;
        }).join('');
    } else {
        container.className = 'data-container table-view';
        container.innerHTML = `
            <div class="data-table vigencias-table">
                <table>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Fornecedor/Contrato</th>
                            <th>Ti COTEC</th>
                            <th>COTEC</th>
                            <th>Cidade</th>
                            <th>Plano</th>
                            <th>Vigência</th>
                            <th>Valor Mensal</th>
                            <th>Status</th>
                            <th>Obs</th>
                            <th style="width: 100px;">Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${filteredData.map((item, index) => {
                            const statusClass = item.contratoOk === 'SIM' ? 'row-ok' : 
                                               item.contratoOk === 'NÃO' ? 'row-erro' : 'row-pendente';
                            const statusIcon = item.contratoOk === 'SIM' ? '✅' : 
                                              item.contratoOk === 'NÃO' ? '❌' : '⏳';
                            return `
                                <tr class="${statusClass}">
                                    <td>${index + 1}</td>
                                    <td><strong>${item.fornecedorContrato || '-'}</strong></td>
                                    <td>${item.tiCotec || '-'}</td>
                                    <td>${item.cotec || '-'}</td>
                                    <td>${item.cidade || '-'}</td>
                                    <td>${item.planoContratado || '-'}</td>
                                    <td>${item.vigencia || '-'}</td>
                                    <td class="valor-destaque">${item.valorMensalFormatado || '-'}</td>
                                    <td>${statusIcon}</td>
                                    <td>${item.obs || '-'}</td>
                                    <td style="white-space: nowrap;">
                                        <button class="crud-btn-mini crud-btn-edit" onclick='openCrudModal("vigencias", "edit", ${JSON.stringify(item)})' title="Editar">✏️</button>
                                        <button class="crud-btn-mini crud-btn-delete" onclick='crudDelete("vigencias", ${item.id})' title="Excluir">🗑️</button>
                                    </td>
                                </tr>
                            `;
                        }).join('')}
                    </tbody>
                </table>
            </div>
        `;
    }
    
    if (filteredData.length === 0) {
        container.innerHTML = '<div class="empty-state"><h3>🔍 Nenhum resultado encontrado</h3></div>';
    }
}

// Renderizar resumo de totais das vigências
function renderVigenciasSummary(data) {
    const summaryContainer = document.getElementById('vigenciasSummary');
    if (!summaryContainer) return;
    
    const totalContratos = data.length;
    const contratosOk = data.filter(i => i.contratoOk === 'SIM').length;
    const contratosPendentes = data.filter(i => i.contratoOk === 'PENDENTE').length;
    const contratosProblema = data.filter(i => i.contratoOk === 'NÃO').length;
    
    // Calcular valor total mensal (somando todos os valores válidos)
    const valorTotalMensal = data.reduce((sum, i) => {
        const valor = parseFloat(i.valorMensal) || 0;
        return sum + valor;
    }, 0);
    
    // Calcular valor total anual (mensal x 12)
    const valorTotalAnual = valorTotalMensal * 12;
    
    summaryContainer.innerHTML = `
        <div class="vigencias-stats">
            <div class="stat-item stat-total">
                <span class="stat-number">${totalContratos}</span>
                <span class="stat-label">Total Contratos</span>
            </div>
            <div class="stat-item stat-ok">
                <span class="stat-number">${contratosOk}</span>
                <span class="stat-label">✅ OK</span>
            </div>
            <div class="stat-item stat-pendente">
                <span class="stat-number">${contratosPendentes}</span>
                <span class="stat-label">⏳ Pendentes</span>
            </div>
            <div class="stat-item stat-problema">
                <span class="stat-number">${contratosProblema}</span>
                <span class="stat-label">❌ Problemas</span>
            </div>
            <div class="stat-item stat-valor">
                <span class="stat-number">R$ ${valorTotalMensal.toLocaleString('pt-BR', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
                <span class="stat-label">💰 Total Mensal</span>
            </div>
            <div class="stat-item stat-valor-anual">
                <span class="stat-number">R$ ${valorTotalAnual.toLocaleString('pt-BR', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
                <span class="stat-label">📅 Total Anual</span>
            </div>
        </div>
    `;
}

// Mostrar detalhes de vigência em modal
function showVigenciaDetails(item) {
    const modalBody = document.getElementById('modalBody');
    const statusIcon = item.contratoOk === 'SIM' ? '✅' : 
                      item.contratoOk === 'NÃO' ? '❌' : '⏳';
    const statusText = item.contratoOk === 'SIM' ? 'Contrato OK' : 
                      item.contratoOk === 'NÃO' ? 'Com Problema' : 'Pendente';
    
    modalBody.innerHTML = `
        <div class="detail-header">
            <h2>📋 ${item.fornecedorContrato || 'Sem Fornecedor'}</h2>
            <span class="detail-badge">${statusIcon} ${statusText}</span>
        </div>
        <div class="detail-grid">
            <div class="detail-item">
                <label>Ti COTEC (Responsável)</label>
                <span>${item.tiCotec || '-'}</span>
            </div>
            <div class="detail-item">
                <label>COTEC</label>
                <span>${item.cotec || '-'}</span>
            </div>
            <div class="detail-item">
                <label>Cidade</label>
                <span>${item.cidade || '-'}</span>
            </div>
            <div class="detail-item">
                <label>Contato Responsável</label>
                <span>${item.contatoResponsavel || '-'}</span>
            </div>
            <div class="detail-item">
                <label>Contato</label>
                <span>${item.contato || '-'}</span>
            </div>
            <div class="detail-item">
                <label>Vigência</label>
                <span>${item.vigencia || '-'}</span>
            </div>
            <div class="detail-item">
                <label>Plano Contratado</label>
                <span>${item.planoContratado || '-'}</span>
            </div>
            <div class="detail-item">
                <label>Valor Mensal</label>
                <span class="valor-destaque">${item.valorMensalFormatado || '-'}</span>
            </div>
            <div class="detail-item full-width">
                <label>Endereço</label>
                <span>${item.endereco || '-'}</span>
            </div>
            ${item.obs ? `
                <div class="detail-item full-width">
                    <label>Observações</label>
                    <span>${item.obs}</span>
                </div>
            ` : ''}
        </div>
    `;
    
    modal.classList.add('active');
}

// Exportar Vigências para Excel
function exportVigenciasToExcel() {
    const searchFilter = document.getElementById('vigenciasSearchFilter')?.value || '';
    const cityFilter = document.getElementById('vigenciasCityFilter')?.value || '';
    const statusFilter = document.getElementById('vigenciasStatusFilter')?.value || '';
    
    let filteredData = vigenciasData.filter(item => {
        const matchSearch = !searchFilter ||
            normalizeString(item.fornecedorContrato || '').includes(normalizeString(searchFilter)) ||
            normalizeString(item.cidade || '').includes(normalizeString(searchFilter)) ||
            normalizeString(item.cotec || '').includes(normalizeString(searchFilter));
        const matchCity = !cityFilter || item.cidade === cityFilter;
        const matchStatus = !statusFilter || item.contratoOk === statusFilter;
        return matchSearch && matchCity && matchStatus;
    });
    
    if (filteredData.length === 0) {
        alert('Nenhum dado para exportar com os filtros atuais.');
        return;
    }
    
    let excelContent = `
        <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
        <head>
            <meta charset="UTF-8">
            <style>
                table { border-collapse: collapse; }
                th, td { border: 1px solid #000; padding: 8px; text-align: left; }
                th { background-color: #57bd9e; color: white; font-weight: bold; }
                .status-ok { background-color: #d4edda; }
                .status-pendente { background-color: #fff3cd; }
                .status-erro { background-color: #f8d7da; }
            </style>
        </head>
        <body>
            <table>
                <thead>
                    <tr>
                        <th>Fornecedor/Contrato</th>
                        <th>Ti COTEC (Responsável)</th>
                        <th>Contato Responsável</th>
                        <th>Vigência</th>
                        <th>Endereço</th>
                        <th>Plano Contratado</th>
                        <th>Cidade</th>
                        <th>COTEC</th>
                        <th>Contato</th>
                        <th>Valor Mensal</th>
                        <th>Observações</th>
                        <th>Contrato OK?</th>
                    </tr>
                </thead>
                <tbody>
    `;
    
    filteredData.forEach(item => {
        const statusClass = item.contratoOk === 'SIM' ? 'status-ok' : 
                           item.contratoOk === 'NÃO' ? 'status-erro' : 'status-pendente';
        excelContent += `
            <tr class="${statusClass}">
                <td>${item.fornecedorContrato || ''}</td>
                <td>${item.tiCotec || ''}</td>
                <td>${item.contatoResponsavel || ''}</td>
                <td>${item.vigencia || ''}</td>
                <td>${item.endereco || ''}</td>
                <td>${item.planoContratado || ''}</td>
                <td>${item.cidade || ''}</td>
                <td>${item.cotec || ''}</td>
                <td>${item.contato || ''}</td>
                <td>${item.valorMensalFormatado || ''}</td>
                <td>${item.obs || ''}</td>
                <td>${item.contratoOk || ''}</td>
            </tr>
        `;
    });
    
    const valorTotal = filteredData.reduce((sum, i) => sum + (parseFloat(i.valorMensal) || 0), 0);
    excelContent += `
            <tr>
                <td colspan="9" style="text-align: right; font-weight: bold;">TOTAL MENSAL:</td>
                <td style="font-weight: bold;">R$ ${valorTotal.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</td>
                <td colspan="2"></td>
            </tr>
                </tbody>
            </table>
        </body>
        </html>
    `;
    
    const blob = new Blob([excelContent], { type: 'application/vnd.ms-excel;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `vigencias_internet_${new Date().toISOString().split('T')[0]}.xls`;
    link.click();
}

// Renderizar Equipamentos
function renderEquipamentos() {
    const container = document.getElementById('equipamentosContent');
    const cityFilter = document.getElementById('equipamentoCityFilter').value;
    
    let filteredData = equipamentosData.filter(item => {
        const matchSearch = !searchQuery ||
            Object.values(item).some(val =>
                normalizeString(val).includes(normalizeString(searchQuery))
            );
        const matchCity = !cityFilter || item.cidade === cityFilter;
        return matchSearch && matchCity;
    });
    
    // Adicionar botão "Adicionar Novo"
    if (typeof addCrudButtons === 'function') {
        setTimeout(() => addCrudButtons('equipamentos'), 0);
    }
    
    if (viewMode === 'cards') {
        container.className = 'data-container';
        container.innerHTML = filteredData.map(item => `
            <div class="data-card">
                <div class="card-header">
                    <div class="card-title">${item.cotec}</div>
                    <div class="card-badge">🔧 ${item.unifi || 'N/A'}</div>
                </div>
                <div class="card-body" onclick='showDetails(${JSON.stringify(item)})'>
                    <div class="card-field">
                        <div class="card-field-label">Cidade</div>
                        <div class="card-field-value">${item.cidade}</div>
                    </div>
                    <div class="card-field">
                        <div class="card-field-label">Equipamentos</div>
                        <div class="card-field-value">${item.equipamentos.substring(0, 150)}...</div>
                    </div>
                    ${item.unifi ? `
                        <div class="card-field">
                            <div class="card-field-label">UniFi</div>
                            <div class="card-field-value">${item.unifi}</div>
                        </div>
                    ` : ''}
                </div>
                ${typeof addItemCrudButtons === 'function' ? addItemCrudButtons(item, 'equipamentos') : ''}
            </div>
        `).join('');
    } else {
        container.className = 'data-container table-view';
        container.innerHTML = `
            <div class="data-table">
                <table>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>COTEC</th>
                            <th>Cidade</th>
                            <th>Equipamentos</th>
                            <th>UniFi</th>
                            <th style="width: 100px;">Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${filteredData.map((item, index) => `
                            <tr>
                                <td>${index + 1}</td>
                                <td><strong>${item.cotec}</strong></td>
                                <td>${item.cidade}</td>
                                <td>${(item.equipamentos || '').substring(0, 100)}...</td>
                                <td>${item.unifi || '-'}</td>
                                <td style="white-space: nowrap;">
                                    <button class="crud-btn-mini crud-btn-edit" onclick='openCrudModal("equipamentos", "edit", ${JSON.stringify(item)})' title="Editar">✏️</button>
                                    <button class="crud-btn-mini crud-btn-delete" onclick='crudDelete("equipamentos", ${item.id})' title="Excluir">🗑️</button>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;
    }
    
    if (filteredData.length === 0) {
        container.innerHTML = '<div class="empty-state"><h3>🔍 Nenhum resultado encontrado</h3></div>';
    }
}

// Renderizar todas as tabs inicialmente
function renderAllTabs() {
    renderTI();
    renderImpressoras();
    renderInternet();
    renderEquipamentos();
    renderEmails();
    renderVigencias();
    renderViagens();
}

// Renderizar Emails Corporativos
function renderEmails() {
    const container = document.getElementById('emailsContent');
    const searchFilter = document.getElementById('emailSearchFilter').value;
    const statusFilter = document.getElementById('emailStatusFilter').value;
    
    let filteredData = emailsData.filter(item => {
        const matchSearch = !searchFilter ||
            normalizeString(item.nome).includes(normalizeString(searchFilter)) ||
            normalizeString(item.cpf).includes(normalizeString(searchFilter)) ||
            normalizeString(item.emailPessoal || '').includes(normalizeString(searchFilter)) ||
            normalizeString(item.emailCorporativo || '').includes(normalizeString(searchFilter));
        const matchStatus = !statusFilter || item.status === statusFilter;
        return matchSearch && matchStatus;
    });
    
    // Adicionar botão "Adicionar Novo"
    if (typeof addCrudButtons === 'function') {
        setTimeout(() => addCrudButtons('emails'), 0);
    }
    
    if (viewMode === 'cards') {
        container.className = 'data-container';
        container.innerHTML = filteredData.map(item => `
            <div class="data-card">
                <div class="card-header">
                    <div class="card-title">📧 ${item.nome}</div>
                    <div class="card-badge ${item.status === 'criado' ? 'badge-success' : 'badge-warning'}">${item.status}</div>
                </div>
                <div class="card-body" onclick='showDetails(${JSON.stringify(item).replace(/'/g, "&apos;")})'>
                    <div class="card-field">
                        <div class="card-field-label">CPF</div>
                        <div class="card-field-value">${item.cpf || 'N/A'}</div>
                    </div>
                    <div class="card-field">
                        <div class="card-field-label">Email Pessoal</div>
                        <div class="card-field-value">${item.emailPessoal || 'N/A'}</div>
                    </div>
                    <div class="card-field">
                        <div class="card-field-label">Email Corporativo</div>
                        <div class="card-field-value"><strong>${item.emailCorporativo}</strong></div>
                    </div>
                </div>
                ${typeof addItemCrudButtons === 'function' ? addItemCrudButtons(item, 'emails') : ''}
            </div>
        `).join('');
    } else {
        container.className = 'data-container table-view';
        container.innerHTML = `
            <div class="data-table">
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nome</th>
                            <th>CPF</th>
                            <th>Email Pessoal</th>
                            <th>Email Corporativo</th>
                            <th>Status</th>
                            <th style="width: 100px;">Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${filteredData.map(item => `
                            <tr>
                                <td>${item.id}</td>
                                <td><strong>${item.nome}</strong></td>
                                <td>${item.cpf || 'N/A'}</td>
                                <td>${item.emailPessoal || 'N/A'}</td>
                                <td><strong>${item.emailCorporativo}</strong></td>
                                <td><span class="badge ${item.status === 'criado' ? 'badge-success' : 'badge-warning'}">${item.status}</span></td>
                                <td style="white-space: nowrap;">
                                    <button class="crud-btn-mini crud-btn-edit" onclick='openCrudModal("emails", "edit", ${JSON.stringify(item).replace(/'/g, "&apos;")})' title="Editar">✏️</button>
                                    <button class="crud-btn-mini crud-btn-delete" onclick='crudDelete("emails", ${item.id})' title="Excluir">🗑️</button>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;
    }
    
    if (filteredData.length === 0) {
        container.innerHTML = '<div class="empty-state"><h3>🔍 Nenhum resultado encontrado</h3></div>';
    }
}

// Popular filtros
function populateFilters() {
    // Filtro de cidades - TI
    const tiCities = [...new Set(tiData.map(item => item.cidade).filter(c => c))].sort();
    const tiCityFilter = document.getElementById('tiCityFilter');
    tiCities.forEach(city => {
        const option = document.createElement('option');
        option.value = city;
        option.textContent = city;
        tiCityFilter.appendChild(option);
    });
    
    // Filtro de cidades - Impressoras
    const impressoraCities = [...new Set(impressorasData.map(item => item.cidade))].sort();
    const impressoraCityFilter = document.getElementById('impressoraCityFilter');
    impressoraCities.forEach(city => {
        const option = document.createElement('option');
        option.value = city;
        option.textContent = city;
        impressoraCityFilter.appendChild(option);
    });
    
    // Filtro de cidades - Internet
    const internetCities = [...new Set(internetData.map(item => item.cidade))].sort();
    const internetCityFilter = document.getElementById('internetCityFilter');
    internetCities.forEach(city => {
        const option = document.createElement('option');
        option.value = city;
        option.textContent = city;
        internetCityFilter.appendChild(option);
    });
    
    // Filtro de operadoras
    const operadoras = [...new Set(internetData.map(item => item.operadora))].sort();
    const internetOperadoraFilter = document.getElementById('internetOperadoraFilter');
    operadoras.forEach(op => {
        const option = document.createElement('option');
        option.value = op;
        option.textContent = op;
        internetOperadoraFilter.appendChild(option);
    });
    
    // Filtro de cidades - Equipamentos
    const equipamentoCities = [...new Set(equipamentosData.map(item => item.cidade))].sort();
    const equipamentoCityFilter = document.getElementById('equipamentoCityFilter');
    equipamentoCities.forEach(city => {
        const option = document.createElement('option');
        option.value = city;
        option.textContent = city;
        equipamentoCityFilter.appendChild(option);
    });
    
    // Filtro de cidades - Vigências Internets
    const vigenciasCities = [...new Set(vigenciasData.map(item => item.cidade).filter(Boolean))].sort();
    const vigenciasCityFilter = document.getElementById('vigenciasCityFilter');
    if (vigenciasCityFilter) {
        // Limpar opções anteriores mantendo apenas a primeira (Todas as Cidades)
        vigenciasCityFilter.innerHTML = '<option value="">Todas as Cidades</option>';
        vigenciasCities.forEach(city => {
            const option = document.createElement('option');
            option.value = city;
            option.textContent = city;
            vigenciasCityFilter.appendChild(option);
        });
    }
    
    // Filtro de destinos - Viagens
    const viagensDestinos = [...new Set(viagensData.map(item => item.destino).filter(Boolean))].sort();
    const viagensDestinoFilter = document.getElementById('viagensDestinoFilter');
    if (viagensDestinoFilter) {
        viagensDestinoFilter.innerHTML = '<option value="">Todos os Destinos</option>';
        viagensDestinos.forEach(destino => {
            const option = document.createElement('option');
            option.value = destino;
            option.textContent = destino;
            viagensDestinoFilter.appendChild(option);
        });
    }
    
    // Atualiza os dropdowns customizados após popular os filtros
    if (typeof refreshCustomDropdowns === 'function') {
        setTimeout(refreshCustomDropdowns, 50);
    }
}

// Configurar listeners dos filtros
function setupFilterListeners() {
    document.getElementById('tiCityFilter').addEventListener('change', renderTI);
    document.getElementById('impressoraCityFilter').addEventListener('change', renderImpressoras);
    document.getElementById('impressoraStatusFilter').addEventListener('change', renderImpressoras);
    document.getElementById('internetCityFilter').addEventListener('change', renderInternet);
    document.getElementById('internetOperadoraFilter').addEventListener('change', renderInternet);
    document.getElementById('equipamentoCityFilter').addEventListener('change', renderEquipamentos);
    document.getElementById('emailSearchFilter').addEventListener('input', renderEmails);
    document.getElementById('emailStatusFilter').addEventListener('change', renderEmails);
    
    // Vigências Internets
    const vigenciasSearch = document.getElementById('vigenciasSearchFilter');
    const vigenciasCity = document.getElementById('vigenciasCityFilter');
    const vigenciasStatus = document.getElementById('vigenciasStatusFilter');
    if (vigenciasSearch) vigenciasSearch.addEventListener('input', renderVigencias);
    if (vigenciasCity) vigenciasCity.addEventListener('change', renderVigencias);
    if (vigenciasStatus) vigenciasStatus.addEventListener('change', renderVigencias);
    
    // Viagens
    const viagensSearch = document.getElementById('viagensSearchFilter');
    const viagensStatus = document.getElementById('viagensStatusFilter');
    const viagensDestino = document.getElementById('viagensDestinoFilter');
    if (viagensSearch) viagensSearch.addEventListener('input', renderViagens);
    if (viagensStatus) viagensStatus.addEventListener('change', renderViagens);
    if (viagensDestino) viagensDestino.addEventListener('change', renderViagens);
}

// =============================================
// EXPORTAÇÃO PARA EXCEL - EMAILS CORPORATIVOS
// =============================================

function exportEmailsToExcel() {
    // Obter filtros atuais
    const searchFilter = document.getElementById('emailSearchFilter').value;
    const statusFilter = document.getElementById('emailStatusFilter').value;
    
    // Filtrar dados conforme os filtros aplicados
    let filteredData = emailsData.filter(item => {
        const matchSearch = !searchFilter ||
            normalizeString(item.nome).includes(normalizeString(searchFilter)) ||
            normalizeString(item.cpf).includes(normalizeString(searchFilter)) ||
            normalizeString(item.emailPessoal || '').includes(normalizeString(searchFilter)) ||
            normalizeString(item.emailCorporativo || '').includes(normalizeString(searchFilter));
        const matchStatus = !statusFilter || item.status === statusFilter;
        return matchSearch && matchStatus;
    });
    
    if (filteredData.length === 0) {
        alert('Nenhum dado para exportar com os filtros atuais.');
        return;
    }
    
    // Criar conteúdo do arquivo Excel (formato HTML table que Excel reconhece)
    let excelContent = `
        <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
        <head>
            <meta charset="UTF-8">
            <!--[if gte mso 9]>
            <xml>
                <x:ExcelWorkbook>
                    <x:ExcelWorksheets>
                        <x:ExcelWorksheet>
                            <x:Name>Emails Corporativos</x:Name>
                            <x:WorksheetOptions>
                                <x:DisplayGridlines/>
                            </x:WorksheetOptions>
                        </x:ExcelWorksheet>
                    </x:ExcelWorksheets>
                </x:ExcelWorkbook>
            </xml>
            <![endif]-->
            <style>
                table { border-collapse: collapse; }
                th, td { border: 1px solid #000; padding: 8px; text-align: left; }
                th { background-color: #57bd9e; color: white; font-weight: bold; }
                .status-criado { background-color: #d4edda; color: #155724; }
                .status-solicitado { background-color: #fff3cd; color: #856404; }
            </style>
        </head>
        <body>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nome</th>
                        <th>CPF</th>
                        <th>Email Pessoal</th>
                        <th>Email Corporativo</th>
                        <th>Setor</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
    `;
    
    filteredData.forEach(item => {
        const statusClass = item.status === 'criado' ? 'status-criado' : 'status-solicitado';
        excelContent += `
            <tr>
                <td>${item.id || ''}</td>
                <td>${item.nome || ''}</td>
                <td>${item.cpf || 'N/A'}</td>
                <td>${item.emailPessoal || 'N/A'}</td>
                <td>${item.emailCorporativo || ''}</td>
                <td>${item.setor || 'N/A'}</td>
                <td class="${statusClass}">${item.status || ''}</td>
            </tr>
        `;
    });
    
    excelContent += `
                </tbody>
            </table>
        </body>
        </html>
    `;
    
    // Gerar nome do arquivo com base no filtro
    let fileName = 'emails_corporativos';
    if (statusFilter) {
        fileName += '_' + statusFilter.toLowerCase();
    } else {
        fileName += '_todos';
    }
    fileName += '_' + new Date().toISOString().slice(0, 10) + '.xls';
    
    // Criar e baixar o arquivo
    const blob = new Blob([excelContent], { type: 'application/vnd.ms-excel;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
    
    // Mostrar mensagem de sucesso
    showSuccessMessage(`Exportados ${filteredData.length} registro(s) para ${fileName}`);
}

// =============================================
// EXPORTAÇÃO PARA EXCEL - LINKS DE INTERNET
// =============================================

function exportInternetToExcel() {
    // Obter filtros atuais
    const cityFilter = document.getElementById('internetCityFilter').value;
    const operadoraFilter = document.getElementById('internetOperadoraFilter').value;
    
    // Filtrar dados conforme os filtros aplicados
    let filteredData = internetData.filter(item => {
        const matchCity = !cityFilter || item.cidade === cityFilter;
        const matchOperadora = !operadoraFilter || item.operadora === operadoraFilter;
        return matchCity && matchOperadora;
    });
    
    if (filteredData.length === 0) {
        alert('Nenhum dado para exportar com os filtros atuais.');
        return;
    }
    
    // Criar conteúdo do arquivo Excel (formato HTML table que Excel reconhece)
    let excelContent = `
        <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
        <head>
            <meta charset="UTF-8">
            <!--[if gte mso 9]>
            <xml>
                <x:ExcelWorkbook>
                    <x:ExcelWorksheets>
                        <x:ExcelWorksheet>
                            <x:Name>Links de Internet</x:Name>
                            <x:WorksheetOptions>
                                <x:DisplayGridlines/>
                            </x:WorksheetOptions>
                        </x:ExcelWorksheet>
                    </x:ExcelWorksheets>
                </x:ExcelWorkbook>
            </xml>
            <![endif]-->
            <style>
                table { border-collapse: collapse; }
                th, td { border: 1px solid #000; padding: 8px; text-align: left; }
                th { background-color: #0066cc; color: white; font-weight: bold; }
            </style>
        </head>
        <body>
            <table>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Setor</th>
                        <th>Cidade</th>
                        <th>Velocidade Contratada</th>
                        <th>Operadora</th>
                        <th>SpeedTest</th>
                        <th>Observações</th>
                    </tr>
                </thead>
                <tbody>
    `;
    
    filteredData.forEach((item, index) => {
        excelContent += `
            <tr>
                <td>${index + 1}</td>
                <td>${item.cotec || ''}</td>
                <td>${item.cidade || ''}</td>
                <td>${item.velocidadeLink || ''}</td>
                <td>${item.operadora || ''}</td>
                <td>${item.speedtest || ''}</td>
                <td>${item.obs || ''}</td>
            </tr>
        `;
    });
    
    excelContent += `
                </tbody>
            </table>
        </body>
        </html>
    `;
    
    // Gerar nome do arquivo com base nos filtros
    let fileName = 'links_internet';
    if (cityFilter) {
        fileName += '_' + cityFilter.toLowerCase().replace(/\s+/g, '_');
    }
    if (operadoraFilter) {
        fileName += '_' + operadoraFilter.toLowerCase().replace(/\s+/g, '_');
    }
    fileName += '_' + new Date().toISOString().slice(0, 10) + '.xls';
    
    // Criar e baixar o arquivo
    const blob = new Blob([excelContent], { type: 'application/vnd.ms-excel;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
    
    // Mostrar mensagem de sucesso
    showSuccessMessage(`Exportados ${filteredData.length} link(s) de internet para ${fileName}`);
}

function showSuccessMessage(message) {
    const successDiv = document.createElement('div');
    successDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #4CAF50;
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        z-index: 10001;
        max-width: 400px;
        animation: slideIn 0.3s ease;
    `;
    successDiv.innerHTML = `<strong>✅ Sucesso:</strong> ${message}`;
    document.body.appendChild(successDiv);
    
    setTimeout(() => {
        successDiv.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => successDiv.remove(), 300);
    }, 3000);
}

// Mostrar detalhes
function showDetails(data) {
    const modalBody = document.getElementById('modalBody');
    let html = '<h2 style="margin-bottom: 25px; color: var(--primary);">📋 Detalhes Completos</h2>';
    
    Object.entries(data).forEach(([key, value]) => {
        if (value) {
            html += `
                <div class="modal-field">
                    <div class="modal-field-label">${key}</div>
                    <div class="modal-field-value">${value}</div>
                </div>
            `;
        }
    });
    
    modalBody.innerHTML = html;
    modal.classList.add('show');
}

function closeModal() {
    modal.classList.remove('show');
}

// Exportar dados
function exportData() {
    let data;
    let filename;
    
    switch(currentTab) {
        case 'ti':
            data = tiData;
            filename = 'equipe_ti';
            break;
        case 'impressoras':
            data = impressorasData;
            filename = 'impressoras';
            break;
        case 'internet':
            data = internetData;
            filename = 'internet';
            break;
        case 'equipamentos':
            data = equipamentosData;
            filename = 'equipamentos';
            break;
        case 'emails':
            data = emailsData;
            filename = 'emails_corporativos';
            break;
        default:
            alert('Selecione uma aba para exportar');
            return;
    }
    
    const csv = convertToCSV(data);
    downloadCSV(csv, `${filename}_${Date.now()}.csv`);
}

function convertToCSV(data) {
    if (data.length === 0) return '';
    
    const headers = Object.keys(data[0]);
    const rows = data.map(item => 
        headers.map(header => {
            const value = String(item[header] || '');
            return value.includes(',') || value.includes('"') || value.includes('\n')
                ? `"${value.replace(/"/g, '""')}"`
                : value;
        }).join(',')
    );
    
    return [headers.join(','), ...rows].join('\n');
}

function downloadCSV(csv, filename) {
    const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
}

// =============================================
// SISTEMA DE IMPRESSÃO COM SELEÇÃO
// =============================================

function openPrintModal() {
    // Remove modal anterior se existir
    const existingModal = document.getElementById('printModal');
    if (existingModal) existingModal.remove();

    const printModal = document.createElement('div');
    printModal.id = 'printModal';
    printModal.style.cssText = `
        position: fixed;
        inset: 0;
        background: rgba(0,0,0,0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10005;
        padding: 20px;
    `;

    printModal.innerHTML = `
        <div style="
            background: #fff;
            border-radius: 16px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            max-width: 420px;
            width: 100%;
            overflow: hidden;
        ">
            <div style="
                background: linear-gradient(135deg, #57bd9e 0%, #3d9a7c 100%);
                color: white;
                padding: 20px 24px;
            ">
                <h2 style="margin: 0; font-size: 1.3rem;">🖨️ Selecione o que deseja imprimir</h2>
            </div>
            <div style="padding: 20px 24px;">
                <div id="printOptions" style="display: flex; flex-direction: column; gap: 10px;">
                    <label class="print-option" style="display: flex; align-items: center; gap: 12px; padding: 14px 16px; border: 2px solid #e0e0e0; border-radius: 10px; cursor: pointer; transition: all 0.2s;">
                        <input type="radio" name="printChoice" value="current" checked style="width: 18px; height: 18px; accent-color: #57bd9e;">
                        <span style="font-size: 1.1rem;">📄 Aba Atual (${getTabLabel(currentTab)})</span>
                    </label>
                    <label class="print-option" style="display: flex; align-items: center; gap: 12px; padding: 14px 16px; border: 2px solid #e0e0e0; border-radius: 10px; cursor: pointer; transition: all 0.2s;">
                        <input type="radio" name="printChoice" value="ti" style="width: 18px; height: 18px; accent-color: #57bd9e;">
                        <span style="font-size: 1.1rem;">💻 Equipe TI (${tiData.length})</span>
                    </label>
                    <label class="print-option" style="display: flex; align-items: center; gap: 12px; padding: 14px 16px; border: 2px solid #e0e0e0; border-radius: 10px; cursor: pointer; transition: all 0.2s;">
                        <input type="radio" name="printChoice" value="impressoras" style="width: 18px; height: 18px; accent-color: #57bd9e;">
                        <span style="font-size: 1.1rem;">🖨️ Impressoras (${impressorasData.length})</span>
                    </label>
                    <label class="print-option" style="display: flex; align-items: center; gap: 12px; padding: 14px 16px; border: 2px solid #e0e0e0; border-radius: 10px; cursor: pointer; transition: all 0.2s;">
                        <input type="radio" name="printChoice" value="internet" style="width: 18px; height: 18px; accent-color: #57bd9e;">
                        <span style="font-size: 1.1rem;">🌐 Internet (${internetData.length})</span>
                    </label>
                    <label class="print-option" style="display: flex; align-items: center; gap: 12px; padding: 14px 16px; border: 2px solid #e0e0e0; border-radius: 10px; cursor: pointer; transition: all 0.2s;">
                        <input type="radio" name="printChoice" value="equipamentos" style="width: 18px; height: 18px; accent-color: #57bd9e;">
                        <span style="font-size: 1.1rem;">🔧 Equipamentos (${equipamentosData.length})</span>
                    </label>
                    <label class="print-option" style="display: flex; align-items: center; gap: 12px; padding: 14px 16px; border: 2px solid #e0e0e0; border-radius: 10px; cursor: pointer; transition: all 0.2s;">
                        <input type="radio" name="printChoice" value="emails" style="width: 18px; height: 18px; accent-color: #57bd9e;">
                        <span style="font-size: 1.1rem;">📧 Emails Corporativos (${emailsData.length})</span>
                    </label>
                    <label class="print-option" style="display: flex; align-items: center; gap: 12px; padding: 14px 16px; border: 2px solid #e0e0e0; border-radius: 10px; cursor: pointer; transition: all 0.2s;">
                        <input type="radio" name="printChoice" value="all" style="width: 18px; height: 18px; accent-color: #57bd9e;">
                        <span style="font-size: 1.1rem;">📚 Tudo (Relatório Completo)</span>
                    </label>
                </div>
            </div>
            <div style="display: flex; gap: 12px; padding: 16px 24px; background: #f8f9fa; border-top: 1px solid #e0e0e0;">
                <button id="printCancelBtn" style="
                    flex: 1;
                    padding: 12px 20px;
                    border: 2px solid #e0e0e0;
                    background: #fff;
                    border-radius: 10px;
                    font-size: 1rem;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.2s;
                ">Cancelar</button>
                <button id="printConfirmBtn" style="
                    flex: 1;
                    padding: 12px 20px;
                    border: none;
                    background: linear-gradient(135deg, #57bd9e 0%, #3d9a7c 100%);
                    color: white;
                    border-radius: 10px;
                    font-size: 1rem;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.2s;
                ">🖨️ Imprimir</button>
            </div>
        </div>
    `;

    document.body.appendChild(printModal);

    // Destacar opção selecionada
    const options = printModal.querySelectorAll('.print-option');
    options.forEach(opt => {
        opt.addEventListener('click', () => {
            options.forEach(o => o.style.borderColor = '#e0e0e0');
            opt.style.borderColor = '#57bd9e';
        });
        if (opt.querySelector('input').checked) {
            opt.style.borderColor = '#57bd9e';
        }
    });

    // Fechar modal
    printModal.addEventListener('click', (e) => {
        if (e.target === printModal) printModal.remove();
    });

    document.getElementById('printCancelBtn').addEventListener('click', () => {
        printModal.remove();
    });

    // Confirmar impressão
    document.getElementById('printConfirmBtn').addEventListener('click', () => {
        const selected = printModal.querySelector('input[name="printChoice"]:checked').value;
        printModal.remove();
        executePrint(selected);
    });
}

function getTabLabel(tab) {
    const labels = {
        'dashboard': 'Dashboard',
        'ti': 'Equipe TI',
        'impressoras': 'Impressoras',
        'internet': 'Internet',
        'equipamentos': 'Equipamentos',
        'emails': 'Emails Corporativos'
    };
    return labels[tab] || tab;
}

function executePrint(choice) {
    if (choice === 'current') {
        window.print();
        return;
    }

    if (choice === 'all') {
        printAllSections();
        return;
    }

    // Mudar para a aba selecionada e imprimir
    const previousTab = currentTab;
    switchTab(choice);
    
    setTimeout(() => {
        window.print();
        // Voltar para a aba anterior após imprimir
        setTimeout(() => switchTab(previousTab), 500);
    }, 300);
}

function printAllSections() {
    // Criar conteúdo de impressão completo
    const printWindow = window.open('', '_blank');
    
    const css = `
        <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: 'Poppins', Arial, sans-serif; padding: 20px; color: #333; }
            h1 { text-align: center; color: #57bd9e; margin-bottom: 30px; }
            h2 { color: #57bd9e; border-bottom: 2px solid #57bd9e; padding-bottom: 8px; margin: 30px 0 15px 0; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 11px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background: #57bd9e; color: white; }
            tr:nth-child(even) { background: #f9f9f9; }
            .header-info { text-align: center; margin-bottom: 20px; color: #666; }
            @media print { body { padding: 10px; } }
        </style>
    `;

    let content = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <title>Relatório Completo - Sistema COTEC 2026</title>
            ${css}
        </head>
        <body>
            <h1>📊 Sistema COTEC 2026 - Relatório Completo</h1>
            <p class="header-info">Gerado em: ${new Date().toLocaleString('pt-BR')}</p>
    `;

    // Equipe TI
    content += `<h2>💻 Equipe de TI (${tiData.length})</h2>`;
    content += `<table><thead><tr><th>#</th><th>Nome</th><th>COTEC</th><th>Cidade</th><th>Telefone</th><th>Horário</th></tr></thead><tbody>`;
    tiData.forEach((item, i) => {
        content += `<tr><td>${i+1}</td><td>${item.nome || ''}</td><td>${item.cotec || ''}</td><td>${item.cidade || ''}</td><td>${item.telefone || ''}</td><td>${item.horario || ''}</td></tr>`;
    });
    content += `</tbody></table>`;

    // Impressoras
    content += `<h2>🖨️ Impressoras (${impressorasData.length})</h2>`;
    content += `<table><thead><tr><th>#</th><th>COTEC</th><th>Cidade</th><th>Mono</th><th>Poli</th><th>Status</th><th>Obs</th></tr></thead><tbody>`;
    impressorasData.forEach((item, i) => {
        content += `<tr><td>${i+1}</td><td>${item.cotec || ''}</td><td>${item.cidade || ''}</td><td>${item.monocromatica || 0}</td><td>${item.policromatica || 0}</td><td>${item.funcionando || ''}</td><td>${item.obs || ''}</td></tr>`;
    });
    content += `</tbody></table>`;

    // Internet
    content += `<h2>🌐 Internet (${internetData.length})</h2>`;
    content += `<table><thead><tr><th>#</th><th>COTEC</th><th>Cidade</th><th>Velocidade</th><th>Operadora</th><th>SpeedTest</th></tr></thead><tbody>`;
    internetData.forEach((item, i) => {
        content += `<tr><td>${i+1}</td><td>${item.cotec || ''}</td><td>${item.cidade || ''}</td><td>${item.velocidadeLink || ''}</td><td>${item.operadora || ''}</td><td>${item.speedtest || ''}</td></tr>`;
    });
    content += `</tbody></table>`;

    // Equipamentos
    content += `<h2>🔧 Equipamentos (${equipamentosData.length})</h2>`;
    content += `<table><thead><tr><th>#</th><th>COTEC</th><th>Cidade</th><th>Equipamentos</th><th>UniFi</th></tr></thead><tbody>`;
    equipamentosData.forEach((item, i) => {
        content += `<tr><td>${i+1}</td><td>${item.cotec || ''}</td><td>${item.cidade || ''}</td><td>${(item.equipamentos || '').substring(0, 100)}...</td><td>${item.unifi || ''}</td></tr>`;
    });
    content += `</tbody></table>`;

    // Emails
    content += `<h2>📧 Emails Corporativos (${emailsData.length})</h2>`;
    content += `<table><thead><tr><th>#</th><th>Nome</th><th>CPF</th><th>Email Pessoal</th><th>Email Corporativo</th><th>Status</th></tr></thead><tbody>`;
    emailsData.forEach((item, i) => {
        content += `<tr><td>${i+1}</td><td>${item.nome || ''}</td><td>${item.cpf || ''}</td><td>${item.emailPessoal || ''}</td><td>${item.emailCorporativo || ''}</td><td>${item.status || ''}</td></tr>`;
    });
    content += `</tbody></table>`;

    content += `</body></html>`;

    printWindow.document.write(content);
    printWindow.document.close();
    
    setTimeout(() => {
        printWindow.print();
    }, 500);
}

// =============================================
// RENDERIZAÇÃO DE VIAGENS
// =============================================

function renderViagens() {
    const container = document.getElementById('viagensContent');
    const searchFilter = document.getElementById('viagensSearchFilter')?.value || '';
    const statusFilter = document.getElementById('viagensStatusFilter')?.value || '';
    const destinoFilter = document.getElementById('viagensDestinoFilter')?.value || '';
    
    let filteredData = viagensData.filter(item => {
        const matchSearch = !searchFilter ||
            normalizeString(item.responsavel || '').includes(normalizeString(searchFilter)) ||
            normalizeString(item.destino || '').includes(normalizeString(searchFilter)) ||
            normalizeString(item.origem || '').includes(normalizeString(searchFilter)) ||
            normalizeString(item.motivo || '').includes(normalizeString(searchFilter)) ||
            normalizeString(item.cotec || '').includes(normalizeString(searchFilter));
        const matchStatus = !statusFilter || item.status === statusFilter;
        const matchDestino = !destinoFilter || item.destino === destinoFilter;
        return matchSearch && matchStatus && matchDestino;
    });
    
    // Atualizar resumo de totais
    renderViagensSummary(filteredData);
    
    // Adicionar botão "Adicionar Novo"
    if (typeof addCrudButtons === 'function') {
        setTimeout(() => addCrudButtons('viagens'), 0);
    }
    
    if (viewMode === 'cards') {
        container.className = 'data-container';
        container.innerHTML = filteredData.map(item => {
            const statusClass = item.status === 'CONCLUIDA' ? 'status-ok' : 
                               item.status === 'CANCELADA' ? 'status-erro' : 
                               item.status === 'EM_ANDAMENTO' ? 'status-andamento' : 'status-pendente';
            const statusIcon = item.status === 'CONCLUIDA' ? '✅' : 
                              item.status === 'CANCELADA' ? '❌' : 
                              item.status === 'EM_ANDAMENTO' ? '🚗' : '📅';
            const statusText = item.status === 'CONCLUIDA' ? 'Concluída' : 
                              item.status === 'CANCELADA' ? 'Cancelada' : 
                              item.status === 'EM_ANDAMENTO' ? 'Em Andamento' : 'Agendada';
            
            return `
                <div class="data-card viagem-card ${statusClass}">
                    <div class="card-header">
                        <div class="card-title">${item.responsavel || 'Sem Responsável'}</div>
                        <div class="card-badge">${statusIcon} ${statusText}</div>
                    </div>
                    <div class="card-body" onclick='showViagemDetails(${JSON.stringify(item).replace(/'/g, "\\'")})'>
                        <div class="card-field">
                            <div class="card-field-label">📍 Destino</div>
                            <div class="card-field-value destino-destaque">${item.destino || '-'}</div>
                        </div>
                        <div class="card-field">
                            <div class="card-field-label">🏠 Origem</div>
                            <div class="card-field-value">${item.origem || '-'}</div>
                        </div>
                        <div class="card-field">
                            <div class="card-field-label">📅 Data Ida</div>
                            <div class="card-field-value">${item.data_ida_formatada || item.data_ida || '-'}</div>
                        </div>
                        <div class="card-field">
                            <div class="card-field-label">📅 Data Volta</div>
                            <div class="card-field-value">${item.data_volta_formatada || item.data_volta || '-'}</div>
                        </div>
                        <div class="card-field">
                            <div class="card-field-label">� Dias</div>
                            <div class="card-field-value dias-destaque">${item.quantidade_dias || 1} dia(s)</div>
                        </div>
                        <div class="card-field">
                            <div class="card-field-label">🚗 Transporte</div>
                            <div class="card-field-value">${item.meio_transporte || '-'}</div>
                        </div>
                        <div class="card-field">
                            <div class="card-field-label">🏨 Diária (R$ 230,00)</div>
                            <div class="card-field-value valor-destaque">${item.valor_total_diarias_formatado || '-'}</div>
                        </div>
                        <div class="card-field">
                            <div class="card-field-label">💰 Valor Total</div>
                            <div class="card-field-value valor-total-destaque">${item.valor_total_formatado || '-'}</div>
                        </div>
                        ${item.motivo ? `
                            <div class="card-field motivo-field">
                                <div class="card-field-label">📝 Motivo</div>
                                <div class="card-field-value">${item.motivo}</div>
                            </div>
                        ` : ''}
                        ${item.obs ? `
                            <div class="card-field obs-field">
                                <div class="card-field-label">📋 Observações</div>
                                <div class="card-field-value">${item.obs}</div>
                            </div>
                        ` : ''}
                    </div>
                    ${typeof addItemCrudButtons === 'function' ? addItemCrudButtons(item, 'viagens') : ''}
                </div>
            `;
        }).join('');
    } else {
        container.className = 'data-container table-view';
        container.innerHTML = `
            <div class="data-table">
                <table>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Responsável</th>
                            <th>Destino</th>
                            <th>Origem</th>
                            <th>Data Ida</th>
                            <th>Data Volta</th>
                            <th>Dias</th>
                            <th>Diárias</th>
                            <th>Total</th>
                            <th>Status</th>
                            <th style="width: 100px;">Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${filteredData.map((item, index) => {
                            const statusClass = item.status === 'CONCLUIDA' ? 'status-ok' : 
                                               item.status === 'CANCELADA' ? 'status-erro' : 
                                               item.status === 'EM_ANDAMENTO' ? 'status-andamento' : 'status-pendente';
                            const statusText = item.status === 'CONCLUIDA' ? 'Concluída' : 
                                              item.status === 'CANCELADA' ? 'Cancelada' : 
                                              item.status === 'EM_ANDAMENTO' ? 'Em Andamento' : 'Agendada';
                            return `
                                <tr class="${statusClass}">
                                    <td>${index + 1}</td>
                                    <td><strong>${item.responsavel || '-'}</strong></td>
                                    <td>${item.destino || '-'}</td>
                                    <td>${item.origem || '-'}</td>
                                    <td>${item.data_ida_formatada || item.data_ida || '-'}</td>
                                    <td>${item.data_volta_formatada || item.data_volta || '-'}</td>
                                    <td class="text-center">${item.quantidade_dias || 1}</td>
                                    <td class="valor-destaque">${item.valor_total_diarias_formatado || '-'}</td>
                                    <td class="valor-total-destaque">${item.valor_total_formatado || '-'}</td>
                                    <td><span class="badge ${statusClass}">${statusText}</span></td>
                                    <td>
                                        ${typeof addItemCrudButtons === 'function' ? addItemCrudButtons(item, 'viagens') : ''}
                                    </td>
                                </tr>
                            `;
                        }).join('')}
                    </tbody>
                </table>
            </div>
        `;
    }
    
    if (filteredData.length === 0) {
        container.innerHTML = '<div class="empty-state"><span>✈️</span><p>Nenhuma viagem encontrada</p></div>';
    }
}

// Resumo das viagens
function renderViagensSummary(data) {
    const summaryEl = document.getElementById('viagensSummary');
    if (!summaryEl) return;
    
    const agendadas = data.filter(v => v.status === 'AGENDADA').length;
    const emAndamento = data.filter(v => v.status === 'EM_ANDAMENTO').length;
    const concluidas = data.filter(v => v.status === 'CONCLUIDA').length;
    const canceladas = data.filter(v => v.status === 'CANCELADA').length;
    
    // Calcular total de dias
    const totalDias = data.reduce((sum, v) => sum + (parseInt(v.quantidade_dias) || 1), 0);
    
    // Valor da diária padrão
    const valorDiariaPadrao = 230.00;
    
    // Valor total das diárias (dias × R$ 230,00)
    const valorTotalDiarias = data.reduce((sum, v) => sum + (parseFloat(v.valor_total_diarias) || 0), 0);
    const valorDiariasFormatado = valorTotalDiarias.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    
    // Valor de outros custos
    const valorOutros = data.reduce((sum, v) => sum + (parseFloat(v.valor_outros) || 0), 0);
    const valorOutrosFormatado = valorOutros.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    
    // Valor total geral
    const valorTotalGeral = valorTotalDiarias + valorOutros;
    const valorTotalFormatado = valorTotalGeral.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    
    summaryEl.innerHTML = `
        <div class="summary-cards">
            <div class="summary-card summary-agendada">
                <div class="summary-icon">📅</div>
                <div class="summary-info">
                    <span class="summary-value">${agendadas}</span>
                    <span class="summary-label">Agendadas</span>
                </div>
            </div>
            <div class="summary-card summary-andamento">
                <div class="summary-icon">🚗</div>
                <div class="summary-info">
                    <span class="summary-value">${emAndamento}</span>
                    <span class="summary-label">Em Andamento</span>
                </div>
            </div>
            <div class="summary-card summary-concluida">
                <div class="summary-icon">✅</div>
                <div class="summary-info">
                    <span class="summary-value">${concluidas}</span>
                    <span class="summary-label">Concluídas</span>
                </div>
            </div>
            <div class="summary-card summary-cancelada">
                <div class="summary-icon">❌</div>
                <div class="summary-info">
                    <span class="summary-value">${canceladas}</span>
                    <span class="summary-label">Canceladas</span>
                </div>
            </div>
            <div class="summary-card summary-dias">
                <div class="summary-icon">📆</div>
                <div class="summary-info">
                    <span class="summary-value">${totalDias}</span>
                    <span class="summary-label">Total de Dias</span>
                </div>
            </div>
            <div class="summary-card summary-diaria">
                <div class="summary-icon">🏨</div>
                <div class="summary-info">
                    <span class="summary-value">${valorDiariasFormatado}</span>
                    <span class="summary-label">Total Diárias (${totalDias}d × R$ 230)</span>
                </div>
            </div>
            <div class="summary-card summary-outros">
                <div class="summary-icon">🧾</div>
                <div class="summary-info">
                    <span class="summary-value">${valorOutrosFormatado}</span>
                    <span class="summary-label">Outros Custos</span>
                </div>
            </div>
            <div class="summary-card summary-valor">
                <div class="summary-icon">💰</div>
                <div class="summary-info">
                    <span class="summary-value">${valorTotalFormatado}</span>
                    <span class="summary-label">Valor Total Geral</span>
                </div>
            </div>
        </div>
    `;
}

// Mostrar detalhes da viagem
function showViagemDetails(item) {
    const modalBody = document.getElementById('modalBody');
    
    const statusIcon = item.status === 'CONCLUIDA' ? '✅' : 
                      item.status === 'CANCELADA' ? '❌' : 
                      item.status === 'EM_ANDAMENTO' ? '🚗' : '📅';
    const statusText = item.status === 'CONCLUIDA' ? 'Concluída' : 
                      item.status === 'CANCELADA' ? 'Cancelada' : 
                      item.status === 'EM_ANDAMENTO' ? 'Em Andamento' : 'Agendada';
    
    modalBody.innerHTML = `
        <div class="modal-header-custom">
            <h2>✈️ Detalhes da Viagem</h2>
            <span class="modal-status">${statusIcon} ${statusText}</span>
        </div>
        <div class="modal-grid">
            <div class="modal-field">
                <label>Responsável</label>
                <span>${item.responsavel || '-'}</span>
            </div>
            <div class="modal-field">
                <label>COTEC</label>
                <span>${item.cotec || '-'}</span>
            </div>
            <div class="modal-field">
                <label>Destino</label>
                <span>${item.destino || '-'}</span>
            </div>
            <div class="modal-field">
                <label>Origem</label>
                <span>${item.origem || '-'}</span>
            </div>
            <div class="modal-field">
                <label>Data de Ida</label>
                <span>${item.data_ida_formatada || item.data_ida || '-'}</span>
            </div>
            <div class="modal-field">
                <label>Data de Volta</label>
                <span>${item.data_volta_formatada || item.data_volta || '-'}</span>
            </div>
            <div class="modal-field">
                <label>Horário de Saída</label>
                <span>${item.horario_saida || '-'}</span>
            </div>
            <div class="modal-field">
                <label>Horário de Retorno</label>
                <span>${item.horario_retorno || '-'}</span>
            </div>
            <div class="modal-field">
                <label>Meio de Transporte</label>
                <span>${item.meio_transporte || '-'}</span>
            </div>
            <div class="modal-field">
                <label>Placa do Veículo</label>
                <span>${item.placa_veiculo || '-'}</span>
            </div>
            <div class="modal-field">
                <label>Hospedagem</label>
                <span>${item.hospedagem || '-'}</span>
            </div>
            <div class="modal-field">
                <label>Contato de Emergência</label>
                <span>${item.contato_emergencia || '-'}</span>
            </div>
            <div class="modal-field">
                <label>Quantidade de Dias</label>
                <span class="dias-destaque">${item.quantidade_dias || 1} dia(s)</span>
            </div>
            <div class="modal-field">
                <label>Valor da Diária</label>
                <span>${item.valor_diaria_formatado || 'R$ 230,00'}</span>
            </div>
            <div class="modal-field">
                <label>Total das Diárias</label>
                <span class="valor-destaque">${item.valor_total_diarias_formatado || '-'}</span>
            </div>
            <div class="modal-field">
                <label>Outros Custos</label>
                <span>${item.valor_outros_formatado || 'R$ 0,00'}</span>
            </div>
            <div class="modal-field">
                <label>Valor Total</label>
                <span class="valor-total-destaque">${item.valor_total_formatado || '-'}</span>
            </div>
            <div class="modal-field full-width">
                <label>Motivo/Objetivo</label>
                <span>${item.motivo || '-'}</span>
            </div>
            <div class="modal-field full-width">
                <label>Observações</label>
                <span>${item.obs || '-'}</span>
            </div>
        </div>
    `;
    
    modal.classList.add('active');
}

// Exportar viagens para Excel
function exportViagensToExcel() {
    const searchFilter = document.getElementById('viagensSearchFilter')?.value || '';
    const statusFilter = document.getElementById('viagensStatusFilter')?.value || '';
    const destinoFilter = document.getElementById('viagensDestinoFilter')?.value || '';
    
    let filteredData = viagensData.filter(item => {
        const matchSearch = !searchFilter ||
            normalizeString(item.responsavel || '').includes(normalizeString(searchFilter)) ||
            normalizeString(item.destino || '').includes(normalizeString(searchFilter)) ||
            normalizeString(item.origem || '').includes(normalizeString(searchFilter)) ||
            normalizeString(item.motivo || '').includes(normalizeString(searchFilter));
        const matchStatus = !statusFilter || item.status === statusFilter;
        const matchDestino = !destinoFilter || item.destino === destinoFilter;
        return matchSearch && matchStatus && matchDestino;
    });
    
    if (filteredData.length === 0) {
        alert('Nenhum dado para exportar com os filtros atuais.');
        return;
    }
    
    let excelContent = `
        <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
        <head>
            <meta charset="UTF-8">
            <!--[if gte mso 9]>
            <xml>
                <x:ExcelWorkbook>
                    <x:ExcelWorksheets>
                        <x:ExcelWorksheet>
                            <x:Name>Escala de Viagens</x:Name>
                            <x:WorksheetOptions>
                                <x:DisplayGridlines/>
                            </x:WorksheetOptions>
                        </x:ExcelWorksheet>
                    </x:ExcelWorksheets>
                </x:ExcelWorkbook>
            </xml>
            <![endif]-->
            <style>
                table { border-collapse: collapse; }
                th, td { border: 1px solid #000; padding: 8px; text-align: left; }
                th { background-color: #57bd9e; color: white; font-weight: bold; }
            </style>
        </head>
        <body>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Responsável</th>
                        <th>Destino</th>
                        <th>Origem</th>
                        <th>Data Ida</th>
                        <th>Data Volta</th>
                        <th>Dias</th>
                        <th>Horário Saída</th>
                        <th>Horário Retorno</th>
                        <th>Motivo</th>
                        <th>COTEC</th>
                        <th>Transporte</th>
                        <th>Placa</th>
                        <th>Hospedagem</th>
                        <th>Contato Emergência</th>
                        <th>Valor Diária</th>
                        <th>Total Diárias</th>
                        <th>Outros Custos</th>
                        <th>Valor Total</th>
                        <th>Status</th>
                        <th>Observações</th>
                    </tr>
                </thead>
                <tbody>
    `;
    
    filteredData.forEach((item, index) => {
        const statusText = item.status === 'CONCLUIDA' ? 'Concluída' : 
                          item.status === 'CANCELADA' ? 'Cancelada' : 
                          item.status === 'EM_ANDAMENTO' ? 'Em Andamento' : 'Agendada';
        excelContent += `
            <tr>
                <td>${index + 1}</td>
                <td>${item.responsavel || ''}</td>
                <td>${item.destino || ''}</td>
                <td>${item.origem || ''}</td>
                <td>${item.data_ida_formatada || item.data_ida || ''}</td>
                <td>${item.data_volta_formatada || item.data_volta || ''}</td>
                <td>${item.quantidade_dias || 1}</td>
                <td>${item.horario_saida || ''}</td>
                <td>${item.horario_retorno || ''}</td>
                <td>${item.motivo || ''}</td>
                <td>${item.cotec || ''}</td>
                <td>${item.meio_transporte || ''}</td>
                <td>${item.placa_veiculo || ''}</td>
                <td>${item.hospedagem || ''}</td>
                <td>${item.contato_emergencia || ''}</td>
                <td>${item.valor_diaria_formatado || 'R$ 230,00'}</td>
                <td>${item.valor_total_diarias_formatado || ''}</td>
                <td>${item.valor_outros_formatado || 'R$ 0,00'}</td>
                <td>${item.valor_total_formatado || ''}</td>
                <td>${statusText}</td>
                <td>${item.obs || ''}</td>
            </tr>
        `;
    });
    
    excelContent += `
                </tbody>
            </table>
        </body>
        </html>
    `;
    
    const blob = new Blob([excelContent], { type: 'application/vnd.ms-excel;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `escala_viagens_${new Date().toISOString().split('T')[0]}.xls`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

// =============================================
// CUSTOM DROPDOWN - SEMPRE ABRE PARA BAIXO
// =============================================

function initCustomDropdowns() {
    // Seleciona todos os selects com classe filter-select
    const selects = document.querySelectorAll('select.filter-select');
    
    selects.forEach(select => {
        // Verifica se já foi convertido
        if (select.classList.contains('hidden-select')) return;
        
        // Cria o container do dropdown customizado
        const dropdown = document.createElement('div');
        dropdown.className = 'custom-dropdown';
        
        // Cria o botão toggle
        const toggle = document.createElement('button');
        toggle.type = 'button';
        toggle.className = 'custom-dropdown-toggle';
        toggle.textContent = select.options[select.selectedIndex]?.text || 'Selecione...';
        
        // Cria o menu
        const menu = document.createElement('div');
        menu.className = 'custom-dropdown-menu';
        
        // Função para atualizar as opções do menu
        function updateMenuOptions() {
            menu.innerHTML = '';
            Array.from(select.options).forEach((option, index) => {
                const item = document.createElement('div');
                item.className = 'custom-dropdown-item';
                if (index === select.selectedIndex) {
                    item.classList.add('selected');
                }
                item.textContent = option.text;
                item.dataset.value = option.value;
                item.dataset.index = index;
                
                item.addEventListener('click', (e) => {
                    e.stopPropagation();
                    // Atualiza o select original
                    select.selectedIndex = index;
                    select.value = option.value;
                    // Dispara evento de change
                    select.dispatchEvent(new Event('change', { bubbles: true }));
                    // Atualiza o texto do toggle
                    toggle.textContent = option.text;
                    // Remove seleção anterior
                    menu.querySelectorAll('.custom-dropdown-item').forEach(i => i.classList.remove('selected'));
                    // Marca como selecionado
                    item.classList.add('selected');
                    // Fecha o dropdown
                    dropdown.classList.remove('open');
                });
                
                menu.appendChild(item);
            });
        }
        
        // Inicializa as opções
        updateMenuOptions();
        
        // Observa mudanças no select original (quando as opções são adicionadas dinamicamente)
        const observer = new MutationObserver(() => {
            updateMenuOptions();
            toggle.textContent = select.options[select.selectedIndex]?.text || 'Selecione...';
        });
        observer.observe(select, { childList: true, subtree: true });
        
        // Evento de clique no toggle
        toggle.addEventListener('click', (e) => {
            e.stopPropagation();
            // Fecha outros dropdowns abertos
            document.querySelectorAll('.custom-dropdown.open').forEach(d => {
                if (d !== dropdown) d.classList.remove('open');
            });
            // Toggle do dropdown atual
            dropdown.classList.toggle('open');
        });
        
        // Monta o dropdown
        dropdown.appendChild(toggle);
        dropdown.appendChild(menu);
        
        // Insere o dropdown após o select original
        select.parentNode.insertBefore(dropdown, select.nextSibling);
        
        // Esconde o select original
        select.classList.add('hidden-select');
    });
    
    // Fecha dropdowns ao clicar fora
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.custom-dropdown')) {
            document.querySelectorAll('.custom-dropdown.open').forEach(d => {
                d.classList.remove('open');
            });
        }
    });
    
    // Fecha dropdowns ao pressionar Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            document.querySelectorAll('.custom-dropdown.open').forEach(d => {
                d.classList.remove('open');
            });
        }
    });
}

// Reinicializa dropdowns quando novas opções forem carregadas
function refreshCustomDropdowns() {
    document.querySelectorAll('.custom-dropdown').forEach(dropdown => {
        const select = dropdown.previousElementSibling;
        if (select && select.tagName === 'SELECT') {
            const toggle = dropdown.querySelector('.custom-dropdown-toggle');
            const menu = dropdown.querySelector('.custom-dropdown-menu');
            
            // Atualiza o texto do toggle
            toggle.textContent = select.options[select.selectedIndex]?.text || 'Selecione...';
            
            // Atualiza as opções do menu
            menu.innerHTML = '';
            Array.from(select.options).forEach((option, index) => {
                const item = document.createElement('div');
                item.className = 'custom-dropdown-item';
                if (index === select.selectedIndex) {
                    item.classList.add('selected');
                }
                item.textContent = option.text;
                item.dataset.value = option.value;
                item.dataset.index = index;
                
                item.addEventListener('click', (e) => {
                    e.stopPropagation();
                    select.selectedIndex = index;
                    select.value = option.value;
                    select.dispatchEvent(new Event('change', { bubbles: true }));
                    toggle.textContent = option.text;
                    menu.querySelectorAll('.custom-dropdown-item').forEach(i => i.classList.remove('selected'));
                    item.classList.add('selected');
                    dropdown.classList.remove('open');
                });
                
                menu.appendChild(item);
            });
        }
    });
}
