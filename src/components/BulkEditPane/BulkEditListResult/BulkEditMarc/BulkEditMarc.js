import PropTypes from 'prop-types';
import React, { useContext } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

import { Accordion, Headline, Layout } from '@folio/stripes/components';
import { TitleManager, useStripes } from '@folio/stripes/core';

import { RootContext } from '../../../../context/RootContext';
import { MarcFormBody } from './MarcForm/MarcFormBody';
import { MarcFormTitle } from './MarcForm/MarcFormTitle';
import { FolioFormTitle } from '../BulkEditInApp/ContentUpdatesForm/FolioFormTitle';
import { FolioFormBody } from '../BulkEditInApp/ContentUpdatesForm/FolioFormBody';


export const BulkEditMarc = ({
  fields,
  setFields,
  marcFields,
  setMarcFields,
  options,
}) => {
  const stripes = useStripes();
  const intl = useIntl();
  const { title } = useContext(RootContext);

  return (
    <TitleManager stripes={stripes} record={intl.formatMessage({ id: 'ui-bulk-edit.title.marc' })}>
      <Headline size="large" margin="medium">
        {title}
      </Headline>
      <Accordion
        label={<FormattedMessage id="ui-bulk-edit.layer.title.administrative" />}
      >
        <FolioFormTitle fields={fields} />
        <FolioFormBody
          fields={fields}
          setFields={setFields}
          options={options}
        />
      </Accordion>
      <Layout className="marginTop1">
        <Accordion
          label={<FormattedMessage id="ui-bulk-edit.layer.title.marc" />}
        >
          <MarcFormTitle fields={marcFields} />
          <MarcFormBody
            setFields={setMarcFields}
            fields={marcFields}
          />
        </Accordion>
      </Layout>
    </TitleManager>
  );
};

BulkEditMarc.propTypes = {
  fields: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  marcFields: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  options: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  setFields: PropTypes.func.isRequired,
  setMarcFields: PropTypes.func.isRequired,
};
