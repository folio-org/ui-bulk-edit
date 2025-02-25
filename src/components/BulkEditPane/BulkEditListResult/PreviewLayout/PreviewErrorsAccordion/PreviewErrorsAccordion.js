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
import { CAPABILITIES, ERROR_TYPES } from '../../../../../constants';
import { getPreviewErrorsFormatter } from '../../../../../utils/errorsFormatters';

import css from '../Preview.css';
import { previewErrorsColumnsMapping } from '../../../../../utils/mappers';


export const PreviewErrorsAccordion = ({
  errors = [],
  errorType,
  totalErrors,
  totalWarnings,
  isFetching,
  pagination,
  onShowWarnings,
  onChangePage,
}) => {
  const { user, okapi } = useStripes();
  const { capabilities } = useSearchParams();

  const visibleColumns = Object.keys(previewErrorsColumnsMapping);
  const centralTenant = user?.user?.consortium?.centralTenantId;
  const tenantId = okapi.tenant;
  const isCentralTenant = tenantId === centralTenant;
  const isLinkAvailable = (isCentralTenant && capabilities === CAPABILITIES.INSTANCE) || !isCentralTenant;
  const resultsFormatter = getPreviewErrorsFormatter({ isLinkAvailable });
  const errorLength = errors.length;
  // temporary solution to calculate total errors and warnings, until backend will provide it in scope of MODBULKOPS-451
  const totalErrorsAndWarnings = errorType === ERROR_TYPES.ERROR ? totalErrors : totalErrors + totalWarnings;
  const isWarningsCheckboxDisabled = !totalWarnings || !totalErrors;

  const [opened, setOpened] = useState(!!errorLength);

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
            {errors.length > 0 && (
              <PrevNextPagination
                {...pagination}
                totalCount={totalErrorsAndWarnings}
                disabled={false}
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
