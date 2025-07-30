"""Generate Movimentacoes output file based on the first three transactions in _Data/Outputs.csv.

Each line in the resulting `_Data/Movimentacoes.txt` will contain:
valor,sinal,tipo,descricao
Where:
  • valor – absolute numeric value
  • sinal – "+" para receitas, "-" para despesas (valor negativo)
  • tipo  – campo original "tipo" da linha (esperado "transacao")
"""
from pathlib import Path
import csv

BASE_DIR = Path(__file__).resolve().parent.parent  # project root
DATA_DIR = BASE_DIR / "_Data"
SOURCE_PATH = DATA_DIR / "Outputs.csv"
OUTPUT_PATH = DATA_DIR / "Movimentacoes.txt"


def main() -> None:
    if not SOURCE_PATH.exists():
        raise FileNotFoundError(SOURCE_PATH)

    movements = []
    with SOURCE_PATH.open("r", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for row in reader:
            if row["tipo"].strip().lower() == "transacao":
                valor_raw = row["valor"].strip()
                sinal = "-" if valor_raw.startswith("-") else "+"
                valor_abs = valor_raw.lstrip("+-")  # remove sign for clean value
                movements.append((valor_abs, sinal, row["tipo"].strip(), row["descricao"].strip()))
                if len(movements) == 3:
                    break

    if len(movements) < 3:
        raise ValueError("Menos de 3 transações encontradas em Outputs.csv")

    # Write output file
    lines = ["valor,sinal,tipo,descricao"] + [f"{v},{s},{t},{d}" for v, s, t, d in movements]
    OUTPUT_PATH.write_text("\n".join(lines) + "\n", encoding="utf-8")
    print(f"Movimentacoes gravadas em {OUTPUT_PATH}")


if __name__ == "__main__":
    main()
