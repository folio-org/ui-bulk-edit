import React, { useContext } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

import { Accordion, Headline } from '@folio/stripes/components';
import { TitleManager, useStripes } from '@folio/stripes/core';

import BulkEditMarkForm from './BulkEditMarkForm/BulkEditMarkForm';
import BulkEditMarkTitle from './BulkEditMarkTitle/BulkEditMarkTitle';
import { RootContext } from '../../../../context/RootContext';


export const BulkEditMark = () => {
  const stripes = useStripes();
  const intl = useIntl();
  const { title } = useContext(RootContext);

  return (
    <TitleManager stripes={stripes} record={intl.formatMessage({ id: 'ui-bulk-edit.title.mark' })}>
      <Headline size="large" margin="medium">
        {title}
      </Headline>
      <Accordion
        label={<FormattedMessage id="ui-bulk-edit.layer.title" />}
      >
        <BulkEditMarkTitle />
        <BulkEditMarkForm />
      </Accordion>
    </TitleManager>
  );
};
