/* home.js */

// Espera o site carregar completamente antes de rodar o código
import { supabase } from '../../conn/SupabaseAPIconn.js';
import { initSiteAuth } from '../common/auth.js';
// NOVO IMPORT
import { setupLiveSearch } from '././Content/dropdown.js';

console.log('[home.js] Carregado!');

// --- 1. SELEÇÃO DE ELEMENTOS ---
const el = id => document.getElementById(id);

const elements = {
    // Stats e Listas
    recentList: el('recentList'),
    recommendedList: el('recommendedList'),
    statDecks: document.querySelector('.stat-card:nth-child(1) h3'),
    statCards: document.querySelector('.stat-card:nth-child(2) h3'),
    
    // Sidebar
    sidebar: el('sidebar'),
    overlay: el('sidebarOverlay'),
    sidebarToggle: el('sidebarToggle'),
    closeSidebar: el('closeSidebar'),
    
    // Pesquisa e Filtros
    searchInput: el('searchInput'),
    searchBtn: el('searchActionBtn'),
    filterToggle: el('filterToggle'),
    filterDropdown: el('filterDropdown'),
    filterAll: el('filterAll'),
    filterOpts: document.querySelectorAll('.filter-opt')
};

// --- 2. INICIALIZAÇÃO (Ao carregar a página) ---
document.addEventListener('DOMContentLoaded', async () => {
    console.log('[home.js] DOM Pronto. Iniciando...');
    
    // A. Autenticação
    const user = await initSiteAuth({ loginPath: '../HTML/Register/Login.html' });
    const logoutBtn = document.getElementById('logoutBtn');
    // B. Inicializar Eventos de UI (Sidebar e Filtros) - AQUI ESTAVA A FALTA
    initUIEvents();

    // C. Carregar Dados do Utilizador
    if (user) {
        loadUserStats(user.id);
        loadRecentlyViewed();
        loadRecommended(user.id);
    }

    // D. Ativar a Pesquisa ao Vivo (Dropdown)
    if (elements.searchInput) {
        setupLiveSearch(elements.searchInput, elements.filterOpts, elements.filterAll);
    } else {
        console.error('[home.js] ERRO: Input #searchInput não encontrado.');
    }
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault(); // Impede o link de navegar
            signOut();
        });
    }
});

// --- 3. FUNÇÕES DE INTERFACE (A QUE FALTAVA) ---
function initUIEvents() {
    console.log("[home.js] Inicializando eventos de UI...");

    // --- Lógica da Sidebar ---
    const toggleSidebar = (show) => {
        if(show) { 
            elements.sidebar?.classList.add('active'); 
            elements.overlay?.classList.add('active'); 
        } else { 
            elements.sidebar?.classList.remove('active'); 
            elements.overlay?.classList.remove('active'); 
        }
    };

    if (elements.sidebarToggle) elements.sidebarToggle.addEventListener('click', () => toggleSidebar(true));
    if (elements.closeSidebar) elements.closeSidebar.addEventListener('click', () => toggleSidebar(false));
    if (elements.overlay) elements.overlay.addEventListener('click', () => toggleSidebar(false));

    // --- Lógica do Botão Filters ---
    const { filterToggle, filterDropdown } = elements;

    if (filterToggle && filterDropdown) {
        // Clique no botão "Filters"
        filterToggle.addEventListener('click', (e) => {
            e.stopPropagation(); // Impede que o clique feche o menu imediatamente
            filterDropdown.classList.toggle('show'); // Adiciona/Remove a classe que mostra o menu
            console.log("[home.js] Toggle Filtros. Estado:", filterDropdown.classList.contains('show'));
        });

        // Fechar se clicar fora
        document.addEventListener('click', (e) => {
            if (!filterToggle.contains(e.target) && !filterDropdown.contains(e.target)) {
                filterDropdown.classList.remove('show');
            }
        });
    } else {
        console.warn("[home.js] Botão de filtros não encontrado no HTML.");
    }

    // --- Lógica dos Checkboxes (All vs Outros) ---
    if (elements.filterAll && elements.filterOpts) {
        // Se clicar em "All", desmarca os outros
        elements.filterAll.addEventListener('change', () => {
            if (elements.filterAll.checked) {
                elements.filterOpts.forEach(o => o.checked = false);
            }
        });

        // Se clicar nos outros, desmarca "All"
        elements.filterOpts.forEach(opt => {
            opt.addEventListener('change', () => {
                if (opt.checked) elements.filterAll.checked = false;
                
                // Se nenhum estiver marcado, volta a marcar "All"
                const anyChecked = Array.from(elements.filterOpts).some(o => o.checked);
                if (!anyChecked) elements.filterAll.checked = true;
            });
        });
    }
}

async function signOut() {
    // 1. Invoca a função signOut do Supabase. Por padrão, termina todas as sessões.
    const { error } = await supabase.auth.signOut();

    if (error) {
        console.error("Erro ao deslogar:", error.message);
        alert("Erro ao fazer logout.");
    } else {
        console.log("Usuário deslogado com sucesso.");
        // Opcional: Redirecionar para a página de login ou home
        window.location.href = '../HTML/Register/Login.html';
    }
}

// --- 4. FUNÇÕES DE DADOS (Supabase) ---

async function loadUserStats(userId) {
    try {
        const { count: d } = await supabase.from('decks').select('*', { count: 'exact', head: true }).eq('user_id', userId);
        const { count: c } = await supabase.from('flashcards').select('*', { count: 'exact', head: true }).eq('user_id', userId);
        if(elements.statDecks) elements.statDecks.textContent = d || 0;
        if(elements.statCards) elements.statCards.textContent = c || 0;
    } catch (e) { console.error(e); }
}

async function loadRecentlyViewed() {
    const lastId = localStorage.getItem('glider_last_deck_id');
    if (!lastId || !elements.recentList) return;
    
    const { data } = await supabase.from('decks').select('*').eq('id', lastId).single();
    if (data) {
        elements.recentList.innerHTML = '';
        elements.recentList.appendChild(createDeckCard(data));
    }
}

async function loadRecommended(userId) {
    if (!elements.recommendedList) return;
    const tag = localStorage.getItem('glider_last_tag');
    
    let q = supabase.from('decks').select('*').eq('is_public', true).neq('user_id', userId);
    if (tag) q = q.contains('tags', [tag]);
    else q = q.order('created_at', { ascending: false });
    
    const { data } = await q.limit(8); // Pediste 8 decks
    
    if (data && data.length > 0) {
        elements.recommendedList.innerHTML = '';
        data.forEach(d => elements.recommendedList.appendChild(createDeckCard(d)));
    } else {
        elements.recommendedList.innerHTML = '<p style="opacity:0.6; padding:10px;">Explore to see recommendations.</p>';
    }
}

// --- 5. CRIAR CARTÃO (HTML) ---
function createDeckCard(deck) {
    const div = document.createElement('div');
    div.className = 'deck-card';
    
    const bg = deck.thumbnail_url 
        ? `url('${deck.thumbnail_url}')` 
        : 'linear-gradient(135deg, #667eea, #764ba2)';
        
    div.innerHTML = `
        <div class="deck-thumb" style="background-image: ${bg}"></div>
        <div class="deck-info">
            <h4>${deck.name}</h4>
            <p>${deck.description || ''}</p>
        </div>
    `;
    
    div.addEventListener('click', () => {
        // Salvar histórico
        localStorage.setItem('glider_last_deck_id', deck.id);
        if(deck.tags?.[0]) localStorage.setItem('glider_last_tag', deck.tags[0]);
        
        // Redirecionar
        window.location.href = `./Content/deck.html?id=${deck.id}`;
    });
    
    return div;
}