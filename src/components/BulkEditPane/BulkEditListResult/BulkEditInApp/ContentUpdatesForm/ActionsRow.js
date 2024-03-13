import { Fragment } from 'react';

import {
  Col,
  Select,
} from '@folio/stripes/components';

import { useIntl } from 'react-intl';
import { FINAL_ACTIONS } from '../../../../../constants';
import { ACTION_VALUE_KEY } from './helpers';
import { ValuesColumn } from './ValuesColumn';
import { AdditionalActionParameters } from './AdditionalActionParameters';
import { sortAlphabeticallyActions } from '../../../../../utils/sortAlphabetically';

export const ActionsRow = ({ option, actions, onChange }) => {
  const { formatMessage } = useIntl();

  return actions.map((action, actionIndex) => {
    if (!action) return null;

    const sortedActions = sortAlphabeticallyActions(action.actionsList, formatMessage({ id: 'ui-bulk-edit.actions.placeholder' }));
    const renderOptionColumn = () => (
      <Col xs={2} sm={2}>
        <Select
          dataOptions={sortedActions}
          value={action.name}
          onChange={(e) => onChange({ actionIndex, value: e.target.value, fieldName: ACTION_VALUE_KEY })}
          disabled={action.actionsList?.length === 1}
          data-testid={`select-actions-${actionIndex}`}
          aria-label={formatMessage({ id: 'ui-bulk-edit.ariaLabel.actionsSelect' })}
        />
      </Col>
    );

    return (
      <Fragment key={actionIndex}>
        {renderOptionColumn()}

        {/* Render value fields only in case if actions selected AND action is not from FINAL_ACTIONS */}
        {action.name && !FINAL_ACTIONS.includes(action.name) && (
          <ValuesColumn
            option={option}
            action={action}
            allActions={actions}
            actionIndex={actionIndex}
            onChange={onChange}
          />
        )}

        {/* Render additional actions  */}
        {action.name && !actions.parameters?.length && (
          <AdditionalActionParameters action={action} actionIndex={actionIndex} onChange={onChange} />
        )}
      </Fragment>
    );
  });
};
