import React, { useMemo } from 'react';
import { useIntl } from 'react-intl';
import { useLocation, useParams } from 'react-router';

import { Loading } from '@folio/stripes/components';

import { useBulkOperationDetails } from '../../../../hooks/api';
import { CRITERIA, EDITING_STEPS } from '../../../../constants';
import { Preview } from '../Preview/Preview';

import css from '../../../BulkEdit.css';
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

  if (criteria === CRITERIA.IDENTIFIER) {
    return isLoading ? (
      <div className={css.LoaderContainer}>
        <Loading />
      </div>
    ) : (
      <Preview
        title={title}
        id={id}
        capabilities={capabilities}
        bulkDetails={bulkDetails}
        isInitial={isInitial}
      />
    );
  } else return <NoResultsMessage />;
};

export default PreviewContainer;
