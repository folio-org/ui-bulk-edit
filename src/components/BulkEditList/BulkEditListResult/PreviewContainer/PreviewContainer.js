import React, { useMemo } from 'react';
import { useIntl } from 'react-intl';
import { useLocation, useParams } from 'react-router';

import { Layout, Loading } from '@folio/stripes/components';

import { useBulkOperationDetails } from '../../../../hooks/api';
import { CRITERIA, EDITING_STEPS } from '../../../../constants';
import { Preview } from '../Preview/Preview';

import { NoResultsMessage } from '../NoResultsMessage/NoResultsMessage';

const PreviewContainer = () => {
  const intl = useIntl();

  const location = useLocation();
  const search = new URLSearchParams(location.search);
  const step = search.get('step');
  const fileUploadedName = search.get('fileName');
  const capabilities = search.get('capabilities')?.toLocaleLowerCase();
  const queryText = search.get('queryText');
  const criteria = search.get('criteria');

  const { id } = useParams();
  const { bulkDetails, isLoading } = useBulkOperationDetails({ id, additionalQueryKeys: [step] });

  const title = useMemo(() => {
    if (queryText) return intl.formatMessage({ id: 'ui-bulk-edit.preview.query.title' }, { queryText });

    return intl.formatMessage({ id: 'ui-bulk-edit.preview.file.title' }, { fileUploadedName });
  }, [queryText, fileUploadedName]);

  const isInitial = step === EDITING_STEPS.UPLOAD;

  if (criteria !== CRITERIA.IDENTIFIER) {
    return <NoResultsMessage />;
  } else if (isLoading) {
    return (
      <Layout className="display-flex centerContent">
        <Loading size="large" />
      </Layout>
    );
  } else {
    return (
      <Preview
        title={title}
        id={id}
        capabilities={capabilities}
        bulkDetails={bulkDetails}
        isInitial={isInitial}
      />
    );
  }
};

export default PreviewContainer;
