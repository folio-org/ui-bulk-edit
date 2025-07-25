import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { useContext } from 'react';

import {
  Headline,
  Accordion,
} from '@folio/stripes/components';

import { RootContext } from '../../../../context/RootContext';
import { useSearchParams } from '../../../../hooks';
import { InAppForm } from './InAppForm/InAppForm';


export const BulkEditInApp = ({ areAllOptionsLoaded, options, fields, setFields }) => {
  const { title } = useContext(RootContext);
  const { currentRecordType, approach } = useSearchParams();

  return (
    <>
      <Headline size="large" margin="medium">
        {title}
      </Headline>
      <Accordion
        label={<FormattedMessage id="ui-bulk-edit.layer.title" />}
      >
        <InAppForm
          fields={fields}
          setFields={setFields}
          options={options}
          approach={approach}
          recordType={currentRecordType}
          loading={!areAllOptionsLoaded}
        />
      </Accordion>
    </>
  );
};

BulkEditInApp.propTypes = {
  areAllOptionsLoaded: PropTypes.bool.isRequired,
  options: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  fields: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  setFields: PropTypes.func.isRequired,
};
