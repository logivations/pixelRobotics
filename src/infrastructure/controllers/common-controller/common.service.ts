import { Injectable } from '@nestjs/common';
import * as news from '../../../../public/json/news.json';
import * as events from '../../../../public/json/events.json';
import { sortByDate } from '../../utils';

@Injectable()
export class CommonService {
  constructor() {}

  public getNews(lang: string) {
    return news.news
      .filter((newsObj) => newsObj.visible)
      .map((newsObj) => {
        const title = newsObj.title[lang];
        const templateName = newsObj.templateName[lang];
        const eventPlace = newsObj.eventPlace.hasOwnProperty(lang) ? newsObj.eventPlace[lang] : newsObj.eventPlace;
        return {
          ...newsObj,
          title,
          templateName,
          eventPlace,
          eventDate: null,
          type: 'news',
        };
      })
      .sort((itemA, itemB) => sortByDate(itemA.createdAt, itemB.createdAt));
  }

  public getEvents(lang: string) {
      return events.events
      .filter((newsObj) => newsObj.visible)
      .map((newsObj) => {
        const title = newsObj.title[lang];
        const templateName = newsObj.templateName[lang];
        const eventTime = newsObj.eventTime[lang];
        const eventPlace = newsObj.eventPlace.hasOwnProperty(lang) ? newsObj.eventPlace[lang] : newsObj.eventPlace;
        return { ...newsObj, title, templateName, eventTime, eventPlace, type: 'event' };
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
