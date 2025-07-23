import { Layout, Loading } from '@folio/stripes/components';

import { InAppFormTitle } from './InAppFormTitle';
import { InAppFormBody } from './InAppFormBody';

export const InAppForm = ({
  fields,
  setFields,
  options,
  recordType,
  approach,
  readOnly,
  loading
}) => {
  if (loading) {
    return (
      <Layout className="display-flex centerContent">
        <Loading size="large" />
      </Layout>
    );
  }
  return (
    <>
      <InAppFormTitle
        fields={fields}
      />
      <InAppFormBody
        fields={fields}
        setFields={setFields}
        options={options}
        recordType={recordType}
        approach={approach}
        readOnly={readOnly}
      />
    </>
  );
};
