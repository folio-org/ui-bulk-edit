import React, { useMemo } from 'react';
import { useIntl } from 'react-intl';
import { useLocation, useParams } from 'react-router';
import { Loading } from '@folio/stripes/components';
import { Preview } from '../Preview/Preview';
import { useBulkOperationDetails } from '../../../../hooks/api/useBulkOperationDetails';
import { EDITING_STEPS } from '../../../../constants';
import css from '../../../BulkEdit.css';

const PreviewContainer = () => {
  const intl = useIntl();

  const location = useLocation();
  const search = new URLSearchParams(location.search);

  const { id } = useParams();
  const { bulkDetails, isLoading } = useBulkOperationDetails({ id });

  const step = search.get('step');
  const fileUploadedName = search.get('fileName');
  const capabilities = search.get('capabilities')?.toLocaleLowerCase();
  const queryText = search.get('queryText');

  const title = useMemo(() => {
    if (queryText) return intl.formatMessage({ id: 'ui-bulk-edit.preview.query.title' }, { queryText });

    return intl.formatMessage({ id: 'ui-bulk-edit.preview.file.title' }, { fileUploadedName });
  }, [queryText, fileUploadedName]);

  const isInitial = step === EDITING_STEPS.UPLOAD;

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
};

export default PreviewContainer;
