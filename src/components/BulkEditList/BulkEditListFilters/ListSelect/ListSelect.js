import PropTypes from 'prop-types';
import { FormattedMessage, useIntl } from 'react-intl';

import { Select } from '@folio/stripes-acq-components';

import { identifierOptions } from '../../../../constants/optionsRecordIdentifiers';

export const ListSelect = ({ onSelectIdentifier }) => {
  const intl = useIntl();

  const options = identifierOptions.map((el) => ({
    value: el.value,
    label: intl.formatMessage({ id: el.label }),
    disabled: el.disabled,
  }));

  return (
    <Select
      dataOptions={options}
      arial-label={intl.formatMessage({ id: 'ui-bulk-edit.list.filters.recordIdentifier' })}
      label={<FormattedMessage id="ui-bulk-edit.list.filters.recordIdentifier" />}
      defaultValue={options[0].value}
      onChange={e => onSelectIdentifier(e.target.value)}
    />
  );
};

ListSelect.propTypes = {
  onSelectIdentifier: PropTypes.func.isRequired,
};
