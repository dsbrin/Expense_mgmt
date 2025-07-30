"""Generate Saldo output file based on _Data/Raw_Expenses.csv.

This script reads the raw expenses file, extracts the balance (saldo) value
and writes it unchanged to `_Data/Saldo.txt`. The resulting plain-text file
can then be consumed by the Vercel UI layer.
"""
from pathlib import Path

# Resolve relevant paths
BASE_DIR = Path(__file__).resolve().parent.parent  # project root
DATA_DIR = BASE_DIR / "_Data"
RAW_EXPENSES_PATH = DATA_DIR / "Raw_Expenses.csv"
OUTPUT_PATH = DATA_DIR / "Saldo.txt"


def main() -> None:
    # Read the raw expenses file
    if not RAW_EXPENSES_PATH.exists():
        raise FileNotFoundError(f"{RAW_EXPENSES_PATH} not found")

    with RAW_EXPENSES_PATH.open("r", encoding="utf-8") as f:
        # Strip whitespace and skip empty lines
        lines = [line.strip() for line in f if line.strip()]

    # Expect at least two lines: header ('Saldo') and the numeric value
    if len(lines) < 2:
        raise ValueError(
            "Raw_Expenses.csv deve conter duas linhas: cabecalho e valor do saldo"
        )

    balance_str = lines[1]  # Keep the original formatting unchanged

    # Write the balance to the output file
    OUTPUT_PATH.write_text(balance_str + "\n", encoding="utf-8")
    print(f"Saldo ({balance_str}) gravado em {OUTPUT_PATH}")


if __name__ == "__main__":
    main()
