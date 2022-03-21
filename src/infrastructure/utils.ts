import { FastifyRequest } from 'fastify';

export const getLangFromCookie = (request: FastifyRequest) => {
  const lang = request.cookies['lang'];
  return lang || 'EN_en';
};

export const getViewNameByLang = (request: FastifyRequest, baseViewName) => {
  const prefix = getLangFromCookie(request);
  return `${prefix}/${baseViewName}`;
};

export const sortByDate = (dateA, dateB) => {
  return new Date(dateA).getTime() - new Date(dateB).getTime();
};
