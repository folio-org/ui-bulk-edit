import { useIntl } from 'react-intl';
import { Col, Datepicker, Select, TextField } from '@folio/stripes/components';
import { Fragment } from 'react';
import moment from 'moment';
import { usePatronGroup } from '../../../../../../API';
import { controlTypes } from '../../../../../../constants';

export const ActionsRow = ({ actions, onChange }) => {
  const intl = useIntl();
  const { userGroups } = usePatronGroup();

  const patronGroups = Object.values(userGroups).reduce(
    (acc, { group, desc = '' }) => {
      const groupObject = {
        value: group,
        label: `${group} (${desc})`,
      };

      acc.push(groupObject);

      return acc;
    },
    [
      {
        value: '',
        label: intl.formatMessage({ id: 'ui-bulk-edit.layer.selectPatronGroup' }),
      },
    ],
  );

  const DATE_RFC2822 = 'YYYY-MM-DD HH:mm:ss';
  const templateString = (value) => `${moment(`${value}`).format(DATE_RFC2822)}.000Z`;

  return actions.map((action, actionIndex) => (
    <Fragment key={actionIndex}>
      <Col xs={2} sm={2}>
        <Select
          dataOptions={action.actionsList}
          value={action.name}
          onChange={(e) => onChange({ actionIndex, actionValue: e.target.value, actionFieldName: 'name' })}
          disabled={action.actionsList.length === 1}
          data-testid={`select-actions-${actionIndex}`}
        />
      </Col>
      <Col xs={2} sm={2}>
        {action.type === controlTypes.INPUT && (
          <TextField
            value={action.value}
            onChange={e => onChange({ actionIndex, actionValue: e.target.value, actionFieldName: 'value' })}
            data-testid={`input-email-${actionIndex}`}
          />
        )}
        {action.type === controlTypes.SELECT && (
          <Select
            dataOptions={patronGroups}
            value={action.value}
            onChange={e => onChange({ actionIndex, actionValue: e.target.value, actionFieldName: 'value' })}
            data-testid={`select-patronGroup-${actionIndex}`}
          />
        )}
        {action.type === controlTypes.DATE && (
          <Datepicker
            value={action.value}
            onChange={e => onChange({ actionIndex, actionValue: templateString(e.target.value), actionFieldName: 'value' })}
            data-testid={`dataPicker-experation-date-${actionIndex}`}
          />
        )}
      </Col>
    </Fragment>
  ));
};
