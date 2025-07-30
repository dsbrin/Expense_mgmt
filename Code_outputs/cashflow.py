"""Generate CashFlow.txt with entries and exits for the last three months.

Reads Account Money transactions from _Data/_Raw/Input_AccMoney.csv and
computes, for the three most recent calendar months present in the file:

mes,entradas,saidas
2025-06,10478.07,8118.40
...

• 'entradas' = soma dos valores positivos
• 'saidas'   = soma dos valores negativos (valor absoluto)
"""
from pathlib import Path
import csv
from datetime import datetime
from collections import defaultdict

BASE_DIR = Path(__file__).resolve().parent.parent
DATA_DIR = BASE_DIR / "_Data"
RAW_FILE = DATA_DIR / "_Raw" / "Input_AccMoney.csv"
OUT_FILE = DATA_DIR / "_Outputs" / "CashFlow.txt"


def parse_date(date_str: str) -> datetime:
    return datetime.strptime(date_str, "%Y-%m-%d")


def main() -> None:
    if not RAW_FILE.exists():
        raise FileNotFoundError(RAW_FILE)

    entradas: dict[str, float] = defaultdict(float)
    saidas: dict[str, float] = defaultdict(float)

    with RAW_FILE.open("r", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for row in reader:
            data_str = row["data"].strip()
            if not data_str:
                continue
            mes = data_str[:7]  # YYYY-MM
            valor_raw = row["valor"].strip().replace("\u00A0", "")
            valor = float(valor_raw.replace(",", "")) if "," in valor_raw else float(valor_raw)
            if valor < 0:
                saidas[mes] += abs(valor)
            else:
                entradas[mes] += valor

    # Determine last 3 months with data
    meses = sorted(entradas.keys() | saidas.keys(), reverse=True)[:3]

    lines = ["mes,entradas,saidas"]
    for mes in meses:
        ent = entradas.get(mes, 0.0)
        sai = saidas.get(mes, 0.0)
        lines.append(f"{mes},{ent:.2f},{sai:.2f}")

    OUT_FILE.parent.mkdir(exist_ok=True, parents=True)
    OUT_FILE.write_text("\n".join(lines) + "\n", encoding="utf-8")
    print(f"CashFlow gravado em {OUT_FILE}")


if __name__ == "__main__":
    main()
