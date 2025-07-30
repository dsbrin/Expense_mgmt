"""Generate Mov_acc_money.txt with the 3 most recent Account Money transactions.

Reads _Data/_Raw/Input_AccMoney.csv, sorts by date descending (YYYY-MM-DD)
and writes the last three rows to _Data/_Outputs/Mov_acc_money.txt
with columns:
valor,sinal,tipo,descricao,data
"""
from pathlib import Path
import csv
from datetime import datetime

BASE_DIR = Path(__file__).resolve().parent.parent  # project root
DATA_DIR = BASE_DIR / "_Data"
RAW_PATH = DATA_DIR / "_Raw" / "Input_AccMoney.csv"
OUT_PATH = DATA_DIR / "_Outputs" / "Mov_acc_money.txt"


def parse_date(date_str: str) -> datetime:
    return datetime.strptime(date_str, "%Y-%m-%d")


def main() -> None:
    if not RAW_PATH.exists():
        raise FileNotFoundError(RAW_PATH)

    rows = []
    with RAW_PATH.open("r", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for row in reader:
            rows.append(row)

    # Sort rows by date descending
    rows.sort(key=lambda r: parse_date(r["data"].strip()), reverse=True)

    latest = rows[:3]
    if len(latest) < 3:
        raise ValueError("Menos de 3 movimentações na conta money")

    lines = ["valor,sinal,tipo,descricao,data"]
    for r in latest:
        valor_raw = r["valor"].strip().replace("\u00A0", "")  # remove non-breaking spaces
        sinal = "-" if valor_raw.startswith("-") else "+"
        valor_clean = valor_raw.lstrip("+-")
        tipo = r["tipo"].strip()
        descricao = r["descricao"].strip()
        data = r["data"].strip()
        lines.append(f"{valor_clean},{sinal},{tipo},{descricao},{data}")

    OUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    OUT_PATH.write_text("\n".join(lines) + "\n", encoding="utf-8")
    print(f"Mov_acc_money gravado em {OUT_PATH}")


if __name__ == "__main__":
    main()
