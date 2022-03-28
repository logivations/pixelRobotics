import { FastifyRequest } from 'fastify';

export const getLangFromCookie = (request: FastifyRequest) => {
  const cookiesLang = request.cookies['lang'];
  const headerLang = request.headers['accept-language'].includes('de')
    ? 'DE_de'
    : 'EN_en';
  const finallyLang = cookiesLang || headerLang;
  const queryLang = request.query['lang'];
  if (queryLang) {
    if (queryLang.toLowerCase().includes('de')) return 'DE_de';
    if (queryLang.toLowerCase().includes('en')) return 'EN_en';
  }
  return finallyLang;
};

export const getViewNameByLang = (request: FastifyRequest, baseViewName) => {
  const prefix = getLangFromCookie(request);
  return `${prefix}/${baseViewName}`;
};

export const sortByDate = (dateA, dateB) => {
  return new Date(dateA).getTime() - new Date(dateB).getTime();
};
