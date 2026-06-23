function mudarTela(nomeTela) {
    const telas = document.querySelectorAll('.tela');
    telas.forEach(tela => {
        tela.classList.remove('ativa');
    });
    const telaSelecionada = document.getElementById(nomeTela);
    telaSelecionada.classList.add('ativa');
}

function salvarVenda(event) {
    event.preventDefault();

    const produto = document.getElementById('produto').value;
    const valor = parseFloat(document.getElementById('valorVendas').value);
    const pagamento = document.getElementById('pagamento').value;

    let vendas = localStorage.getItem('vendas');
    if (vendas) {
        vendas = JSON.parse(vendas);
    } else {
        vendas = [];
    }

    vendas.push({ produto, valor, pagamento, data: new Date().toISOString('pt-BR') });
    localStorage.setItem('vendas', JSON.stringify(vendas));

    alert('Venda salva com sucesso!');
    document.getElementById('formVenda').reset();
}
function salvarDespesa(event) {
    event.preventDefault();
    const despesa = document.getElementById('Despesa').value;
    const valor = parseFloat(document.getElementById('valorDespesas').value);
    let despesas = localStorage.getItem('despesas');
    if (despesas) {
        despesas = JSON.parse(despesas);
    } else {
        despesas = [];
    }
    despesas.push({ despesa, valor, data: new Date().toISOString('pt-BR') });
    localStorage.setItem('despesas', JSON.stringify(despesas));
    alert('Despesa salva com sucesso!');
    document.getElementById('formDespesa').reset();
}
function carregarHistorico() {

    const vendas = JSON.parse(localStorage.getItem('vendas') || '[]');
    const despesas = JSON.parse(localStorage.getItem('despesas') || '[]');
    const comandas = JSON.parse(localStorage.getItem('comandas') || '[]');

    const lista = document.getElementById('listaHistorico');
    lista.innerHTML = '';

    vendas.forEach(venda => {
        lista.innerHTML += `
            <div class="item-historico venda">
                🟢 Venda - ${venda.produto} - R$ ${venda.valor} - ${new Date(venda.data).toLocaleDateString('pt-BR')}
            </div>
        `;
    });

    despesas.forEach(despesa => {
        lista.innerHTML += `
            <div class="item-historico despesa">
                🔴 Despesa - ${despesa.despesa} - R$ ${despesa.valor} - ${new Date(despesa.data).toLocaleDateString('pt-BR')}
            </div>
        `;
    });

    comandas.forEach(comanda => {
        const itensLista = comanda.itens.map(i => `• ${i.item}`).join('<br>');
        lista.innerHTML += `
            <div class="item-historico comanda">
                🧾 Comanda - ${comanda.cliente}<br>
                Pagamento: ${comanda.pagamento}<br>
                Total: R$ ${comanda.total.toFixed(2)}<br>
                <small>${itensLista}</small><br>
                <small>${comanda.data}</small>
            </div>
        `;
    });
}
let itensComanda = [];
function adicionarItemComanda() {

    const item = document.getElementById('itemComanda').value;
    const valor = parseFloat(document.getElementById('valorComanda').value);

    if (!item || !valor) {
        alert('Preencha item e valor');
        return;
    }

    itensComanda.push({
        item,
        valor
    });

    atualizarComanda();

    document.getElementById('itemComanda').value = '';
    document.getElementById('valorComanda').value = '';
}
function atualizarComanda() {

    const lista = document.getElementById('listaComanda');

    lista.innerHTML = '';

    let total = 0;

    itensComanda.forEach(produto => {

        total += produto.valor;

        lista.innerHTML += `
            <div class="item-comanda">
                ${produto.item} - R$ ${produto.valor.toFixed(2)}
            </div>
        `;
    });

    document.getElementById('totalComanda').textContent =
        total.toFixed(2);
}
function fecharComanda() {

    const cliente = document.getElementById('cliente').value;
    const pagamento = document.getElementById('pagamentoComanda').value;

    if (!cliente) {
        alert('Informe o cliente');
        return;
    }

    if (itensComanda.length === 0) {
        alert('Adicione pelo menos um item');
        return;
    }

    const total = itensComanda.reduce((soma, item) => {
        return soma + item.valor;
    }, 0);

    const comandas =
        JSON.parse(localStorage.getItem('comandas')) || [];

    comandas.push({
        cliente,
        pagamento,
        total,
        itens: itensComanda,
        data: new Date().toLocaleDateString('pt-BR')
    });

    localStorage.setItem(
        'comandas',
        JSON.stringify(comandas)
    );

    alert('Comanda fechada com sucesso!');

    limparComanda();
}
function limparComanda() {

    itensComanda = [];

    document.getElementById('cliente').value = '';
    document.getElementById('itemComanda').value = '';
    document.getElementById('valorComanda').value = '';

    atualizarComanda();
}
function carregarDashboard() {

    const vendas = JSON.parse(localStorage.getItem('vendas') || '[]');
    const despesas = JSON.parse(localStorage.getItem('despesas') || '[]');
    const comandas = JSON.parse(localStorage.getItem('comandas') || '[]');

    const totalVendas = vendas.reduce((soma, v) => soma + parseFloat(v.valor), 0);
    const totalDespesas = despesas.reduce((soma, d) => soma + parseFloat(d.valor), 0);
    const lucro = totalVendas - totalDespesas;

    document.getElementById('totalVendas').textContent = `R$ ${totalVendas.toFixed(2)}`;
    document.getElementById('totalDespesas').textContent = `R$ ${totalDespesas.toFixed(2)}`;
    document.getElementById('totalLucro').textContent = `R$ ${lucro.toFixed(2)}`;
    document.getElementById('totalComandas').textContent = comandas.length;
    carregarDashboard();
}
let comandasAbertas = JSON.parse(localStorage.getItem('comandasAbertas') || '[]');
let indexComandaAtual = null;

function carregarComandasAbertas() {
    const lista = document.getElementById('listaComandas');
    lista.innerHTML = '';

    if (comandasAbertas.length === 0) {
        lista.innerHTML = '<p style="margin:20px;color:#888">Nenhuma comanda aberta</p>';
        return;
    }

    comandasAbertas.forEach((comanda, index) => {
        const total = comanda.itens.reduce((s, i) => s + i.valor, 0);
        lista.innerHTML += `
            <div class="card-comanda" onclick="abrirComanda(${index})">
                🟡 <strong>${comanda.cliente}</strong>
                <span style="float:right;color:var(--laranja)">R$ ${total.toFixed(2)}</span>
                <br><small style="color:#888">${comanda.itens.length} item(s)</small>
            </div>
        `;
    });
}

function abrirModalNovaComanda() {
    indexComandaAtual = null;
    document.getElementById('clienteModal').value = '';
    document.getElementById('clienteModal').disabled = false;
    document.getElementById('itemModal').value = '';
    document.getElementById('valorModal').value = '';
    document.getElementById('pagamentoModal').value = '';
    document.getElementById('listaItensModal').innerHTML = '';
    document.getElementById('totalModal').textContent = '0.00';
    document.getElementById('tituloModal').textContent = 'Nova Comanda';
    document.getElementById('modalComanda').style.display = 'flex';
}

function abrirComanda(index) {
    indexComandaAtual = index;
    const comanda = comandasAbertas[index];
    document.getElementById('clienteModal').value = comanda.cliente;
    document.getElementById('clienteModal').disabled = true;
    document.getElementById('itemModal').value = '';
    document.getElementById('valorModal').value = '';
    document.getElementById('pagamentoModal').value = comanda.pagamento || '';
    document.getElementById('tituloModal').textContent = `Comanda - ${comanda.cliente}`;
    document.getElementById('modalComanda').style.display = 'flex';
    atualizarItensModal(comanda.itens);
}

function adicionarItemModal() {
    const item = document.getElementById('itemModal').value;
    const valor = parseFloat(document.getElementById('valorModal').value);

    if (!item || !valor) {
        alert('Preencha item e valor');
        return;
    }

    if (indexComandaAtual === null) {
        const cliente = document.getElementById('clienteModal').value;
        if (!cliente) {
            alert('Informe o cliente');
            return;
        }
        comandasAbertas.push({ cliente, itens: [], pagamento: '' });
        indexComandaAtual = comandasAbertas.length - 1;
        document.getElementById('clienteModal').disabled = true;
    }

    comandasAbertas[indexComandaAtual].itens.push({ item, valor });
    salvarComandasAbertas();

    document.getElementById('itemModal').value = '';
    document.getElementById('valorModal').value = '';
    atualizarItensModal(comandasAbertas[indexComandaAtual].itens);
}

function atualizarItensModal(itens) {
    const lista = document.getElementById('listaItensModal');
    lista.innerHTML = '';
    let total = 0;

    itens.forEach((i, index) => {
        total += i.valor;
        lista.innerHTML += `
            <div class="item-comanda" style="display:flex;justify-content:space-between;align-items:center">
                <span>${i.item} - R$ ${i.valor.toFixed(2)}</span>
                <button onclick="removerItem(${index})" style="background:crimson;color:white;border:none;border-radius:6px;padding:4px 8px;cursor:pointer">✕</button>
            </div>
        `;
    });

    document.getElementById('totalModal').textContent = total.toFixed(2);
}

function removerItem(index) {
    comandasAbertas[indexComandaAtual].itens.splice(index, 1);
    salvarComandasAbertas();
    atualizarItensModal(comandasAbertas[indexComandaAtual].itens);
}

function salvarComanda() {
    if (indexComandaAtual !== null) {
        const pagamento = document.getElementById('pagamentoModal').value;
        comandasAbertas[indexComandaAtual].pagamento = pagamento;
        salvarComandasAbertas();
    }
    fecharModal();
    carregarComandasAbertas();
}

function fecharComandaAtual() {
    if (indexComandaAtual === null) {
        alert('Adicione pelo menos um item primeiro');
        return;
    }

    const comanda = comandasAbertas[indexComandaAtual];
    const pagamento = document.getElementById('pagamentoModal').value;

    if (!pagamento) {
        alert('Selecione a forma de pagamento');
        return;
    }

    if (comanda.itens.length === 0) {
        alert('Adicione pelo menos um item');
        return;
    }

    const total = comanda.itens.reduce((s, i) => s + i.valor, 0);

    const historico = JSON.parse(localStorage.getItem('comandas') || '[]');
    historico.push({
        cliente: comanda.cliente,
        pagamento,
        total,
        itens: comanda.itens,
        data: new Date().toLocaleDateString('pt-BR')
    });
    localStorage.setItem('comandas', JSON.stringify(historico));

    comandasAbertas.splice(indexComandaAtual, 1);
    salvarComandasAbertas();

    alert(`Comanda de ${comanda.cliente} fechada! Total: R$ ${total.toFixed(2)}`);
    fecharModal();
    carregarComandasAbertas();
}

function salvarComandasAbertas() {
    localStorage.setItem('comandasAbertas', JSON.stringify(comandasAbertas));
}

function fecharModal() {
    document.getElementById('modalComanda').style.display = 'none';
    indexComandaAtual = null;
}