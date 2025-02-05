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
import { sortAlphabeticallyComponentLabels } from '../../../../../utils/sortAlphabetically';
import css from '../../../BulkEditPane.css';

export const ActionsRow = ({ fieldsRules, option, actions, onChange }) => {
  const { formatMessage } = useIntl();

  return actions.map((action, actionIndex) => {
    if (!action) return null;

    const filteredActions = fieldsRules
      ? action.actionsList.filter(({ value }) => fieldsRules.availableActions.includes(value))
      : action.actionsList;
    const sortedActions = sortAlphabeticallyComponentLabels(filteredActions, formatMessage);

    return (
      <Fragment key={actionIndex}>
        {/* Render actions select  */}
        <Col xs={2} sm={2} className={css.column}>
          <Select
            dataOptions={sortedActions}
            value={action.name}
            onChange={(e) => onChange({ actionIndex, value: e.target.value, fieldName: ACTION_VALUE_KEY })}
            disabled={filteredActions?.length === 1}
            data-testid={`select-actions-${actionIndex}`}
            aria-label={formatMessage({ id: 'ui-bulk-edit.ariaLabel.actionsSelect' })}
            marginBottom0
            dirty={!!action.name}
          />
        </Col>

        {/* Render value fields only in case if actions selected AND action is not from FINAL_ACTIONS */}
        {action.name && (
          <Col xs={2} sm={2} className={css.column}>
            {!FINAL_ACTIONS.includes(action.name) && (
              <ValuesColumn
                option={option}
                action={action}
                allActions={actions}
                actionIndex={actionIndex}
                onChange={onChange}
              />
            )}

            {/* Render additional actions  */}
            {action.parameters?.length > 0 && (
              <AdditionalActionParameters action={action} actionIndex={actionIndex} onChange={onChange} />
            )}
          </Col>
        )}
      </Fragment>
    );
  });
};
