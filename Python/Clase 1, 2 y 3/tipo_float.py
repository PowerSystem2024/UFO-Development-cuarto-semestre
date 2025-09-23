# Profundizando en el tipo float
a = 0.5


# Contructor de tipo float -> puede recibir de tipo int y str
a = float(10) # le pasamos un tipo entero
a = float('10') # le pasamos un tipo cadena de texto
print(f"a: {a:.2f}")

# Notación exponecial (valores positiovos o negativos)
a = 3e5 # cuando el valor es más grande, ej: 3e50 simplifica
print(f"a: {a:.2f}")

a = 3e-5
print(f"a: {a:.5f}")

# Cualquier cálculo que incluya un float, todo cambia a float
a = 4.0 + 5
print(a)
print(type(a))