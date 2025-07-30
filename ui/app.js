document.addEventListener("DOMContentLoaded", () => {
  const saldoEl = document.getElementById("saldoValor");
  if (!saldoEl) return;

  // Caminho relativo ao HTML (/ui/) para o arquivo saldo
  const saldoPath = "../_Data/_Outputs/Saldo.txt";

  fetch(saldoPath)
    .then((res) => {
      if (!res.ok) throw new Error("Não foi possível ler o saldo.");
      return res.text();
    })
    .then((txt) => {
      const raw = txt.trim();
      const valor = parseFloat(raw.replace(/,/g, "."));
      // Formatar em Real Brasileiro
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
});
