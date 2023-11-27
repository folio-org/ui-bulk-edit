import { Fragment } from 'react';

import {
  Col,
  Select,
} from '@folio/stripes/components';

import { useIntl } from 'react-intl';
import { FINAL_ACTIONS } from '../../../../../constants';
import { ACTION_VALUE_KEY } from './helpers';
import { ValuesColumn } from './ValuesColumn';
import { AdditionalActions } from './AdditionalActions';

export const ActionsRow = ({ option, actions, onChange }) => {
  const { formatMessage } = useIntl();

  return actions.map((action, actionIndex) => {
    if (!action) return null;

    const collator = new Intl.Collator();

    const sortedActions = action.actionsList.sort((a, b) => {
      if (a.label === formatMessage({ id: 'ui-bulk-edit.actions.placeholder' })) {
        return -1;
      } else if (b.label === formatMessage({ id: 'ui-bulk-edit.actions.placeholder' })) {
        return 1;
      } else {
        return collator.compare(a.label, b.label);
      }
    });
    const renderOptionColumn = () => (
      <Col xs={2} sm={2}>
        <Select
          dataOptions={sortedActions}
          value={action.name}
          onChange={(e) => onChange({ actionIndex, value: e.target.value, fieldName: ACTION_VALUE_KEY })}
          disabled={action.actionsList.length === 1}
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
        {action.name && (
          <AdditionalActions action={action} actionIndex={actionIndex} onChange={onChange} />
        )}

      </Fragment>
    );
  });
};
