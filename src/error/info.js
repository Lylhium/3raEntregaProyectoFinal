import enumErrors from "../services/errors/eNums.js";

export default (error, req, res, next) => {
  console.error(error.cause);
  switch (error.code) {
    case enumErrors.ROUTING_ERROR:
      res.send({ error: error.name });
      break;
    case enumErrors.INVALID_TYPE_ERROR:
      res.send({ error: error.name });
      break;
    case enumErrors.DATABASE_ERROR:
      res.send({ error: error.name });
      break;
    case enumErrors.INVALID_PARAM:
      res.send({ error: error.name });
      break;
    default:
      res.send({ error: "Error desconocido" });
      break;
  }
};
