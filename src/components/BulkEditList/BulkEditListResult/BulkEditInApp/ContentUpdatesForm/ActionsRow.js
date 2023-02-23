import { Fragment } from 'react';
import { useIntl } from 'react-intl';

import { Col, Datepicker, Select, Selection, TextField } from '@folio/stripes/components';
import { LocationLookup, LocationSelection } from '@folio/stripes/smart-components';

import { usePatronGroup, useLoanTypes } from '../../../../../hooks/api';
import { ACTIONS, CONTROL_TYPES, getItemStatusOptions } from '../../../../../constants';

import {
  ACTION_VALUE_KEY,
  FIELD_VALUE_KEY,
  TEMPORARY_LOCATIONS,
} from './helpers';

export const ActionsRow = ({ option, actions, onChange }) => {
  const intl = useIntl();

  const { userGroups } = usePatronGroup();
  const { loanTypes, isLoanTypesLoading } = useLoanTypes();

  const statuses = getItemStatusOptions(intl.formatMessage);

  const patronGroups = Object.values(userGroups).reduce(
    (acc, { id, group, desc }) => {
      const description = desc ? `(${desc})` : '';
      const groupObject = {
        value: id,
        label: `${group} ${description}`,
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

  return actions.map((action, actionIndex) => {
    if (!action) return null;

    return (
      <Fragment key={actionIndex}>
        <Col xs={2} sm={2}>
          <Select
            dataOptions={action.actionsList}
            value={action.name}
            onChange={(e) => onChange({ actionIndex, value: e.target.value, fieldName: ACTION_VALUE_KEY })}
            disabled={action.actionsList.length === 1}
            data-testid={`select-actions-${actionIndex}`}
          />
        </Col>
        {/* Render value fields only in case if actions selected AND actions is not CLEAR_FIELD */}
        {action.name && action.name !== ACTIONS.CLEAR_FIELD && (
          <Col xs={2} sm={2}>

            {action.type === CONTROL_TYPES.INPUT && (
              <TextField
                value={action.value}
                onChange={e => onChange({ actionIndex, value: e.target.value, fieldName: FIELD_VALUE_KEY })}
                data-testid={`input-email-${actionIndex}`}
              />
            )}

            {action.type === CONTROL_TYPES.PATRON_GROUP_SELECT && (
              <Select
                dataOptions={patronGroups}
                value={action.value}
                onChange={e => onChange({ actionIndex, value: e.target.value, fieldName: FIELD_VALUE_KEY })}
                data-testid={`select-patronGroup-${actionIndex}`}
              />
            )}

            {action.type === CONTROL_TYPES.DATE && (
              <Datepicker
                value={action.value}
                onChange={e => onChange({ actionIndex, value: e.target.value, fieldName: FIELD_VALUE_KEY })}
                data-testid={`dataPicker-experation-date-${actionIndex}`}
              />
            )}

            {action.type === CONTROL_TYPES.LOCATION && (
              <>
                <LocationSelection
                  value={action.value}
                  onSelect={location => onChange({ actionIndex, value: location.id, fieldName: FIELD_VALUE_KEY })}
                  placeholder={intl.formatMessage({ id: 'ui-bulk-edit.layer.selectLocation' })}
                  data-test-id={`textField-${actionIndex}`}
                />
                <LocationLookup
                  marginBottom0
                  isTemporaryLocation={TEMPORARY_LOCATIONS.includes(option)}
                  onLocationSelected={(location) => onChange({
                    actionIndex, value: location.id, fieldName: FIELD_VALUE_KEY,
                  })}
                  data-testid={`locationLookup-${actionIndex}`}
                />
              </>
            )}

            {action.type === CONTROL_TYPES.STATUS_SELECT && (
              <Select
                dataOptions={statuses}
                value={action.value}
                onChange={e => onChange({ actionIndex, value: e.target.value, fieldName: FIELD_VALUE_KEY })}
                data-testid={`select-statuses-${actionIndex}`}
              />
            )}

            {action.type === CONTROL_TYPES.LOAN_TYPE && (
              <Selection
                id="loanType"
                value={action.value}
                loading={isLoanTypesLoading}
                onChange={value => onChange({ actionIndex, value, fieldName: FIELD_VALUE_KEY })}
                placeholder={intl.formatMessage({ id: 'ui-bulk-edit.layer.selectLoanType' })}
                dataOptions={loanTypes}
              />
            )}
          </Col>
        )}

      </Fragment>
    );
  });
};
