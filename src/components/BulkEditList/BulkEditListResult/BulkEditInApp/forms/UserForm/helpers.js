import {
  controlTypes,
  EMAIL_ACTIONS_FIRST,
  EMAIL_ACTIONS_SECOND,
  EXPIRATION_ACTIONS, OPTIONS,
  PATRON_ACTIONS,
} from '../../../../../../constants';

export const getDefaultActions = (option, formatMessage) => {
  const actionsListFirst = EMAIL_ACTIONS_FIRST(formatMessage);
  const actionsListSecond = EMAIL_ACTIONS_SECOND(formatMessage);
  const patronActionsList = PATRON_ACTIONS(formatMessage);
  const expirationActionsList = EXPIRATION_ACTIONS(formatMessage);

  switch (option) {
    case OPTIONS.EMAIL_ADDRESS:
      return [
        {
          actionsList: actionsListFirst,
          type: controlTypes.INPUT,
          name: actionsListFirst[0].value,
          value: '',
        },
        {
          actionsList: actionsListSecond,
          type: controlTypes.INPUT,
          name: actionsListSecond[0].value,
          value: '',
        },
      ];
    case OPTIONS.PATRON_GROUP:
      return [{
        actionsList: patronActionsList,
        type: controlTypes.SELECT,
        name: patronActionsList[0].value,
        value: '',
      }];
    case OPTIONS.EXPIRATION_DATE:
      return [{
        actionsList: expirationActionsList,
        type: controlTypes.DATE,
        name: expirationActionsList[0].value,
        value: '',
      }];
    default:
      return [];
  }
};
