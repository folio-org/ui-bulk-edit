import { useMemo } from 'react';
import { useLocation } from 'react-router';
import { FormattedMessage } from 'react-intl';
import { Layout, Icon } from '@folio/stripes/components';

import css from './NoResultsMessage.css';

export const NoResultsMessage = () => {
  const location = useLocation();

  const message = useMemo(() => {
    const identifier = new URLSearchParams(location.search).get('identifier');

    return <FormattedMessage id={`ui-bulk-edit.list.result.emptyMessage${identifier ? `.${identifier}` : ''}`} />;
  }, [location.search]);

  return (
    <>
      <Layout className="display-flex centerContent">
        <div className={css.noResultsMessage} data-testid="empty-message">
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
