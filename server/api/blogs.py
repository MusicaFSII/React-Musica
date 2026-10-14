from app import app
import sqlite3
from flask import Flask, request, jsonify
import base64

db = sqlite3.connect('server/db/datos.db', check_same_thread=False)
db.row_factory = sqlite3.Row

innit_blogs="""
    CREATE TABLE IF NOT EXISTS BLOGS(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    blog_id TEXT NOT NULL,
    titulo TEXT NOT NULL,
    contenido TEXT NOT NULL,
    imagen_blog BLOB NOT NULL) 
"""

db.execute(innit_blogs)
db.commit()

@app.get("/api/blogs")
def obtenerBlogs():
    query  = "SELECT * FROM BLOGS"
    rows = db.execute(query).fetchall()

    blogs = []
    for row in rows:
        diccionario = dict(row)
        if diccionario.get("imagen_blog"):
            bytes_imagen = diccionario["imagen_blog"]
            base64_string = base64.b64encode(bytes_imagen).decode("utf-8")
            
            diccionario["imagen_blog"] = f"data:image/jpeg;base64,{base64_string}"

        blogs.append(diccionario)

    return jsonify({"ok": True, "blogs": blogs})

@app.get("/api/blogs/detalles/<string:blog_id>")
def obtenerBlogsDetalles(blog_id):
   query = "SELECT * FROM BLOGS WHERE blog_id = ?"
   row = db.execute(query, (blog_id,)).fetchone()

   if row is None:
      return jsonify({"error":"Blog no encontrado."}), 404

   diccionario = dict(row)

   return jsonify(diccionario)

@app.post("/api/blogs/agregar")
def agregarBlogs():
  body = request.get_json() or {}

  titulo = body.get("titulo")
  contenido = body.get("contenido")
  imagen_blog = body.get("imagen_blog")

  if not titulo or not contenido or not imagen_blog:
    return (
        jsonify({"ok": False, "error": "Todos los campos son obligatorios"}),
        400,
    )

  try:

    if "," in imagen_blog:
      imagen_blog = imagen_blog.split(",")[1]

    bytes_imagen = base64.b64decode(imagen_blog)

    contador = db.execute("SELECT MAX(id) FROM BLOGS")
    fila = contador.fetchone()

    ultimo_id = fila[0] if (fila and fila[0] is not None) else 0
    nuevo_numero = ultimo_id + 1
    blog_id = f"BL{nuevo_numero}"

    query = """
            INSERT INTO BLOGS (blog_id, titulo, contenido, imagen_blog)
            VALUES (?, ?, ?, ?)
        """

    db.execute(query, (blog_id, titulo, contenido, bytes_imagen))
    db.commit()

    return (
        jsonify({
            "ok": True,
            "mensaje": "Blog creado exitosamente",
            "blog_id": blog_id,
        }),
        201,
    )

  except Exception as e:
    print("ERROR CRÍTICO EN EL POST:", e)
    return jsonify({"ok": False, "error": str(e)}), 500


@app.delete("/api/blogs/eliminar/<string:blog_id>")
def eliminarBlogs(blog_id):
    verificacion = db.execute("SELECT id FROM BLOGS WHERE blog_id = ?", blog_id)
    existe = verificacion.fetchone()

    if not existe:
        return(
            jsonify({"ok":False, "error":"No existe el blog"}),
            404,
        )
    query="DELETE FROM BLOGS WHERE blog_id = ?"
    db.execute(query, (blog_id))
    db.commit()

    return(
        jsonify({
            "ok":True,
            "mensaje":f"Blog {blog_id} eliminado correctamente",
        }),
        200,
    )