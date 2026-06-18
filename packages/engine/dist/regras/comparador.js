export function compararRodada(jogadores, atributo, monteEmpate = []) {
    const detalhes = jogadores.map(j => {
        const carta = j.cartas[0];
        let valor;
        let especial = false;
        if (carta.tipo === 'vantagem') {
            valor = 'VANTAGEM';
            especial = true;
        }
        else if (carta.tipo === 'reves') {
            valor = 'REVES';
            especial = true;
        }
        else {
            valor = carta[atributo];
        }
        return { jogadorId: j.id, carta, valor, especial };
    });
    const vantagens = detalhes.filter(d => d.carta.tipo === 'vantagem');
    const reveses = detalhes.filter(d => d.carta.tipo === 'reves');
    const normais = detalhes.filter(d => d.carta.tipo === 'genetica');
    let vencedor = null;
    let mensagem = '';
    if (vantagens.length === 1 && reveses.length === 0) {
        vencedor = vantagens[0].jogadorId;
        mensagem = `${vantagens[0].carta.nome}! Vitória automática!`;
    }
    else if (vantagens.length >= 2) {
        vencedor = null;
        mensagem = 'Dois VANTAGEM! Empate no monte!';
    }
    else if (reveses.length === jogadores.length) {
        vencedor = null;
        mensagem = 'Todos REVES! Empate no monte!';
    }
    else if (reveses.length > 0 && vantagens.length === 0) {
        const semReves = normais;
        if (semReves.length === 1) {
            vencedor = semReves[0].jogadorId;
            mensagem = `${semReves[0].carta.nome} vence porque oponente tinha REVES!`;
        }
        else {
            const melhor = semReves.reduce((a, b) => a.valor > b.valor ? a : b);
            const empate = semReves.filter(s => s.valor === melhor.valor);
            if (empate.length > 1) {
                vencedor = null;
                mensagem = `Empate entre ${empate.length} jogadores no atributo ${atributo}!`;
            }
            else {
                vencedor = melhor.jogadorId;
                mensagem = `${melhor.carta.nome} vence com ${atributo} = ${melhor.valor}!`;
            }
        }
    }
    else {
        const valoresNumericos = detalhes.filter(d => typeof d.valor === 'number');
        if (valoresNumericos.length === 0) {
            vencedor = null;
            mensagem = 'Empate! Nenhum atributo válido para comparar.';
        }
        else {
            const melhor = valoresNumericos.reduce((a, b) => a.valor > b.valor ? a : b);
            const empate = valoresNumericos.filter(v => v.valor === melhor.valor);
            if (empate.length > 1) {
                vencedor = null;
                mensagem = `Empate! ${empate.length} jogadores com ${atributo} = ${melhor.valor}`;
            }
            else {
                vencedor = melhor.jogadorId;
                mensagem = `${melhor.carta.nome} vence com ${atributo} = ${melhor.valor}!`;
            }
        }
    }
    return {
        vencedor,
        monte: vencedor === null,
        detalhes,
        atributoEscolhido: atributo,
        mensagem
    };
}
//# sourceMappingURL=comparador.js.map