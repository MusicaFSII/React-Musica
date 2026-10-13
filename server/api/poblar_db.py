import os
import sqlite3

def poblar_base_datos():
    base_dir = os.path.dirname(os.path.abspath(__file__))
    db_path = os.path.join(base_dir, '..', 'db', 'datos.db')
    
    db = sqlite3.connect(db_path)
    cursor = db.cursor()

    generos = [
        ('Grunge',),
        ('Alternativo',),
        ('Rock',),
        ('Indie',),
        ('Glam Rock',),
        ('Soul',)
    ]
    
    cursor.executemany(
        'INSERT INTO categorias (nombre_categoria) VALUES (?)', 
        generos
    )
    db.commit()


    cursor.execute('SELECT id_categoria, nombre_categoria FROM categorias')
    cat_map = {nombre: id_cat for id_cat, nombre in cursor.fetchall()}

    vinilos = [
        ('VIN-001', 'Nevermind - Nirvana', 'Álbum clásico del género Grunge.', 32990, 10, '/vinilos/nevermind.jpg', cat_map.get('Grunge'), True, 0.0),
        ('VIN-002', 'OK Computer - Radiohead', 'Álbum icónico de rock alternativo.', 34990, 8, '/vinilos/ok-computer.jpg', cat_map.get('Alternativo'), False, 0.0),
        ('VIN-003', 'Rumours - Fleetwood Mac', 'Obra maestra del rock.', 32990, 12, '/vinilos/rumours.jpg', cat_map.get('Rock'), False, 0.0),
        ('VIN-004', 'The Queen Is Dead - The Smiths', 'Clásico del indie rock.', 29990, 5, '/vinilos/the-queen-is-dead.jpg', cat_map.get('Indie'), True, 0.0),
        ('VIN-005', 'Ziggy Stardust - David Bowie', 'Álbum conceptual de Glam Rock.', 32990, 7, '/vinilos/ziggy-stardust.jpg', cat_map.get('Glam Rock'), True, 0.0),
        ('VIN-006', 'Back to Black - Amy Winehouse', 'Álbum referente del Soul moderno.', 28990, 15, '/vinilos/back-to-black.jpg', cat_map.get('Soul'), True, 0.0)
    ]

    cursor.executemany('''
        INSERT OR IGNORE INTO productos (codigo, nombre, descripcion, precio, stock, imagen_url, categoria_id, en_oferta, porc_oferta)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    ''', vinilos)
    
    db.commit()
    db.close()
    print("¡Base de datos de vinilos poblada con éxito!")

if __name__ == '__main__':
    poblar_base_datos()