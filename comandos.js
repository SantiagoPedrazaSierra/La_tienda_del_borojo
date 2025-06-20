// INSERCION

// 1.Insertar un nuevo producto llamado "Chocolatina de borojó", categoría "Snack", con precio 4000, stock 35, y tags ["dulce", "energía"].

db.productos.insertOne({ "_id": 11, "nombre": "Chocolatina de borojó", "categoria": "Snack", "precio": 4000, "stock": 35, "tags": ["dulce", "energía"] })

// 2.Insertar un nuevo cliente que se llama "Mario Mendoza", con correo "mario@email.com", sin compras, y preferencias "energético" y "natural".

db.clientes.insertOne({ "_id": 11, "nombre": "Mario Mendoza", "email": "mario@email.com",  "preferencias": ["energético", "natural"] })

// LECTURA

// 1. Consultar todos los productos que tengan stock mayor a 20 unidades.

db.productos.find({stock:{$gt: 20}})

// 2. Encontrar los clientes que no han comprado aún ningún producto.

db.clientes.find({compras: null})

// ACTUALIZACION

// 1.Aumentar en 10 unidades el stock del producto "Borojó deshidratado".

db.productos.updateOne({nombre: "Borojó deshidratado"}, {$inc: {stock: 10}})

// 2.Añadir el tag "bajo azúcar" a todos los productos de la categoría "Bebida".

db.productos.updateMany({categoria: "Bebida"}, {$push:{tags: "bajo azúcar"}})
