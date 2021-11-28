import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  Button,
  TextArea,
} from '@folio/stripes/components';

import { ResetButton } from '@folio/stripes-acq-components';


export const QueryTextArea = ({ filters, setQueryText }) => {
  const [isDisabled, setIsDisabled] = useState(true);

  useEffect(() => (filters.queryText === '' ? setIsDisabled(true) : setIsDisabled(false)),
    [filters.queryText]);

  const resetButtonHandler = () => {
    setQueryText({
      ...filters, queryText: '',
    });
  };

  const onChangeTextAreaHandler = (event) => setQueryText({
    ...filters, queryText: event.target.value,
  });

  return (
    <>
      <TextArea
        value={filters.queryText}
        onChange={onChangeTextAreaHandler}
      />
      <Button buttonStyle="primary" fullWidth disabled={isDisabled}>
        <FormattedMessage id="ui-bulk-edit.textArea.search" />
      </Button>
      <ResetButton
        label={<FormattedMessage id="ui-bulk-edit.textArea.resetAll" />}
        disabled={isDisabled}
        reset={resetButtonHandler}
      />
    </>
  );
};

QueryTextArea.propTypes = {
  filters: PropTypes.object.isRequired,
  setQueryText: PropTypes.func.isRequired,
};
