export class UserActivityModel {
  id?: number;
  userIP: string;
  visitedPage: string;
  dateTime?: string;
  cookieDetail: string;
  userAgent: string;
  plugins?: string;
  numberOfVisits?: number;
  resolution?: string;
  providerDetail?: string;
  referer: string;
}
