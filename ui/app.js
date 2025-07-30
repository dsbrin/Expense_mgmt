document.addEventListener("DOMContentLoaded", () => {
  carregarSaldo();
  carregarMovimentacoes();
  carregarCashFlow();
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
      saldoEl.textContent = formatarBRL(valor);
    })
    .catch((err) => {
      console.error(err);
      saldoEl.textContent = "Erro ao carregar";
    });
}

function carregarMovimentacoes() {
  const listEl = document.getElementById("extratoList");
  if (!listEl) return;
  const movPath = "/_Data/_Outputs/Mov_acc_money.txt";
  fetch(movPath)
    .then((res) => {
      if (!res.ok) throw new Error("Não foi possível ler movimentações.");
      return res.text();
    })
    .then((csv) => {
      const linhas = csv.trim().split(/\r?\n/).slice(1); // ignora cabeçalho
      linhas.forEach((linha) => {
        const [valor, sinal, , descricao] = linha.split(",");
        const li = document.createElement("li");
        li.className = "mov-item";
        const descSpan = document.createElement("span");
        descSpan.className = "mov-desc";
        descSpan.textContent = descricao;
        const valorSpan = document.createElement("span");
        valorSpan.className = "mov-valor";
        const num = parseFloat(valor.replace(/,/g, "."));
        valorSpan.textContent = formatarBRL(num * (sinal === "-" ? -1 : 1));
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

function carregarCashFlow() {
  const chartEl = document.getElementById("cashflowChart");
  if (!chartEl) return;
  const entradasEl = document.getElementById("entradasMes");
  const saidasEl = document.getElementById("saidasMes");
  const path = "/_Data/_Outputs/CashFlow.txt";
  fetch(path)
    .then((r) => {
      if (!r.ok) throw new Error("CashFlow não encontrado");
      return r.text();
    })
    .then((txt) => {
      const linhas = txt.trim().split(/\r?\n/).slice(1);
      const labels = [];
      const entradas = [];
      const saidas = [];
      linhas.forEach((l) => {
        if (!l) return;
        const [mes, ent, sai] = l.split(",");
        labels.unshift(mes); // gráficos do mais antigo à direita
        entradas.unshift(parseFloat(ent));
        saidas.unshift(-parseFloat(sai)); // negativo para barras para baixo
      });
      // Labels legíveis (Abr, Mai, Jun etc.)
      const monthNames = ["Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez"];
      const displayLabels = labels.map((l) => monthNames[parseInt(l.split("-")[1], 10)-1]);

      // Atualiza valores do último mês
      const lastIdx = labels.length - 1;
      entradasEl.textContent = formatarBRL(entradas[lastIdx]);
      saidasEl.textContent = formatarBRL(Math.abs(saidas[lastIdx]));

      new Chart(chartEl, {
        type: "bar",
        data: {
          labels: displayLabels,
          datasets: [
            {
              label: "Entradas",
              data: entradas,
              backgroundColor: "#27ae60",
              borderRadius: 6,
              borderSkipped: false,
              borderAlign: "inner",
              barPercentage: 0.6,
              categoryPercentage: 0.6,
              borderWidth: 0,
            },
            {
              label: "Saídas",
              data: saidas,
              backgroundColor: "#e74c3c",
              borderRadius: 6,
              borderSkipped: false,
              borderAlign: "inner",
              barPercentage: 0.6,
              categoryPercentage: 0.6,
              borderWidth: 0,
            },
          ],
        },
        options: {
          responsive: false,
          layout: { padding: { left: 8, right: 0 } },
          plugins: { legend: { display: false } },
          scales: {
            x: {
              grid: { display: false, drawBorder: false },
              ticks: { font: { size: 12 } },
              stacked: true,
            },
            y: {
              grid: { display: false, drawBorder: false },
              ticks: { display: false },
              stacked: true,
            },
          },
        },
      });
    })
    .catch((e) => console.error(e));
}

function formatarBRL(v) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
  }).format(v);
}
