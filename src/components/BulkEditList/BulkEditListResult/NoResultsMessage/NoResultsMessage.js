import { useMemo } from 'react';
import { useLocation } from 'react-router';
import { FormattedMessage } from 'react-intl';
import { Layout, Icon } from '@folio/stripes/components';

import { CRITERIA, TRANSLATION_SUFFIX } from '../../../../constants';

import css from './NoResultsMessage.css';

export const NoResultsMessage = () => {
  const location = useLocation();
  const search = new URLSearchParams(location.search);
  const capabilities = search.get('capabilities');
  const criteria = search.get('criteria');

  const message = useMemo(() => {
    const identifier = new URLSearchParams(location.search).get('identifier');
    const messagePrefix = criteria === CRITERIA.IDENTIFIER && identifier
      ? `.${identifier}`
      : '';

    return <FormattedMessage id={`ui-bulk-edit.list.result.emptyMessage${TRANSLATION_SUFFIX[capabilities]}${messagePrefix}`} />;
  }, [location.search]);

  return (
    <>
      <Layout className="display-flex centerContent">
        {/* eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex */}
        <div className={css.noResultsMessage} data-testid="empty-message" tabIndex={0}>
          <div className={css.noResultsMessageLabelWrap}>
            <Icon iconRootClass={css.noResultsMessageIcon} icon="arrow-left" />
            <span className={css.noResultsMessageLabel}>
              {message}
            </span>
          </div>
        </div>
      </Layout>
    </>
  );
};
