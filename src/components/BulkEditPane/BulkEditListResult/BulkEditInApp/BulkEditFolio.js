import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { useContext } from 'react';

import {
  Headline,
  Accordion,
  Loading,
  Layout,
} from '@folio/stripes/components';

import { FolioFormTitle } from './ContentUpdatesForm/FolioFormTitle';
import { FolioFormBody } from './ContentUpdatesForm/FolioFormBody';
import { RootContext } from '../../../../context/RootContext';


export const BulkEditFolio = ({ areAllOptionsLoaded, options, fields, setFields }) => {
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
            <FolioFormTitle
              fields={fields}
            />
            <FolioFormBody
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

BulkEditFolio.propTypes = {
  areAllOptionsLoaded: PropTypes.bool.isRequired,
  options: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  fields: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  setFields: PropTypes.func.isRequired,
};
