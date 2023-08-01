// enum es un diccionario que existe dentro de NODE y librerias.
const enumErrors = {
  ROUTING_ERROR: 1, // este seria error de routeo.
  INVALID_TYPE_ERROR: 2, // falta algun valor en el req.body de user.
  DATABASE_ERROR: 3, // este seria error de base de datos
  INVALID_PARAM: 4, //este seria para error de parametros.
};

export default enumErrors;
