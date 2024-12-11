import PropTypes from 'prop-types';
import React, { useContext } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

import { Accordion, Headline, Layout } from '@folio/stripes/components';
import { TitleManager, useStripes } from '@folio/stripes/core';

import BulkEditMarcForm from './BulkEditMarcForm/BulkEditMarcForm';
import BulkEditMarcTitle from './BulkEditMarcTitle/BulkEditMarcTitle';
import { RootContext } from '../../../../context/RootContext';
import { BulkEditInAppTitle } from '../BulkEditInApp/BulkEditInAppTitle/BulkEditInAppTitle';
import { ContentUpdatesForm } from '../BulkEditInApp/ContentUpdatesForm/ContentUpdatesForm';


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
        <BulkEditInAppTitle fields={fields} />
        <ContentUpdatesForm
          fields={fields}
          setFields={setFields}
          options={options}
        />
      </Accordion>
      <Layout className="marginTop1">
        <Accordion
          label={<FormattedMessage id="ui-bulk-edit.layer.title.marc" />}
        >
          <BulkEditMarcTitle fields={marcFields} />
          <BulkEditMarcForm
            fields={marcFields}
            setFields={setMarcFields}
          />
        </Accordion>
      </Layout>
    </TitleManager>
  );
};

BulkEditMarc.propTypes = {
  fields: PropTypes.arrayOf(PropTypes.object).isRequired,
  setFields: PropTypes.func.isRequired,
  marcFields: PropTypes.arrayOf(PropTypes.object).isRequired,
  setMarcFields: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(PropTypes.object).isRequired,
};