import { Injectable } from '@nestjs/common';
import * as news from '../../../../public/json/news.json';
import * as events from '../../../../public/json/events.json';
import { sortByDate } from '../../utils';

@Injectable()
export class CommonService {
  constructor() {}

  public getNews(lang: string) {
    return news.news
      .map((newsObj) => {
        const title = newsObj.title[lang];
        const templateName = newsObj.templateName[lang];
        return {
          ...newsObj,
          title,
          templateName,
          eventTime: null,
          eventPlace: null,
          type: 'news',
        };
      })
      .sort((itemA, itemB) => sortByDate(itemA.createdAt, itemB.createdAt));
  }

  public getEvents(lang: string) {
    return events.events
      .map((newsObj) => {
        const title = newsObj.title[lang];
        const templateName = newsObj.templateName[lang];
        return { ...newsObj, title, templateName, type: 'event' };
      })
      .sort((itemA, itemB) => sortByDate(itemA.createdAt, itemB.createdAt));
  }

  public getSortedByDateNewsAndEvents(lang: string) {
    const events = this.getEvents(lang);
    const news = this.getNews(lang);

    return [...events, ...news].sort((itemA, itemB) =>
      sortByDate(itemA.createdAt, itemB.createdAt),
    );
  }

  public getEventById(eventId: string, lang: string) {
    return (
      [...this.getEvents(lang), ...this.getNews(lang)].find(
        ({ id }) => id === parseInt(eventId),
      ) || {}
    );
  }
}
