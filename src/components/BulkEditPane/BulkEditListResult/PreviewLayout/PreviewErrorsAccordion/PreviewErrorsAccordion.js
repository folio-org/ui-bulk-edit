import React, { useState } from 'react';
import { PropTypes } from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  Accordion,
  MultiColumnList,
  Headline,
  Layout,
  Checkbox,
} from '@folio/stripes/components';
import { useStripes } from '@folio/stripes/core';
import { PrevNextPagination } from '@folio/stripes-acq-components';

import { useSearchParams } from '../../../../../hooks';
import { CAPABILITIES } from '../../../../../constants';
import { getPreviewErrorsResultFormatter } from '../../../../../utils/formatters';
import { previewErrorsColumnsMapping } from '../../../../../utils/mappers';

import css from '../Preview.css';


export const PreviewErrorsAccordion = ({
  errors = [],
  totalErrorRecords,
  errorType,
  totalErrors,
  totalWarnings,
  isFetching,
  pagination,
  onShowWarnings,
  onChangePage,
}) => {
  const { user, okapi } = useStripes();
  const { currentRecordType } = useSearchParams();

  const visibleColumns = Object.keys(previewErrorsColumnsMapping);
  const centralTenant = user?.user?.consortium?.centralTenantId;
  const tenantId = okapi.tenant;
  const isCentralTenant = tenantId === centralTenant;
  const isLinkAvailable = (isCentralTenant && currentRecordType === CAPABILITIES.INSTANCE) || !isCentralTenant;
  const resultsFormatter = getPreviewErrorsResultFormatter({ isLinkAvailable });
  const isWarningsCheckboxDisabled = !totalWarnings || !totalErrors;

  const [opened, setOpened] = useState(!!totalErrorRecords);

  return (
    <div className={css.previewAccordion}>
      <Accordion
        open={opened}
        onToggle={() => {
          setOpened(!opened);
        }}
        label={<FormattedMessage id="ui-bulk-edit.list.errors.title" />}
      >
        <div className={css.errorAccordionOuter}>
          <Headline size="medium" margin="small">
            <Layout className="display-flex justified">
              <FormattedMessage
                id="ui-bulk-edit.list.errors.info"
                values={{
                  errors: totalErrors,
                  warnings: totalWarnings,
                }}
              />
              <Checkbox
                label={<FormattedMessage id="ui-bulk-edit.list.errors.checkbox" />}
                checked={!errorType}
                onChange={onShowWarnings}
                disabled={isWarningsCheckboxDisabled}
              />
            </Layout>
          </Headline>
          <div className={css.previewAccordionInner}>
            <div className={css.previewAccordionList}>
              <MultiColumnList
                contentData={errors}
                columnMapping={previewErrorsColumnsMapping}
                formatter={resultsFormatter}
                visibleColumns={visibleColumns}
                loading={isFetching}
                autosize
              />
            </div>
            {totalErrorRecords > 0 && (
              <PrevNextPagination
                {...pagination}
                totalCount={totalErrorRecords}
                onChange={onChangePage}
              />
            )}
          </div>
        </div>
      </Accordion>
    </div>
  );
};

PreviewErrorsAccordion.propTypes = {
  errors: PropTypes.arrayOf(PropTypes.object),
  totalErrorRecords: PropTypes.number,
  totalErrors: PropTypes.number,
  totalWarnings: PropTypes.number,
  errorType: PropTypes.string,
  isFetching: PropTypes.bool,
  pagination: {
    limit: PropTypes.number,
    offset: PropTypes.number,
  },
  onShowWarnings: PropTypes.func,
  onChangePage: PropTypes.func,
};
