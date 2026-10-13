import sqlite3
from flask import request, jsonify
from app import app

db = sqlite3.connect('server/db/datos.db', check_same_thread=False)
db.row_factory = sqlite3.Row
db.execute("PRAGMA foreign_keys = ON")


innit_categorias = """
CREATE TABLE IF NOT EXISTS categorias (
    id_categoria INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre_categoria TEXT NOT NULL UNIQUE
)
"""
db.execute(innit_categorias)

innit_productos = """
CREATE TABLE IF NOT EXISTS productos (
    id_producto INTEGER PRIMARY KEY AUTOINCREMENT,
    codigo TEXT NOT NULL UNIQUE,
    nombre TEXT NOT NULL,
    descripcion TEXT,
    precio REAL NOT NULL,
    stock INTEGER NOT NULL DEFAULT 0,
    imagen_url TEXT,
    categoria_id INTEGER,
    en_oferta BOOLEAN DEFAULT 0,
    porc_oferta REAL DEFAULT 0,
    FOREIGN KEY (categoria_id) REFERENCES categorias (id_categoria)
)
"""
db.execute(innit_productos)
db.commit()

def agregar_precio_final(prod_dict):
    precio = prod_dict.get('precio', 0)
    en_oferta = prod_dict.get('en_oferta', 0)
    porc_oferta = prod_dict.get('porc_oferta', 0) or 0

    if en_oferta == 1 and porc_oferta > 0:
        prod_dict['precio_final'] = round(precio * (1 - porc_oferta / 100))
    else:
        prod_dict['precio_final'] = precio

    return prod_dict        

@app.get('/api/productos')
def obtenerProductos():
    query = """
        SELECT p.*, c.nombre_categoria AS categoria_nombre 
        FROM productos p 
        LEFT JOIN categorias c ON p.categoria_id = c.id_categoria
    """
    rows = db.execute(query).fetchall()
    productos = [agregar_precio_final(dict(row)) for row in rows]
    return jsonify({'ok': True, 'productos': productos})


@app.get('/api/productos/<codigo>')
def obtenerProductosByCodigo(codigo):
    query = """
        SELECT p.*, c.nombre_categoria AS categoria_nombre 
        FROM productos p 
        LEFT JOIN categorias c ON p.categoria_id = c.id_categoria
        WHERE p.codigo = ?
    """
    row = db.execute(query, (codigo,)).fetchone()
    
    if not row:
        return jsonify({'ok': False, 'mensaje': f"Producto con código '{codigo}' no encontrado"}), 404

    cambio_precio = agregar_precio_final(dict(row))
    
    return jsonify({
        'ok': True,
        'producto': cambio_precio
    }), 200

@app.get('/api/productos/categorias/<id_categoria>')
def obtenerProductosByCategoria(id_categoria):
    query = "SELECT * FROM productos WHERE categoria_id = ?"
    rows = db.execute(query, (id_categoria,)).fetchall()
    
    if not rows:
        return jsonify({'ok': False, 'mensaje': f"No se han encontrado productos para {id_categoria}"}), 404
        
    return jsonify({
        'ok': True,
        'productos': [agregar_precio_final(dict(row)) for row in rows]
    }), 200

@app.get('/api/productos/ofertas')
def obtenerProductosOfertas():
    query = """
        SELECT p.*, c.nombre_categoria AS categoria_nombre 
        FROM productos p 
        LEFT JOIN categorias c ON p.categoria_id = c.id_categoria
        WHERE en_oferta = 1
    """
    rows = db.execute(query).fetchall()
    productos = [agregar_precio_final(dict(row)) for row in rows]
    return jsonify({'ok': True, 'productos': productos})

@app.post('/api/productos')
def registrarProducto():
    body = request.get_json() or {}

    nombre = body.get('nombre')
    descripcion = body.get('descripcion')
    precio = body.get('precio')
    stock = body.get('stock', 0)
    imagen = body.get('imagen')
    nombre_categoria = body.get('nombre_categoria')

    en_oferta_ingreso = body.get('en_oferta')
    en_oferta = 1 if en_oferta_ingreso == 'SÍ' else 0
    porc_oferta = body.get('porc_oferta')

    if not nombre or not precio or not stock or not imagen or not nombre_categoria or not en_oferta_ingreso:
        return jsonify({'ok': False, 'error': 'Faltan campos obligatorios'}), 400

    fila = db.execute("SELECT MAX(id_producto) FROM productos").fetchone()
    ultimo_id = fila[0] if (fila and fila[0] is not None) else 0
    nuevo_numero = ultimo_id + 1
    codigo = f"VIN-00{nuevo_numero}"

    categoria_id = None
    if nombre_categoria:
        categoria = db.execute('SELECT id_categoria FROM categorias WHERE nombre_categoria = ?', (nombre_categoria,)).fetchone()
        if categoria:
            categoria_id = categoria['id_categoria']

    cursor = db.execute(
        '''INSERT INTO productos (codigo, nombre, descripcion, precio, stock, imagen_url, categoria_id, en_oferta, porc_oferta)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)''',
        (codigo, nombre, descripcion, precio, stock, imagen, categoria_id, en_oferta, porc_oferta)
    )
    db.commit()

    return jsonify({
        'ok': True,
        'mensaje': 'Producto registrado exitosamente',
        'producto_id': cursor.lastrowid
    }), 201


@app.put('/api/productos/<codigo>')
def actualizarProducto(codigo):
    datos = request.get_json() or {}
    
    nombre = datos.get('nombre')
    descripcion = datos.get('descripcion')
    precio = datos.get('precio')
    stock = int(datos.get('stock') or 0)
    imagen_url = datos.get('imagen')
    
    nombre_categoria = datos.get('nombre_categoria')
    
    if not nombre or precio is None or not nombre_categoria:
        return jsonify({"ok": False, "error": "Los campos 'nombre', 'precio' y 'categoría' son obligatorios"}), 400

    categoria_id = None
    categoria = db.execute('SELECT id_categoria FROM categorias WHERE nombre_categoria = ?', (nombre_categoria,)).fetchone()
    if categoria:
        categoria_id = categoria['id_categoria']
    else:
        return jsonify({"ok": False, "error": f"La categoría '{nombre_categoria}' no existe"}), 400

    en_oferta_ingreso = datos.get('en_oferta')
    en_oferta = 1 if en_oferta_ingreso == 'SÍ' else 0
    
    porc_oferta = datos.get('porc_oferta')
    porc_oferta = float(porc_oferta) if porc_oferta != "" and porc_oferta is not None else 0

    cursor = db.execute('''
        UPDATE productos 
        SET nombre = ?, 
            descripcion = ?, 
            precio = ?, 
            stock = ?, 
            imagen_url = ?, 
            categoria_id = ?, 
            en_oferta = ?,
            porc_oferta = ?
        WHERE codigo = ?
    ''', (nombre, descripcion, precio, stock, imagen_url, categoria_id, en_oferta, porc_oferta, codigo))
    
    db.commit()
    
    if cursor.rowcount == 0:
        return jsonify({"ok": False, "error": f"Producto con código '{codigo}' no encontrado"}), 404
        
    return jsonify({"ok": True, "mensaje": f"Producto '{codigo}' actualizado correctamente"}), 200


@app.delete('/api/productos/<codigo>')
def eliminarProducto(codigo):
    cursor = db.execute('DELETE FROM productos WHERE codigo = ?', (codigo,))
    db.commit()
    
    if cursor.rowcount == 0:
        return jsonify({"error": f"Producto con codigo: {codigo} no encontrado"}), 404
        
    return jsonify({"mensaje": f"Producto con codigo: {codigo} eliminado correctamente"}), 200

@app.get('/api/categorias')
def obtenerCategorias():
    query = "SELECT id_categoria, nombre_categoria FROM categorias"
    rows = db.execute(query).fetchall()
    categorias = [dict(row) for row in rows]
    return jsonify({'ok': True, 'categorias': categorias})


@app.post('/api/categorias/agregar')
def agregarCategorias():
    body = request.get_json() or {}
    nombre_categoria = body.get('nombre_categoria')
    
    if not nombre_categoria: 
        return jsonify({'ok': False, 'error': 'Falta el nombre de la categoría'}), 400
        
    try:
        cursor = db.execute(
            'INSERT INTO categorias (nombre_categoria) VALUES (?)',
            (nombre_categoria,)
        )
        db.commit()
    except Exception as e:
        return jsonify({'ok': False, 'error': 'La categoría ya existe'}), 400
    
    return jsonify({
        'ok': True,
        'mensaje': 'Categoría registrada exitosamente',
        'categoria_id': cursor.lastrowid
    }), 201
