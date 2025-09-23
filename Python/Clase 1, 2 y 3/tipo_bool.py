# Bool contine los valores de True y False
# Los tipos numéricos, es false para el 0 (cero), true para los demás valores
valor = 0
resultado = bool(valor)
print(f'Valor: {valor}, Resultado: {resultado}')

valor = -1
resultado = bool(valor)
print(f'Valor: {valor}, Resultado: {resultado}')

valor = 0.0
resultado = bool(valor)
print(f'Valor: {valor}, Resultado: {resultado}')

# Tipo String -> False '', True -> demás valores
valor = ''
resultado = bool(valor)
print(f'Valor: {valor}, Resultado: {resultado}')

valor = 'hola'
resultado = bool(valor)
print(f'Valor: {valor}, Resultado: {resultado}')

# Tipo colecciones -> False para colecciones vacías
# Tipo colecciones -> True para las demás
valor = []
resultado = bool(valor)
print(f'Valor de una lista vacía: {valor}, Resultado: {resultado}')

valor = [2, 3, 4]
resultado = bool(valor)
print(f'Valor de una lista con elementos: {valor}, Resultado: {resultado}')

# Tupla
valor = ()
resultado = bool(valor)
print(f'Valor de una tupla vacía: {valor}, Resultado: {resultado}')

valor = (5, 6, 7,)
resultado = bool(valor)
print(f'Valor de tupla con elementos: {valor}, Resultado: {resultado}')

# Diccionario
valor = {}
resultado = bool(valor)
print(f'Valor de diccionario vacío: {valor}, Resultado: {resultado}')

valor = {'Nombre': 'Pedro', 'Apellido': 'Picapiedra'}
resultado = bool(valor)
print(f'Valor de diccionario con elementos: {valor}, Resultado: {resultado}')

# Sentencias de control con bool
if (1,):
    print('Regresa verdadero')
else:
    print('Regresa falso')

# Ciclos
variable = 17
while variable:
    print('TRegresa verdadero')
    break
else:
    print('Regresa verdadero')