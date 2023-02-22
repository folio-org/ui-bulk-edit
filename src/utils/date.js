import moment from 'moment';

export const BASE_DATE_FORMAT = 'YYYY-MM-DD';
export const getFormattedFilePrefixDate = () => moment().format(BASE_DATE_FORMAT);
