import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { useContext } from 'react';

import {
  Headline,
  Accordion,
  Loading,
  Layout,
} from '@folio/stripes/components';

import { BulkEditInAppTitle } from './BulkEditInAppTitle/BulkEditInAppTitle';
import { ContentUpdatesForm } from './ContentUpdatesForm/ContentUpdatesForm';

import { RootContext } from '../../../../context/RootContext';

export const BulkEditInApp = ({ areAllOptionsLoaded, options, fields, setFields }) => {
  const { title } = useContext(RootContext);

  return (
    <>
      <Headline size="large" margin="medium">
        {title}
      </Headline>
      <Accordion
        label={<FormattedMessage id="ui-bulk-edit.layer.title" />}
      >
        {areAllOptionsLoaded ? (
          <>
            <BulkEditInAppTitle
              fields={fields}
            />
            <ContentUpdatesForm
              fields={fields}
              setFields={setFields}
              options={options}
            />
          </>
        ) : (
          <Layout className="display-flex centerContent">
            <Loading size="large" />
          </Layout>
        )}
      </Accordion>
    </>
  );
};

BulkEditInApp.propTypes = {
  areAllOptionsLoaded: PropTypes.bool.isRequired,
  options: PropTypes.arrayOf(PropTypes.object),
  fields: PropTypes.arrayOf(PropTypes.object).isRequired,
  setFields: PropTypes.func.isRequired,
};
