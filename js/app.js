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
    const valor = document.getElementById('valor de vendas').value;
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
    const valor = document.getElementById('valor de despesas').value;
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
    JSON.parse(localStorage.getItem('comandas'))

    limparComanda();
}
function limparComanda() {

    itensComanda = [];

    document.getElementById('cliente').value = '';
    document.getElementById('itemComanda').value = '';
    document.getElementById('valorComanda').value = '';

    atualizarComanda();
}