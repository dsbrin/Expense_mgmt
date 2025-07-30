document.addEventListener("DOMContentLoaded", () => {
  carregarSaldo();
  carregarMovimentacoes();
});

function carregarSaldo() {
  const saldoEl = document.getElementById("saldoValor");
  if (!saldoEl) return;
  const saldoPath = "/_Data/_Outputs/Saldo.txt";
  fetch(saldoPath)
    .then((res) => {
      if (!res.ok) throw new Error("Não foi possível ler o saldo.");
      return res.text();
    })
    .then((txt) => {
      const raw = txt.trim();
      const valor = parseFloat(raw.replace(/,/g, "."));
      const formatado = new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
        minimumFractionDigits: 2,
      }).format(valor);
      saldoEl.textContent = formatado;
    })
    .catch((err) => {
      console.error(err);
      saldoEl.textContent = "Erro ao carregar";
    });
}

function carregarMovimentacoes() {
  const listEl = document.getElementById("extratoList");
  if (!listEl) return;
  const movPath = "/_Data/Movimentacoes.txt";
  fetch(movPath)
    .then((res) => {
      if (!res.ok) throw new Error("Não foi possível ler movimentações.");
      return res.text();
    })
    .then((csv) => {
      const linhas = csv.trim().split(/\r?\n/).slice(1); // ignora cabeçalho
      linhas.forEach((l) => {
        if (!l) return;
        const [valor, sinal, tipo, descricao] = l.split(/,(.+)/)[0].split(",");
      });
      linhas.forEach((linha) => {
        const [valor, sinal, tipo, descricao] = linha.split(",");
        const li = document.createElement("li");
        li.className = "mov-item";
        const descSpan = document.createElement("span");
        descSpan.className = "mov-desc";
        descSpan.textContent = descricao;
        const valorSpan = document.createElement("span");
        valorSpan.className = "mov-valor";
        const num = parseFloat(valor.replace(/,/g, "."));
        const formatado = new Intl.NumberFormat("pt-BR", {
          style: "currency",
          currency: "BRL",
          minimumFractionDigits: 2,
        }).format(num * (sinal === "-" ? -1 : 1));
        valorSpan.textContent = formatado;
        valorSpan.style.color = sinal === "-" ? "#e74c3c" : "#27ae60";
        li.appendChild(descSpan);
        li.appendChild(valorSpan);
        listEl.appendChild(li);
      });
    })
    .catch((err) => {
      console.error(err);
      listEl.innerHTML = "<li class=\"mov-desc\">Erro ao carregar</li>";
    });
}
