import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';
import { useLocation, useParams } from 'react-router';
import { Preview } from '../Preview/Preview';

const PreviewProcessed = ({ setCountOfRecords }) => {
  const intl = useIntl();
  const location = useLocation();
  const { id } = useParams();

  const fileUploadedName = useMemo(() => new URLSearchParams(location.search).get('processedFileName'), [location.search]);
  const capabilities = useMemo(() => new URLSearchParams(location.search).get('capabilities').toLowerCase(), [location.search]);

  const title = useMemo(() => {
    if (fileUploadedName) return intl.formatMessage({ id: 'ui-bulk-edit.preview.file.title' }, { fileUploadedName });

    return null;
  }, [fileUploadedName, intl, location.search]);

  return (
    <Preview title={title} id={id} capabilities={capabilities} setCountOfRecords={setCountOfRecords} />
  );
};

PreviewProcessed.propTypes = {
  setCountOfRecords: PropTypes.func,
};

export default PreviewProcessed;
