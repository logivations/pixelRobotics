import { FastifyRequest } from "fastify";

export const getViewNameByLang = (request: FastifyRequest, baseViewName) => {
  const lang = request.cookies['lang'];
  const prefix = lang && lang === "DE_de" ? 'de' : 'en';

  return `${prefix}.${baseViewName}`;
};