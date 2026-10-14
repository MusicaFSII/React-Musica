import {createContext, useState, useEffect } from "react";

export const CarritoContext = createContext();

export function carrito({children}){
    const[carrito, setCarrito] = useState(()=>{
        const guardado = localStorage.getItem('carrito');
        return guardado ? JSON.parse(guardado):[];
    });

    useEffect(()=>{
        localStorage.setItem('carrito', JSON.stringify(carrito));
    }, [carrito]);

    const agregarProducto = (producto) =>{
        setCarrito((prev)=>{
            const existe = prev.find((item)=>item.id === producto.id);
            if(existe){
                return prev.map((item)=>
                item.id === producto.id ? {...item, cantidad: item.cantidad + 1} : item);
            }
            return [...prev, {...producto, cantidad:1}];
        });
    };

    const eliminarProducto = (id) =>{
        setCarrito((prev)=> prev.filter((item)=>item.id !== id));
    }

    const totalProductos = carrito.reduce((acc, item)=> acc + item.cantidad, 0);

    const costoTotal = carrito.reduce((acc, item)=>acc+item.precio * item.cantidad, 0)

    const limpiarCarrito = () => setCarrito([]);

    return (
    <CarritoContext.Provider value={{
      carrito,
      agregarProducto,
      eliminarProducto,
      totalProductos,
      costoTotal,
      limpiarCarrito
    }}>
      {children}
    </CarritoContext.Provider>
    )
  


}
