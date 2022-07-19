import React, { useMemo } from 'react';
import { useIntl } from 'react-intl';
import { useLocation, useParams } from 'react-router';

import { Preview } from '../Preview/Preview';
import { Loader } from '../Loader/Loader';

import { useDownloadLinks } from '../../../../API';

const PreviewInitial = () => {
  const intl = useIntl();
  const location = useLocation();
  const { id } = useParams();
  const { data } = useDownloadLinks(id);

  const fileUploadedName = useMemo(() => new URLSearchParams(location.search).get('fileName'), [location.search]);
  const capabilities = useMemo(() => new URLSearchParams(location.search).get('capabilities')?.toLocaleLowerCase(), [location.search]);

  const isComplited = data?.status === 'SUCCESSFUL';

  const title = useMemo(() => {
    const queryText = new URLSearchParams(location.search).get('queryText');

    if (queryText) return intl.formatMessage({ id: 'ui-bulk-edit.preview.query.title' }, { queryText });

    if (fileUploadedName) return intl.formatMessage({ id: 'ui-bulk-edit.preview.file.title' }, { fileUploadedName });

    return null;
  }, [fileUploadedName, intl, location.search]);

  return (
    <>
      {isComplited ?
        <Preview title={title} id={id} capabilities={capabilities} data={data} initial /> :
        <Loader />
      }
    </>
  );
};

export default PreviewInitial;
