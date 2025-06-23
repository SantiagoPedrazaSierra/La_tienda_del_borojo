# 🥭 La tienda del borojó


##  Listado de ejercicios desarrollados

###  INSERCIONES

```js
// 1. Insertar un nuevo producto.
db.productos.insertOne({
  _id: 11,
  nombre: "Chocolatina de borojó",
  categoria: "Snack",
  precio: 4000,
  stock: 35,
  tags: ["dulce", "energía"]
})

// 2. Insertar un nuevo cliente.
db.clientes.insertOne({
  _id: 11,
  nombre: "Mario Mendoza",
  email: "mario@email.com",
  preferencias: ["energético", "natural"]
})
```

---

###  LECTURAS

```js
// 1. Productos con stock mayor a 20.
db.productos.find({ stock: { $gt: 20 } })

// 2. Clientes sin compras.
db.clientes.find({ compras: null })
```

---

###  ACTUALIZACIONES

```js
// 1. Aumentar stock en 10 unidades.
db.productos.updateOne(
  { nombre: "Borojó deshidratado" },
  { $inc: { stock: 10 } }
)

// 2. Agregar tag "bajo azúcar" a categoría Bebida.
db.productos.updateMany(
  { categoria: "Bebida" },
  { $push: { tags: "bajo azúcar" } }
)
```

---

###  ELIMINACIONES

```js
// 1. Eliminar cliente por correo.
db.clientes.deleteOne({ email: "juan@email.com" })

// 2. Eliminar productos con stock menor a 5.
db.productos.deleteMany({ stock: { $lt: 5 } })
```

---

###  EXPRESIONES REGULARES

```js
// 1. Nombre que empiece por "Boro".
db.productos.find({ nombre: /^Boro/ })

// 2. Nombre que contenga "con".
db.productos.find({ nombre: /con/ })

// 3. Clientes con "z" en el nombre.
db.clientes.find({ nombre: /z/i })
```

---

###  CONSULTAS CON ARRAYS

```js
// 1. Clientes con preferencia "natural".
db.clientes.find({ preferencias: "natural" })

// 2. Productos con tags "natural" y "orgánico".
db.productos.find({ tags: { $all: ["natural", "orgánico"] } })

// 3. Productos con más de un tag.
db.productos.find({
  $expr: { $gt: [{ $size: "$tags" }, 1] }
})
```

---

###  AGGREGATION FRAMEWORK

```js
// 1. Productos más vendidos.
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

// 2. Clientes por cantidad de compras.
db.ventas.aggregate([
  {
    $group: {
      _id: "$clienteId",
      cantidad_compras: { $sum: 1 }
    }
  },
  { $sort: { cantidad_compras: -1 } }
])

// 3. Total de ventas por mes.
db.ventas.aggregate([
  {
    $group: {
      _id: { mes: { $month: "$fecha" } },
      total_ventas: { $sum: "$total" }
    }
  },
  { $sort: { "_id.mes": 1 } }
])

// 4. Promedio de precios por categoría.
db.productos.aggregate([
  {
    $group: {
      _id: "$categoria",
      promedio_precio: { $avg: "$precio" }
    }
  },
  { $sort: { promedio_precio: -1 } }
])

// 5. Top 3 productos con más stock.
db.productos.find().sort({ stock: -1 }).limit(3)
```

---

###  FUNCIONES EN `system.js`

```js
// 1. Calcular descuento.
db.system.js.insertOne({
  _id: "calcularDescuento",
  value: function (precio, porcentaje) {
    return precio - (precio * porcentaje / 100);
  }
})

// 2. Saber si un cliente es activo.
db.system.js.insertOne({
  _id: "clienteActivo",
  value: function (idCliente) {
    var cliente = db.clientes.findOne({ _id: idCliente });
    return cliente && cliente.compras && cliente.compras.length > 3;
  }
})

// 3. Verificar stock suficiente.
db.system.js.insertOne({
  _id: "verificarStock",
  value: function (productoId, cantidadDeseada) {
    var producto = db.productos.findOne({ _id: productoId });
    return producto && producto.stock >= cantidadDeseada;
  }
})
```

---

###  TRANSACCIONES (en sintaxis simplificada tipo system.js)

```js
// Venta
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

// Entrada inventario
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

// Devolución
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
```

---

### 🔢 ÍNDICES

```js
// 1. Índice en nombre del producto.
db.productos.createIndex({ nombre: 1 })

// 2. Índice compuesto por categoría y precio.
db.productos.createIndex({ categoria: 1, precio: 1 })

// 3. Índice en el correo del cliente.
db.clientes.createIndex({ email: 1 }, { unique: true })

// 4. Verificar uso del índice.
db.productos.find({ nombre: "Borojó fresco" }).explain("executionStats")
```
