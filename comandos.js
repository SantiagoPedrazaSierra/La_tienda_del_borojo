// INSERCION

// 1.Insertar un nuevo producto llamado "Chocolatina de borojó", categoría "Snack", con precio 4000, stock 35, y tags ["dulce", "energía"].

db.productos.insertOne({ "_id": 11, "nombre": "Chocolatina de borojó", "categoria": "Snack", "precio": 4000, "stock": 35, "tags": ["dulce", "energía"] })

// 2.Insertar un nuevo cliente que se llama "Mario Mendoza", con correo "mario@email.com", sin compras, y preferencias "energético" y "natural".

db.clientes.insertOne({ "_id": 11, "nombre": "Mario Mendoza", "email": "mario@email.com",  "preferencias": ["energético", "natural"] })