(() => {
    'use strict';

    const ADMIN_API_URL = 'api/dados.php';

    const ENTITY_CONFIG = {
        ti: {
            label: 'Equipe de TI',
            fields: [
                { name: 'nome', label: 'Nome', type: 'text', required: true, full: true },
                { name: 'cotec', label: 'Setor', type: 'text', required: true, full: true },
                { name: 'cidade', label: 'Cidade', type: 'text', required: true },
                { name: 'telefone', label: 'Telefone', type: 'text' },
                { name: 'horario', label: 'Horário', type: 'textarea', full: true }
            ]
        },
        impressoras: {
            label: 'Impressoras',
            fields: [
                { name: 'cotec', label: 'Setor', type: 'text', required: true, full: true },
                { name: 'cidade', label: 'Cidade', type: 'text', required: true },
                { name: 'monocromatica', label: 'Monocromática', type: 'number' },
                { name: 'policromatica', label: 'Policromática', type: 'number' },
                {
                    name: 'funcionando',
                    label: 'Status',
                    type: 'select',
                    options: [
                        { value: 'SIM', label: 'SIM' },
                        { value: 'NÃO', label: 'NÃO' }
                    ]
                },
                { name: 'obs', label: 'Observações', type: 'textarea', full: true }
            ]
        },
        internet: {
            label: 'Internet',
            fields: [
                { name: 'cotec', label: 'Setor', type: 'text', required: true, full: true },
                { name: 'cidade', label: 'Cidade', type: 'text', required: true },
                { name: 'velocidadeLink', label: 'Velocidade do Link', type: 'text', dbName: 'velocidade_link' },
                { name: 'operadora', label: 'Operadora', type: 'text' },
                { name: 'speedtest', label: 'SpeedTest', type: 'text', full: true },
                { name: 'obs', label: 'Observações', type: 'textarea', full: true }
            ]
        },
        equipamentos: {
            label: 'Equipamentos',
            fields: [
                { name: 'cotec', label: 'Setor', type: 'text', required: true, full: true },
                { name: 'cidade', label: 'Cidade', type: 'text', required: true },
                { name: 'equipamentos', label: 'Equipamentos', type: 'textarea', full: true },
                { name: 'unifi', label: 'UniFi', type: 'text' }
            ]
        },
        emails: {
            label: 'Emails Corporativos',
            fields: [
                { name: 'nome', label: 'Nome', type: 'text', required: true, full: true },
                { name: 'cpf', label: 'CPF', type: 'text' },
                { name: 'emailPessoal', label: 'Email Pessoal', type: 'text', dbName: 'email_pessoal' },
                { name: 'emailCorporativo', label: 'Email Corporativo', type: 'text', required: true, dbName: 'email_corporativo' },
                {
                    name: 'status',
                    label: 'Status',
                    type: 'select',
                    options: [
                        { value: 'criado', label: 'Criado' },
                        { value: 'Solicitado', label: 'Solicitado' }
                    ]
                }
            ]
        },
        vigencias: {
            label: 'Vigências Internets',
            fields: [
                { name: 'fornecedorContrato', label: 'Fornecedor/Contrato', type: 'text', required: true, full: true, dbName: 'fornecedor_contrato' },
                { name: 'tiCotec', label: 'TI Responsável', type: 'text', dbName: 'ti_cotec' },
                { name: 'contatoResponsavel', label: 'Contato do Responsável', type: 'text', dbName: 'contato_responsavel' },
                { name: 'vigencia', label: 'Vigência', type: 'text' },
                { name: 'endereco', label: 'Endereço', type: 'textarea', full: true },
                { name: 'planoContratado', label: 'Plano Contratado', type: 'text', dbName: 'plano_contratado' },
                { name: 'cidade', label: 'Cidade', type: 'text', required: true },
                { name: 'cotec', label: 'Setor', type: 'text' },
                { name: 'contato', label: 'Contato', type: 'text' },
                { name: 'valorMensal', label: 'Valor Mensal (R$)', type: 'number', dbName: 'valor_mensal' },
                { name: 'obs', label: 'Observações', type: 'textarea', full: true },
                {
                    name: 'contratoOk',
                    label: 'Contrato Tudo Certo?',
                    type: 'select',
                    dbName: 'contrato_ok',
                    options: [
                        { value: 'SIM', label: 'SIM - Contrato OK' },
                        { value: 'NÃO', label: 'NÃO - Com Problema' },
                        { value: 'PENDENTE', label: 'PENDENTE - Aguardando' }
                    ]
                }
            ]
        },
        viagens: {
            label: 'Escala de Viagens',
            fields: [
                { name: 'responsavel', label: 'Responsável', type: 'text', required: true, full: true },
                { name: 'destino', label: 'Destino (Cidade/Local)', type: 'text', required: true },
                { name: 'origem', label: 'Origem (Cidade/Local)', type: 'text' },
                { name: 'data_ida', label: 'Data de Ida', type: 'date', dbName: 'data_ida' },
                { name: 'data_volta', label: 'Data de Volta', type: 'date', dbName: 'data_volta' },
                { name: 'horario_saida', label: 'Horário de Saída', type: 'text', dbName: 'horario_saida' },
                { name: 'horario_retorno', label: 'Horário de Retorno', type: 'text', dbName: 'horario_retorno' },
                { name: 'motivo', label: 'Motivo/Objetivo da Viagem', type: 'textarea', full: true },
                { name: 'cotec', label: 'Setor Relacionado', type: 'text' },
                { name: 'meio_transporte', label: 'Meio de Transporte', type: 'text', dbName: 'meio_transporte' },
                { name: 'placa_veiculo', label: 'Placa do Veículo', type: 'text', dbName: 'placa_veiculo' },
                { name: 'hospedagem', label: 'Local de Hospedagem', type: 'text' },
                { name: 'contato_emergencia', label: 'Contato de Emergência', type: 'text', dbName: 'contato_emergencia' },
                { name: 'valor_diaria', label: 'Valor da Diária (R$)', type: 'number', dbName: 'valor_diaria' },
                { name: 'valor_outros', label: 'Outros Custos (R$)', type: 'number', dbName: 'valor_outros' },
                {
                    name: 'status',
                    label: 'Status da Viagem',
                    type: 'select',
                    options: [
                        { value: 'AGENDADA', label: 'Agendada' },
                        { value: 'EM_ANDAMENTO', label: 'Em Andamento' },
                        { value: 'CONCLUIDA', label: 'Concluída' },
                        { value: 'CANCELADA', label: 'Cancelada' }
                    ]
                },
                { name: 'obs', label: 'Observações', type: 'textarea', full: true }
            ]
        }
    };

    function getEntityConfig(entity) {
        return ENTITY_CONFIG[String(entity || '')] || null;
    }

    function toast(message, kind = 'info') {
        const el = document.createElement('div');
        el.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: ${kind === 'error' ? '#e53935' : kind === 'success' ? '#2e7d32' : '#333'};
            color: #fff;
            padding: 12px 14px;
            border-radius: 10px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.25);
            z-index: 10003;
            max-width: min(420px, 92vw);
            font-weight: 600;
        `;
        el.textContent = message;
        document.body.appendChild(el);
        setTimeout(() => el.remove(), 3200);
    }

    async function apiRequest(payload) {
        // Adicionar user_id do usuário logado para validação de permissão
        const userData = localStorage.getItem('sgdti_user');
        if (userData) {
            try {
                const user = JSON.parse(userData);
                if (user && user.id) {
                    payload.user_id = user.id;
                }
            } catch (e) {
                console.warn('Erro ao obter user_id do localStorage', e);
            }
        }
        
        const response = await fetch(ADMIN_API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const contentType = response.headers.get('content-type') || '';
        let json;
        try {
            // Alguns servidores devolvem HTML (404/500). Isso quebra o .json().
            if (!contentType.toLowerCase().includes('application/json')) {
                const text = await response.text();
                const preview = String(text || '').replace(/\s+/g, ' ').trim().slice(0, 220);
                throw new Error(`Servidor não retornou JSON (HTTP ${response.status}). ${preview ? 'Resposta: ' + preview : ''}`);
            }

            json = await response.json();
        } catch (e) {
            // Mantém mensagem detalhada quando disponível
            throw new Error(e?.message || 'Resposta inválida do servidor (não-JSON).');
        }

        if (!response.ok || !json?.success) {
            const msg = json?.error || `Erro HTTP ${response.status}`;
            throw new Error(msg);
        }

        return json;
    }

    async function reloadAndRender() {
        if (typeof window.loadDataFromDatabase === 'function') {
            await window.loadDataFromDatabase();
        }
        if (typeof window.renderCurrentTab === 'function') {
            window.renderCurrentTab();
        }
    }

    function ensureCrudModal() {
        if (document.getElementById('crudModal')) return;

        const modal = document.createElement('div');
        modal.id = 'crudModal';
        modal.innerHTML = `
            <div class="crud-modal-content" role="dialog" aria-modal="true" aria-label="Editar" >
                <div class="crud-modal-header">
                    <div class="crud-modal-title" id="crudModalTitle"></div>
                    <button class="crud-modal-close" type="button" aria-label="Fechar">&times;</button>
                </div>
                <div id="crudModalBody"></div>
                <div class="crud-modal-footer" id="crudModalFooter"></div>
            </div>
        `;

        modal.querySelector('.crud-modal-close')?.addEventListener('click', () => {
            modal.classList.remove('show');
        });

        document.body.appendChild(modal);
    }

    // Mapeamento de entidade para variável de dados global
    function getEntityData(entity) {
        const dataMap = {
            ti: () => typeof tiData !== 'undefined' ? tiData : [],
            impressoras: () => typeof impressorasData !== 'undefined' ? impressorasData : [],
            internet: () => typeof internetData !== 'undefined' ? internetData : [],
            equipamentos: () => typeof equipamentosData !== 'undefined' ? equipamentosData : [],
            emails: () => typeof emailsData !== 'undefined' ? emailsData : [],
            vigencias: () => typeof vigenciasData !== 'undefined' ? vigenciasData : [],
            viagens: () => typeof viagensData !== 'undefined' ? viagensData : []
        };
        return dataMap[entity] ? dataMap[entity]() : [];
    }

    // Função para extrair valores únicos de um campo
    function getUniqueFieldValues(entity, fieldName, dbName) {
        const data = getEntityData(entity);
        const values = new Set();
        data.forEach(item => {
            // Tenta o nome do campo e também o dbName (nome no banco)
            const val = item[fieldName] || item[dbName] || '';
            if (val && String(val).trim()) {
                values.add(String(val).trim());
            }
        });
        return Array.from(values).sort((a, b) => a.localeCompare(b, 'pt-BR'));
    }

    // Gera o HTML do datalist com opções únicas
    function buildDatalist(entity, field) {
        const values = getUniqueFieldValues(entity, field.name, field.dbName);
        if (values.length === 0) return { datalistId: '', datalistHtml: '' };
        
        const datalistId = `datalist_${entity}_${field.name}`;
        const options = values.map(v => `<option value="${String(v).replace(/"/g, '&quot;')}">`).join('');
        return {
            datalistId,
            datalistHtml: `<datalist id="${datalistId}">${options}</datalist>`
        };
    }

    function buildForm(entity, mode, item) {
        const cfg = getEntityConfig(entity);
        if (!cfg) {
            return { html: '<div style="padding:12px;">CRUD não configurado para esta aba.</div>', footer: '' };
        }

        const title = `${mode === 'edit' ? '✏️ Editar' : '➕ Adicionar'} — ${cfg.label}`;
        let datalistsHtml = '';

        const fieldsHtml = cfg.fields.map((field) => {
            const value = item?.[field.name] ?? '';
            const required = field.required ? 'required' : '';
            const colSpan = field.full ? 'style="grid-column: 1 / -1;"' : '';

            if (field.type === 'textarea') {
                return `
                    <div class="crud-field" ${colSpan}>
                        <label for="crud_${field.name}">${field.label}</label>
                        <textarea id="crud_${field.name}" name="${field.name}" ${required} spellcheck="true" lang="pt-BR">${String(value ?? '')}</textarea>
                    </div>
                `;
            }

            if (field.type === 'select') {
                const options = (field.options || []).map((opt) => {
                    const selected = String(opt.value) === String(value) ? 'selected' : '';
                    return `<option value="${String(opt.value)}" ${selected}>${String(opt.label)}</option>`;
                }).join('');

                return `
                    <div class="crud-field" ${colSpan}>
                        <label for="crud_${field.name}">${field.label}</label>
                        <select id="crud_${field.name}" name="${field.name}" ${required}>
                            ${options}
                        </select>
                    </div>
                `;
            }

            const inputType = field.type === 'number' ? 'number' : field.type === 'date' ? 'date' : 'text';
            const safeValue = String(value ?? '').replace(/"/g, '&quot;');
            const spellcheckAttr = inputType === 'text' ? 'spellcheck="true" lang="pt-BR"' : '';
            
            // Adiciona datalist para campos de texto
            let datalistAttr = '';
            if (inputType === 'text') {
                const { datalistId, datalistHtml } = buildDatalist(entity, field);
                if (datalistId) {
                    datalistAttr = `list="${datalistId}"`;
                    datalistsHtml += datalistHtml;
                }
            }
            
            return `
                <div class="crud-field" ${colSpan}>
                    <label for="crud_${field.name}">${field.label}</label>
                    <input id="crud_${field.name}" name="${field.name}" type="${inputType}" value="${safeValue}" ${required} ${spellcheckAttr} ${datalistAttr} />
                </div>
            `;
        }).join('');

        const formClass = cfg.fields.some(f => f.full) ? 'crud-form' : 'crud-form';

        const html = `
            <form id="crudForm" class="${formClass}">
                ${fieldsHtml}
            </form>
            ${datalistsHtml}
        `;

        const footer = `
            <button type="button" class="crud-btn crud-btn-secondary" id="crudCancelBtn">Cancelar</button>
            <button type="button" class="crud-btn crud-btn-primary" id="crudSaveBtn">Salvar</button>
        `;

        return { title, html, footer };
    }

    window.openCrudModal = (entity, mode, item) => {
        ensureCrudModal();

        const modal = document.getElementById('crudModal');
        const titleEl = document.getElementById('crudModalTitle');
        const bodyEl = document.getElementById('crudModalBody');
        const footerEl = document.getElementById('crudModalFooter');

        const { title, html, footer } = buildForm(entity, mode, item);
        if (titleEl) titleEl.textContent = title || 'Editar';
        if (bodyEl) bodyEl.innerHTML = html;
        if (footerEl) footerEl.innerHTML = footer;

        modal?.classList.add('show');

        document.getElementById('crudCancelBtn')?.addEventListener('click', () => {
            modal?.classList.remove('show');
        });

        document.getElementById('crudSaveBtn')?.addEventListener('click', async () => {
            try {
                const form = document.getElementById('crudForm');
                if (!form) return;

                if (typeof form.reportValidity === 'function' && !form.reportValidity()) {
                    return;
                }

                const formData = Object.fromEntries(new FormData(form).entries());

                // Mapear campos do formulário para nomes do banco de dados
                const cfg = getEntityConfig(entity);
                const data = {};
                if (cfg) {
                    cfg.fields.forEach(field => {
                        const formValue = formData[field.name];
                        if (formValue !== undefined) {
                            // Usa dbName se definido, senão usa o name original
                            const dbFieldName = field.dbName || field.name;
                            data[dbFieldName] = formValue;
                        }
                    });
                }

                // Normalizações
                Object.keys(data).forEach((k) => {
                    if (data[k] === '') return;
                    if (k === 'monocromatica' || k === 'policromatica') {
                        const n = Number(data[k]);
                        data[k] = Number.isFinite(n) ? n : 0;
                    }
                });

                const payload = mode === 'edit'
                    ? { action: 'update', entity, id: item?.id, data }
                    : { action: 'create', entity, data };

                await apiRequest(payload);
                toast('Salvo com sucesso.', 'success');
                modal?.classList.remove('show');
                await reloadAndRender();
            } catch (e) {
                toast(e?.message || 'Erro ao salvar.', 'error');
                console.error(e);
            }
        });
    };

    window.crudDelete = async (entity, id) => {
        const safeId = Number(id);
        if (!Number.isFinite(safeId) || safeId <= 0) {
            toast('ID inválido.', 'error');
            return;
        }

        const cfg = getEntityConfig(entity);
        const label = cfg?.label || String(entity);

        if (!confirm(`Confirma excluir este registro de ${label}?`)) return;

        try {
            await apiRequest({ action: 'delete', entity, id: safeId });
            toast('Excluído com sucesso.', 'success');
            await reloadAndRender();
        } catch (e) {
            toast(e?.message || 'Erro ao excluir.', 'error');
            console.error(e);
        }
    };

    window.addCrudButtons = (tab) => {
        const cfg = getEntityConfig(tab);
        if (!cfg) return;

        const tabEl = document.getElementById(tab);
        if (!tabEl) return;

        const header = tabEl.querySelector('.page-header');
        if (!header) return;

        if (header.querySelector('[data-crud-toolbar="1"]')) return;

        const toolbar = document.createElement('div');
        toolbar.className = 'crud-toolbar';
        toolbar.setAttribute('data-crud-toolbar', '1');

        const btn = document.createElement('button');
        btn.className = 'crud-btn crud-btn-primary';
        btn.type = 'button';
        btn.textContent = '➕ Adicionar';
        btn.addEventListener('click', () => window.openCrudModal?.(tab, 'create', null));

        toolbar.appendChild(btn);
        header.appendChild(toolbar);
    };

    window.addItemCrudButtons = (item, tab) => {
        const cfg = getEntityConfig(tab);
        if (!cfg) return '';

        const id = item?.id;
        if (id == null) return '';

        return `
            <div class="crud-actions">
                <button class="crud-btn crud-btn-secondary" type="button" onclick='openCrudModal("${String(tab)}", "edit", ${JSON.stringify(item)})'>✏️ Editar</button>
                <button class="crud-btn crud-btn-danger" type="button" onclick='crudDelete("${String(tab)}", ${Number(id)})'>🗑️ Excluir</button>
            </div>
        `;
    };
})();
