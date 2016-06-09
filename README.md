# EDCA

El Estandar de Datos de Contrataciones Abiertas (EDCA) disponibiliza datos y documentos en todas las etapas del proceso de contratación al definir un modelo de datos común.

## Instalación

Es necesario contar con `node`, `npm`, `PostgreSQL` y `mongoDB` instalados. Y asegurarse de que postgre y mongo están corriendo.

Los datos de acceso a mongo, por default son: `mongodb://localhost/passport'`. Para configurarlos, edita: `db.js`

Los datos de acceso a postgre, por default son: `postgres://tester:test@localhost/edca`, Para configurarlos, edita en `routes/index.js` la siguiente línea: `var edca_db  = pgp("postgres://tester:test@localhost/edca");`

Y al principio de scripts/compranet si vas a utilizar el script de importación de datos de compranet.

Para importar el esquema de la base de datos postgre, haz:

`psql -U tester edca < sql/edca.sql`

Y para grear usuarios del sistema, haz:

`scripts/useradm add elusuario elpass`


Instala las dependencias con:

`npm install`


Ejecuta el servidor con:

`bin/www`
