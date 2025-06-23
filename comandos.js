
// INSERCIONES


// 1. Insertar un nuevo producto llamado "Chocolatina de borojó", categoría "Snack", con precio 4000, stock 35, y tags ["dulce", "energía"].
db.productos.insertOne({
    _id: 11,
    nombre: "Chocolatina de borojó",
    categoria: "Snack",
    precio: 4000,
    stock: 35,
    tags: ["dulce", "energía"]
})

// 2. Insertar un nuevo cliente que se llama "Mario Mendoza", con correo "mario@email.com", sin compras, y preferencias "energético" y "natural".
db.clientes.insertOne({
    _id: 11,
    nombre: "Mario Mendoza",
    email: "mario@email.com",
    preferencias: ["energético", "natural"]
})



// LECTURAS


// 1. Consultar todos los productos que tengan stock mayor a 20 unidades.
db.productos.find({ stock: { $gt: 20 } })

// 2. Encontrar los clientes que no han comprado aún ningún producto.
db.clientes.find({ compras: null })



// ACTUALIZACIONES


// 1. Aumentar en 10 unidades el stock del producto "Borojó deshidratado".
db.productos.updateOne(
    { nombre: "Borojó deshidratado" },
    { $inc: { stock: 10 } }
)

// 2. Añadir el tag "bajo azúcar" a todos los productos de la categoría "Bebida".
db.productos.updateMany(
    { categoria: "Bebida" },
    { $push: { tags: "bajo azúcar" } }
)



// ELIMINACIONES


// 1. Eliminar el cliente que tenga el correo "juan@email.com".
db.clientes.deleteOne({ email: "juan@email.com" })

// 2. Eliminar todos los productos con stock menor a 5.
db.productos.deleteMany({ stock: { $lt: 5 } })



// EXPRESIONES REGULARES


// 1. Buscar productos cuyo nombre empiece por "Boro".
db.productos.find({ nombre: /^Boro/ })

// 2. Encontrar productos cuyo nombre contenga la palabra "con".
db.productos.find({ nombre: /con/ })

// 3. Encontrar clientes cuyo nombre tenga la letra "z" (insensible a mayúsculas/minúsculas).
db.clientes.find({ nombre: /z/i })



// CONSULTAS CON ARRAYS


// 1. Buscar clientes que tengan "natural" en sus preferencias.
db.clientes.find({ preferencias: "natural" })

// 2. Encontrar productos que tengan al menos los tags "natural" y "orgánico".
db.productos.find({ tags: { $all: ["natural", "orgánico"] } })

// 3. Listar productos que tienen más de un tag.
db.productos.find({
    $expr: { $gt: [{ $size: "$tags" }, 1] }
})



// AGGREGATION FRAMEWORK


// 1. Mostrar un listado de los productos más vendidos.
db.ventas.aggregate([
    { $unwind: "$productos" },
    {
        $group: {
            _id: "$productos.productoId",
            total_vendido: { $sum: "$productos.cantidad" }
        }
    },
    { $sort: { total_vendido: -1 } }
])

// 2. Agrupar clientes por cantidad de compras realizadas.
db.ventas.aggregate([
    {
        $group: {
            _id: "$clienteId",
            cantidad_compras: { $sum: 1 }
        }
    },
    { $sort: { cantidad_compras: -1 } }
])

// 3. Mostrar el total de ventas por mes.
db.ventas.aggregate([
    {
        $group: {
            _id: { mes: { $month: "$fecha" } },
            total_ventas: { $sum: "$total" }
        }
    },
    { $sort: { "_id.mes": 1 } }
])

// 4. Calcular el promedio de precios por categoría de producto.
db.productos.aggregate([
    {
        $group: {
            _id: "$categoria",
            promedio_precio: { $avg: "$precio" }
        }
    },
    { $sort: { promedio_precio: -1 } }
])

// 5. Mostrar los 3 productos con mayor stock.
db.productos.find().sort({ stock: -1 }).limit(3)



// FUNCIONES EN system.js


// 1. Función para calcular descuento.
db.system.js.insertOne({
    _id: "calcularDescuento",
    value: function (precio, porcentaje) {
        return precio - (precio * porcentaje / 100);
    }
})

// 2. Función para saber si un cliente está activo.
db.system.js.insertOne({
    _id: "clienteActivo",
    value: function (idCliente) {
        var cliente = db.clientes.findOne({ _id: idCliente });
        return cliente && cliente.compras && cliente.compras.length > 3;
    }
})

// 3. Función para verificar stock.
db.system.js.insertOne({
    _id: "verificarStock",
    value: function (productoId, cantidadDeseada) {
        var producto = db.productos.findOne({ _id: productoId });
        return producto && producto.stock >= cantidadDeseada;
    }
})



// TRANSACCIONES


// 1. Simular una venta (restar stock + agregar venta).
session = db.getMongo().startSession();
session.startTransaction();

try {
    const ventas = session.getDatabase("la_tienda").ventas;
    const productos = session.getDatabase("la_tienda").productos;

    productos.updateOne({ _id: 1 }, { $inc: { stock: -1 } });
    ventas.insertOne({
        _id: 11,
        clienteId: 1,
        productos: [{ productoId: 1, cantidad: 1 }],
        fecha: new Date(),
        total: 5000
    });

    session.commitTransaction();
} catch (e) {
    session.abortTransaction();
}

// 2. Simular entrada de inventario (aumentar stock + insertar lote).
session = db.getMongo().startSession();
session.startTransaction();

try {
    const inventario = session.getDatabase("la_tienda").inventario;
    const productos = session.getDatabase("la_tienda").productos;

    inventario.insertOne({
        _id: 11,
        productoId: 1,
        lote: "L011",
        cantidad: 50,
        entrada: new Date()
    });

    productos.updateOne({ _id: 1 }, { $inc: { stock: 50 } });

    session.commitTransaction();
} catch (e) {
    session.abortTransaction();
}

// 3. Devolución (aumentar stock + eliminar venta).
session = db.getMongo().startSession();
session.startTransaction();

try {
    const ventas = session.getDatabase("la_tienda").ventas;
    const productos = session.getDatabase("la_tienda").productos;

    productos.updateOne({ _id: 1 }, { $inc: { stock: 1 } });
    ventas.deleteOne({ _id: 11 });

    session.commitTransaction();
} catch (e) {
    session.abortTransaction();
}


// ÍNDICES

// 1. Crear índice en nombre del producto.
db.productos.createIndex({ nombre: 1 })

// 2. Índice compuesto por categoría y precio.
db.productos.createIndex({ categoria: 1, precio: 1 })

// 3. Índice en el correo de los clientes.
db.clientes.createIndex({ email: 1 }, { unique: true })

// 4. Verificar uso de índice con explain.
db.productos.find({ nombre: "Borojó fresco" }).explain("executionStats")
