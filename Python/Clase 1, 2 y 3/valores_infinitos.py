# Manejo  de valores infinitod
import math
from decimal import Decimal

# Manejo de valores infinitos
inifinito_positivo = float('inf')
print(inifinito_positivo)
print("Infinito positivo")
print(f"Es infinito?: {math.isinf(inifinito_positivo)}")

infinito_negativo = float("-inf")
print(infinito_negativo)
print("Infinito negativo")
print(f"Es infinito?: {math.isinf(infinito_negativo)}")

# Módulo math
inifinito_positivo = math.inf
print("Infinito positivo")
print(f"Es infinito?: {math.isinf(inifinito_positivo)}")

infinito_negativo = -math.inf
print(infinito_negativo)
print("Infinito negativo")
print(f"Es infinito?: {math.isinf(infinito_negativo)}")

# Módulo Decimal
inifinito_positivo = Decimal('Infinity')
print("Infinito positivo")
print(f"Es infinito?: {math.isinf(inifinito_positivo)}")

infinito_negativo = Decimal('-Infinity')
print(infinito_negativo)
print("Infinito negativo")
print(f"Es infinito?: {math.isinf(infinito_negativo)}")