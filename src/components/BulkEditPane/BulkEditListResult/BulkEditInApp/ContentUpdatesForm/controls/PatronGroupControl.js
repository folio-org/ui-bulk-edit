import React from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';

import { Select } from '@folio/stripes/components';

import { sortAlphabeticallyWithoutGroups } from '../../../../../../utils/sortAlphabetically';
import { FIELD_VALUE_KEY, getLabelByValue } from '../helpers';
import { usePatronGroup } from '../../../../../../hooks/api';
import { CAPABILITIES } from '../../../../../../constants';
import { useSearchParams } from '../../../../../../hooks';


export const PatronGroupControl = ({ actionValue, actionIndex, onChange }) => {
  const { formatMessage } = useIntl();
  const { currentRecordType } = useSearchParams();

  const isUserCapability = currentRecordType === CAPABILITIES.USER;

  const { userGroups } = usePatronGroup({ enabled: isUserCapability });

  const groups = Object.values(userGroups).reduce(
    (acc, { id, group, desc }) => {
      const description = desc ? `(${desc})` : '';
      const groupObject = {
        value: id,
        label: `${group} ${description}`,
      };

      acc.push(groupObject);

      return acc;
    }, [{
      value: '',
      label: formatMessage({ id: 'ui-bulk-edit.layer.selectPatronGroup' }),
    }]
  );
  const patronGroups = sortAlphabeticallyWithoutGroups(groups, formatMessage({ id: 'ui-bulk-edit.layer.selectPatronGroup' }));
  const title = getLabelByValue(patronGroups, actionValue);

  return (
    <div title={title}>
      <Select
        dataOptions={patronGroups}
        value={actionValue}
        onChange={e => onChange({ actionIndex, value: e.target.value, fieldName: FIELD_VALUE_KEY })}
        data-testid={`select-patronGroup-${actionIndex}`}
        aria-label={formatMessage({ id: 'ui-bulk-edit.ariaLabel.patronGroupSelect' })}
        marginBottom0
        dirty={!!actionValue}
      />
    </div>
  );
};

PatronGroupControl.propTypes = {
  actionValue: PropTypes.string,
  actionIndex: PropTypes.number,
  onChange: PropTypes.func,
};
