import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  Button,
  TextArea,
} from '@folio/stripes/components';

import { ResetButton } from '@folio/stripes-acq-components';


export const QueryTextArea = ({ queryText, setQueryText, handleQuerySearch }) => {
  const [isSearchBtnDisabled, setIsSearchDisabled] = useState(true);
  const isResetButtonDisabled = queryText === '';

  useEffect(() => {
    const isDisabled = queryText === '';

    setIsSearchDisabled(isDisabled);
  }, [queryText]);

  const resetButtonHandler = () => setQueryText(prev => ({
    ...prev, queryText: '',
  }));

  const onChangeTextAreaHandler = (event) => setQueryText(prev => ({
    ...prev, queryText: event.target.value,
  }));

  const onSearch = () => {
    setIsSearchDisabled(true);
    handleQuerySearch();
  };

  return (
    <>
      <TextArea
        value={queryText}
        onChange={onChangeTextAreaHandler}
      />
      <Button buttonStyle="primary" fullWidth disabled={isSearchBtnDisabled} onClick={onSearch}>
        <FormattedMessage id="ui-bulk-edit.textArea.search" />
      </Button>
      <ResetButton
        label={<FormattedMessage id="ui-bulk-edit.textArea.resetAll" />}
        disabled={isResetButtonDisabled}
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
