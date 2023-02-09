import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  Button,
  TextArea,
} from '@folio/stripes/components';

import { ResetButton } from '@folio/stripes-acq-components';


export const QueryTextArea = ({ queryText, setQueryText, handleQuerySearch, disabled }) => {
  const [isSearchBtnDisabled, setIsSearchDisabled] = useState(true);
  const isSearchFieldEmpty = !queryText.length;

  useEffect(() => {
    setIsSearchDisabled(isSearchFieldEmpty);
  }, [isSearchFieldEmpty, queryText]);

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
        disabled={disabled}
      />
      <Button buttonStyle="primary" fullWidth disabled={isSearchBtnDisabled || disabled} onClick={onSearch}>
        <FormattedMessage id="ui-bulk-edit.textArea.search" />
      </Button>
      <ResetButton
        label={<FormattedMessage id="ui-bulk-edit.textArea.resetAll" />}
        disabled={isSearchFieldEmpty}
        reset={resetButtonHandler}
      />
    </>
  );
};

QueryTextArea.propTypes = {
  queryText: PropTypes.string.isRequired,
  setQueryText: PropTypes.func.isRequired,
  handleQuerySearch: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
};
