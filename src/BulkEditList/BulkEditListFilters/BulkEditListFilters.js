import { useState } from 'react';
import { FormattedMessage } from 'react-intl';

import {
  Button,
  ButtonGroup,
} from '@folio/stripes/components';

import { ListSelect } from './ListSelect/ListSelect';



export const BulkEditListFilters = () => {
  const [criteria, setCriteria] = useState('identifier');



  const renderIdentifierButton = () => {
    return (
      <Button
        buttonStyle={criteria === 'identifier' ? 'primary' : 'default'}
        onClick={() => { setCriteria('identifier'); }}
      >
        <FormattedMessage id="ui-bulk-edit.list.filters.identifier" />
      </Button>
    );
  };

  const renderQueryButton = () => {
    return (
      <Button
        buttonStyle={criteria === 'query' ? 'primary' : 'default'}
        onClick={() => { setCriteria('query'); }}
      >
        <FormattedMessage id="ui-bulk-edit.list.filters.query" />
      </Button>
    );
  };

  return (
    <>
      <ButtonGroup fullWidth>
        {renderIdentifierButton()}
        {renderQueryButton()}
      </ButtonGroup>
      <ListSelect />
    </>
  );
};
