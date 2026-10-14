from app import app
import api.usuarios, api.carrito, api.productos, api.blogs

if __name__ == '__main__':
    print('DB funcionando')
    app.run(port=3000)