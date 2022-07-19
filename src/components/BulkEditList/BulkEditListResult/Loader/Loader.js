import { Loading } from '@folio/stripes/components';

import css from './Loader.css';

export const Loader = () => {
  return (
    <div className={css.wrapper} data-testid="spiner">
      <Loading />
    </div>
  );
};
