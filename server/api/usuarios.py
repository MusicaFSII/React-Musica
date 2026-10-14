from app import app
import sqlite3
from flask import Flask, request, jsonify

db = sqlite3.connect('server/db/datos.db', check_same_thread=False)
db.row_factory = sqlite3.Row

init_usuarios = """
  CREATE TABLE IF NOT EXISTS usuarios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    apellido TEXT NOT NULL,
    correo TEXT UNIQUE NOT NULL,
    contrasena TEXT NOT NULL,
    rut TEXT NOT NULL,
    telefono TEXT NOT NULL,
    region TEXT NOT NULL,
    comuna TEXT NOT NULL,
    rol TEXT NOT NULL DEFAULT 'cliente'
  )
"""

db.execute(init_usuarios)
db.commit()

init_comentarios = """
  CREATE TABLE IF NOT EXISTS comentarios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    apellido TEXT NOT NULL,
    correo TEXT NOT NULL,
    comentario TEXT NOT NULL
  )
"""

db.execute(init_comentarios)
db.commit()

@app.post('/api/comentario')
def comentario():
    body = request.get_json() or {}
    print(body)
    correo = body.get('correo')
    nombre = body.get('nombre')
    apellido = body.get('apellido')
    comentario = body.get('comentario')

    #validacion de que todos los campos esten llenos
    if not nombre or not apellido or not correo or not comentario:
        return jsonify({'ok': False, 'error': 'Todos los campos son obligatorios'}), 400
    
    #insertar el usuario en la base de datos
    cursor = db.execute(
        '''INSERT INTO comentarios (correo, nombre, apellido, comentario)
            VALUES (?, ?, ?, ?)''',
        (correo, nombre, apellido, comentario),
    )
    db.commit()

    return jsonify({
        'ok': True,
        'mensaje': 'Comentario enviado con exito',
        'comentario': {
            'id': cursor.lastrowid,
            'nombre': nombre,
            'apellido': apellido,
            'correo': correo,
            'comentario': comentario
        },
    })

#inicio de sesion de usuarios
@app.post('/api/login')
def login():
    body = request.get_json() or {}
    print(body)
    correo = body.get('correo')
    contrasena = body.get('contrasena')
    row = db.execute(
        'SELECT * FROM usuarios WHERE correo = ? AND contrasena = ?',
        (correo, contrasena),
    ).fetchone()

    if not row:
        return jsonify({'ok': False, 'error': 'Usuario o contraseña incorrectos'}), 401
    
    return jsonify({'ok': True, 'usuario': dict(row)})

#registro se usuarios
@app.post('/api/registro')
def registro():
    body = request.get_json() or {}
    print(body)
    correo = body.get('correo')
    contrasena = body.get('contrasena')
    contrasenaConf = body.get('contrasenaConf')
    rut = body.get('rut')
    telefono = body.get('telefono')
    region = body.get('region')
    comuna = body.get('comuna')
    nombre = body.get('nombre')
    apellido = body.get('apellido')

    #verificar si el correo ya existe
    existe = db.execute(
        'SELECT id FROM usuarios WHERE correo = ?',
        (correo,),
    ).fetchone()
    if existe:
        return jsonify({'ok': False, 'error': 'El correo ya está registrado'}), 400
    
    #verificar que las contraseñas sean iguales
    if(contrasena != contrasenaConf):
        return jsonify({'ok': False, 'error': 'Las contraseñas no coinciden'}), 400

    #el primer usuario es admin el resto es cliente
    count = db.execute('SELECT COUNT(*) as total FROM usuarios').fetchone()['total']
    rol = 'admin' if count == 0 else 'cliente'
    
    #insertar el usuario en la base de datos
    cursor = db.execute(
        '''INSERT INTO usuarios (correo, contrasena, rut, telefono, region, comuna, nombre, apellido, rol)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)''',
        (correo, contrasena, rut, telefono, region, comuna, nombre, apellido, rol),
    )
    db.commit()

    return jsonify({
        'ok': True,
        'usuario': {
            'id': cursor.lastrowid,
            'correo': correo,
            'rol': rol
        },
    })

#obtener los usuarios
@app.get('/api/usuarios')
def obtenerUsuarios():
    rows = db.execute('SELECT * FROM usuarios').fetchall()
    usuarios = [dict(row) for row in rows]
    return jsonify({'ok': True, 'usuarios': usuarios})

#obtener un usuario por id
@app.get('/api/usuarios/<int:id>')
def obtenerUsuarioID(id):
    row = db.execute('SELECT * FROM usuarios WHERE id = ?', (id,)).fetchone()

    if not row:
        return jsonify({'ok': False, 'error': 'Usuario no encontrado'}), 404
    
    return jsonify({'ok': True, 'usuario': dict(row)})

#eliminar usuarios
@app.delete('/api/usuarios/<int:id>')
def eliminarUsuario(id):
    cursor = db.execute('DELETE FROM usuarios WHERE id = ?', (id,))
    db.commit()

    if(cursor.rowcount == 0):
        return jsonify({'ok': False, 'error': 'Usuario no encontrado'}), 404

    return jsonify({'ok': True, 'mensaje': 'Usuario eliminado correctamente'}), 200

#actualiza los datos del usuario
@app.put('/api/usuarios/<int:id>')
def actualizar_usuario(id):
    body = request.get_json() or {}
    correo = body.get('correo')
    rut = body.get('rut')
    telefono = body.get('telefono')
    region = body.get('region')
    comuna = body.get('comuna')
    nombre = body.get('nombre')
    apellido = body.get('apellido')
    rol = body.get('rol')

    #validacion de que el correo no esta registrado
    existe_correo = db.execute(
        'SELECT id FROM usuarios WHERE correo = ? AND id != ?',
        (correo, id)
    ).fetchone()

    if existe_correo:
        return jsonify({'ok': False, 'error': 'El correo ya esta registrado'}), 400

    #actualizar la base de datos
    db.execute(
        '''UPDATE usuarios 
           SET nombre = ?, apellido = ?, rut = ?, correo = ?, telefono = ?, region = ?, comuna = ?, rol = ?
           WHERE id = ?''',
        (nombre, apellido, rut, correo, telefono, region, comuna, rol, id)
    )
    db.commit()

    return jsonify({'ok': True, 'mensaje': 'Usuario actualizado correctamente'})

#contar usuarios
@app.get('/api/usuarios/count')
def contarUsuarios():
    row = db.execute('SELECT COUNT(*) as total FROM usuarios').fetchone()
    return jsonify({'ok': True, 'total': row['total']})


# cambiar contraseña de usuario
@app.put('/api/usuarios/<int:id>/cambiar-clave')
def cambiar_contrasena(id):
    body = request.get_json() or {}
    actual = body.get('contrasenaActual')
    nueva = body.get('contrasenaNueva')

    if not actual or not nueva:
        return jsonify({'ok': False, 'error': 'Ambos campos son obligatorios'}), 400

    row = db.execute('SELECT contrasena FROM usuarios WHERE id = ?', (id,)).fetchone()
    if not row or row['contrasena'] != actual:
        return jsonify({'ok': False, 'error': 'La contraseña actual es incorrecta'}), 400

    db.execute('UPDATE usuarios SET contrasena = ? WHERE id = ?', (nueva, id))
    db.commit()

    return jsonify({'ok': True, 'mensaje': 'Contraseña actualizada con exito'})

#obtener los datos del usuario por el correo electronico
@app.get('/api/usuarios/correo/<string:correo>')
def obtenerUsuarioCorreo(correo):
    row = db.execute('SELECT * FROM usuarios WHERE correo = ?', (correo,)).fetchone()

    if not row:
        return jsonify({'ok': False, 'error': 'Usuario no encontrado'}), 404
    
    usuario = dict(row)    
    return jsonify({'ok': True, 'usuario': usuario})