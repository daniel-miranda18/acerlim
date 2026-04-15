"""
Generador de datos simulados realistas para ACERLIM
Contexto: Fabrica de calaminas y techos en Bolivia (La Paz / El Alto)
- Temporada seca (abr-oct): mayor demanda de construccion
- Temporada de lluvias (nov-mar): menor demanda
- Se compran ~2 bobinas por mes
- 680 pedidos existentes en pedidos.csv (2023-2025)
"""

import pandas as pd
import numpy as np
import random
from datetime import datetime, timedelta

np.random.seed(42)
random.seed(42)

# ── Leer datos existentes que NO cambian ──────────────────────
productos = pd.read_csv('data/productos.csv')
tipos = pd.read_csv('data/tipos_productos.csv')

# Catálogo de productos con sus precios base por unidad (en BOB)
# Precios realistas para Bolivia 2023-2025
PRECIOS_BASE = {
    1:  {"base": 50.0,  "var": 3.0},   # Trap Zincalum 0.20 1.80m
    2:  {"base": 56.0,  "var": 3.0},   # Trap Zincalum 0.20 2.00m
    3:  {"base": 84.0,  "var": 4.0},   # Trap Zincalum 0.20 3.00m
    4:  {"base": 73.0,  "var": 4.0},   # Trap Zincalum 0.25 2.00m
    5:  {"base": 110.0, "var": 5.0},   # Trap Zincalum 0.25 3.00m
    6:  {"base": 136.0, "var": 6.0},   # Trap Zincalum 0.30 3.00m
    7:  {"base": 40.0,  "var": 2.0},   # Trap Galv 0.17 1.80m
    8:  {"base": 44.5,  "var": 2.5},   # Trap Galv 0.17 2.00m
    9:  {"base": 84.0,  "var": 4.0},   # Trap Galv 0.20 3.00m
    10: {"base": 112.0, "var": 5.0},   # Trap Galv 0.20 4.00m
    11: {"base": 57.0,  "var": 3.0},   # Ond Zincalum 0.20 2.00m
    12: {"base": 44.5,  "var": 2.5},   # Ond Galv 0.17 2.00m
    13: {"base": 84.0,  "var": 4.0},   # Ond Galv 0.20 3.00m
    14: {"base": 84.0,  "var": 5.0},   # Plancha Lisa Zincalum 0.25
    15: {"base": 68.0,  "var": 3.0},   # Plancha Lisa Galv 0.20
    16: {"base": 76.0,  "var": 3.5},   # Prepintada Roja 0.20 2.00m
    17: {"base": 114.0, "var": 5.0},   # Prepintada Verde 0.20 3.00m
    18: {"base": 115.0, "var": 5.0},   # Prepintada Azul 0.20 3.00m
    19: {"base": 98.0,  "var": 4.0},   # Prepintada Marron 0.25 2.00m
    20: {"base": 45.0,  "var": 2.5},   # Canaleta Zincalum 3m
}

# Cantidades típicas de compra (en unidades)
CANTIDADES_TIPICAS = [5, 10, 15, 20, 30, 50, 100]
PESOS_CANTIDADES =   [0.15, 0.25, 0.20, 0.15, 0.12, 0.08, 0.05]

# Productos más populares (Trapezoidal domina el mercado boliviano)
PRODUCTOS_POPULARES = [1, 2, 3, 4, 5, 8, 9, 13]
PRODUCTOS_MEDIOS = [6, 7, 10, 11, 12, 14, 15, 16, 17, 18, 19]
PRODUCTOS_BAJO = [20]

# Inflación anual aproximada en Bolivia (suave pero constante)
INFLACION = {2023: 1.00, 2024: 1.035, 2025: 1.068}

# ── Leer pedidos existentes ───────────────────────────────────
pedidos = pd.read_csv('data/pedidos.csv')
print(f"Pedidos existentes: {len(pedidos)}")

# ── Generar pedido_detalles para TODOS los pedidos ────────────
detalles = []
id_detalle = 1

for _, pedido in pedidos.iterrows():
    id_pedido = pedido['id_pedido']
    fecha = pd.to_datetime(pedido['fecha'])
    anio = fecha.year
    mes = fecha.month
    
    # Factor de temporada: temporada seca (abr-oct) = mas productos por pedido
    es_temporada_alta = 4 <= mes <= 10
    
    # Cuantas lineas de detalle tiene este pedido (1 a 4 productos diferentes)
    if es_temporada_alta:
        n_lineas = np.random.choice([1, 2, 3, 4], p=[0.15, 0.35, 0.30, 0.20])
    else:
        n_lineas = np.random.choice([1, 2, 3, 4], p=[0.25, 0.40, 0.25, 0.10])
    
    # Seleccionar productos sin repetir
    productos_pedido = []
    for _ in range(n_lineas):
        # Probabilidad de elegir producto popular vs medio vs bajo
        categoria = np.random.choice(['pop', 'med', 'bajo'], p=[0.55, 0.35, 0.10])
        if categoria == 'pop':
            pool = [p for p in PRODUCTOS_POPULARES if p not in productos_pedido]
        elif categoria == 'med':
            pool = [p for p in PRODUCTOS_MEDIOS if p not in productos_pedido]
        else:
            pool = [p for p in PRODUCTOS_BAJO if p not in productos_pedido]
        
        if not pool:
            pool = [p for p in range(1, 21) if p not in productos_pedido]
        
        prod_id = random.choice(pool)
        productos_pedido.append(prod_id)
    
    for prod_id in productos_pedido:
        # Cantidad: en temporada alta, pedidos tienden a ser mas grandes
        cantidad = np.random.choice(CANTIDADES_TIPICAS, p=PESOS_CANTIDADES)
        if es_temporada_alta:
            # 30% de probabilidad de duplicar la cantidad en temporada alta
            if random.random() < 0.30:
                cantidad = min(cantidad * 2, 100)
        
        # Precio con inflacion y variacion normal
        info_precio = PRECIOS_BASE[prod_id]
        precio_base = info_precio['base'] * INFLACION.get(anio, 1.068)
        precio_unitario = round(precio_base + np.random.normal(0, info_precio['var']), 2)
        precio_unitario = max(precio_unitario, precio_base * 0.85)  # piso minimo
        
        subtotal = round(cantidad * precio_unitario, 2)
        
        detalles.append({
            'id_detalle': id_detalle,
            'id_pedido': id_pedido,
            'id_producto': prod_id,
            'cantidad': cantidad,
            'precio_unitario': precio_unitario,
            'subtotal': subtotal,
            'estado': 1
        })
        id_detalle += 1

df_detalles = pd.DataFrame(detalles)

# Recalcular totales de pedidos basándose en los nuevos detalles
totales = df_detalles.groupby('id_pedido')['subtotal'].sum().reset_index()
totales.columns = ['id_pedido', 'nuevo_total']

pedidos_nuevo = pedidos.copy()
pedidos_nuevo = pedidos_nuevo.merge(totales, on='id_pedido', how='left')
pedidos_nuevo['subtotal'] = pedidos_nuevo['nuevo_total'].round(2)
pedidos_nuevo['total'] = pedidos_nuevo['nuevo_total'].round(2)
pedidos_nuevo.drop(columns=['nuevo_total'], inplace=True)

# ── Guardar archivos ──────────────────────────────────────────
# Guardar pedido_detalles
df_detalles.to_csv('data/pedido_detalles.csv', index=False)
print(f"pedido_detalles.csv generado: {len(df_detalles)} registros")

# Guardar pedidos actualizado con totales correctos
pedidos_nuevo.to_csv('data/pedidos.csv', index=False)
print(f"pedidos.csv actualizado: {len(pedidos_nuevo)} registros")

# ── Resumen estadístico ──────────────────────────────────────
print("\n" + "=" * 55)
print("RESUMEN DE DATOS GENERADOS")
print("=" * 55)

# Unir para análisis
merged = df_detalles.merge(pedidos_nuevo[['id_pedido', 'fecha']], on='id_pedido')
merged['fecha'] = pd.to_datetime(merged['fecha'])
merged['anio'] = merged['fecha'].dt.year
merged['mes'] = merged['fecha'].dt.month

for year in sorted(merged['anio'].unique()):
    subset = merged[merged['anio'] == year]
    print(f"\nAnio {year}:")
    print(f"  Lineas de detalle : {len(subset)}")
    print(f"  Unidades vendidas : {subset['cantidad'].sum():,.0f}")
    print(f"  Facturacion total : {subset['subtotal'].sum():,.2f} BOB")
    
    # Promedio mensual
    por_mes = subset.groupby('mes')['cantidad'].sum()
    print(f"  Promedio mensual  : {por_mes.mean():,.0f} unidades")

# Top 5 productos mas vendidos
top_prods = df_detalles.groupby('id_producto')['cantidad'].sum().nlargest(5)
print("\nTop 5 productos mas vendidos (por unidades):")
for pid, qty in top_prods.items():
    desc = productos[productos['id_producto'] == pid]['descripcion'].values[0]
    print(f"  #{pid}: {desc} -> {qty:,.0f} unidades")

print(f"\nTotal general de registros en pedido_detalles: {len(df_detalles)}")
print("Datos listos para el modelo de prediccion.")
