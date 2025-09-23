import math
from decimal import Decimal

# Nan (Not a Number)

a = float('NaN')
print(f'a = {a}')

# Módulo math
a = float('nan')
print(f'Es de tipo NaN? {math.isnan(a)}')

# Módulo Decimal
a = Decimal('NaN')
print(f'Es de tipo NaN? {math.isnan(a)}')
