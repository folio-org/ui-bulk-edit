import moment from 'moment';

export const baseFormat = 'YYYY-MM-DD';
export const baseFormatWithTime = `${baseFormat} HH:mm:ss`;

export const dateNow = moment().format(baseFormat);
