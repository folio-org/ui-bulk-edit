import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  Button,
  TextArea,
} from '@folio/stripes/components';

import { ResetButton } from '@folio/stripes-acq-components';


export const QueryTextArea = ({ queryText, setQueryText, handleQuerySearch }) => {
  const [isDisabled, setIsDisabled] = useState(true);

  useEffect(() => (queryText === '' ? setIsDisabled(true) : setIsDisabled(false)),
    [queryText]);

  const resetButtonHandler = () => setQueryText(prev => ({
    ...prev, queryText: '',
  }));

  const onChangeTextAreaHandler = (event) => setQueryText(prev => ({
    ...prev, queryText: event.target.value,
  }));

  const onSearch = () => {
    setIsDisabled(true);
    handleQuerySearch();
  };

  return (
    <>
      <TextArea
        value={queryText}
        onChange={onChangeTextAreaHandler}
      />
      <Button buttonStyle="primary" fullWidth disabled={isDisabled} onClick={onSearch}>
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
  queryText: PropTypes.string.isRequired,
  setQueryText: PropTypes.func.isRequired,
  handleQuerySearch: PropTypes.func.isRequired,
};
