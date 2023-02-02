import moment from 'moment';

export const BASE_DATE_FORMAT = 'YYYY-MM-DD';
export const COLUMNS_DATE_FORMAT = 'MM/DD/YYYY, HH:mm A';
export const getFormattedFilePrefixDate = () => moment().format(BASE_DATE_FORMAT);
export const getFormattedColumnsDate = (date) => moment(date).format(COLUMNS_DATE_FORMAT);

