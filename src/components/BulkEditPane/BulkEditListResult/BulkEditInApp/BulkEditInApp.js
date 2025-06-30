import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { useContext } from 'react';

import {
  Headline,
  Accordion,
  Loading,
  Layout,
} from '@folio/stripes/components';

import { InAppFormTitle } from './InAppForm/InAppFormTitle';
import { InAppFormBody } from './InAppForm/InAppFormBody';
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
            <InAppFormTitle
              fields={fields}
            />
            <InAppFormBody
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
  options: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  fields: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  setFields: PropTypes.func.isRequired,
};
