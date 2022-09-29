import React, { useContext, useMemo } from 'react';
import { useIntl } from 'react-intl';
import { useLocation, useParams } from 'react-router';
import { Preview } from '../Preview/Preview';

import { useJob } from '../../../../API';
import { RootContext } from '../../../../context/RootContext';

const PreviewProcessed = () => {
  const intl = useIntl();
  const location = useLocation();
  const { id } = useParams();
  const { data } = useJob(id);
  const { confirmedFileName: fileUploadedName } = useContext(RootContext);

  const capabilities = useMemo(() => new URLSearchParams(location.search).get('capabilities').toLowerCase(), [location.search]);

  const title = useMemo(() => {
    if (fileUploadedName) return intl.formatMessage({ id: 'ui-bulk-edit.preview.file.title' }, { fileUploadedName });

    return null;
  }, [fileUploadedName, intl, location.search]);

  return (
    <Preview title={title} id={id} capabilities={capabilities} data={data} />
  );
};

export default PreviewProcessed;
