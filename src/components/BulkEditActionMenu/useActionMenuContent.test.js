import { renderHook } from '@folio/jest-config-stripes/testing-library/react-hooks';

import { useStripes } from '@folio/stripes/core';

import { useBulkPermissions, useSearchParams } from '../../hooks';
import {
  CAPABILITIES,
  CRITERIA,
  EDITING_STEPS,
  JOB_STATUSES,
  OPERATION_TYPES,
} from '../../constants';
import { useActionMenuContent } from './useActionMenuContent';

jest.mock('@folio/stripes/core', () => ({
  useStripes: jest.fn(),
}));

jest.mock('../../hooks', () => ({
  useBulkPermissions: jest.fn(),
  useSearchParams: jest.fn(),
}));

const NO_PERMS = {
  hasAnyEditPermissions: false,
  hasUserEditLocalPerm: false,
  hasHoldingsInventoryEdit: false,
  hasItemInventoryEdit: false,
  hasUserEditInAppPerm: false,
  hasUserDeleteInAppPerm: false,
  hasInstanceInventoryEdit: false,
  hasInstanceAndMarcEditPerm: false,
  hasInventoryAndMarcEditPerm: false,
};

const setup = ({
  perms = NO_PERMS,
  searchParams = {},
  consortium = undefined,
  bulkDetails = {},
  visibleColumns = [],
} = {}) => {
  useBulkPermissions.mockReturnValue(perms);
  useSearchParams.mockReturnValue({
    step: EDITING_STEPS.COMMIT,
    currentRecordType: CAPABILITIES.USER,
    criteria: CRITERIA.QUERY,
    ...searchParams,
  });
  useStripes.mockReturnValue({ user: { user: { consortium } } });

  return renderHook(() => useActionMenuContent({ bulkDetails, visibleColumns })).result.current;
};

describe('useActionMenuContent', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns hasAnyContent=false when there are no links, no start buttons and no columns', () => {
    const result = setup({
      bulkDetails: { status: JOB_STATUSES.COMPLETED, operationType: 'DELETE' },
      visibleColumns: [],
    });

    expect(result.hasLinks).toBe(false);
    expect(result.hasStartButtons).toBe(false);
    expect(result.hasColumns).toBe(false);
    expect(result.hasAnyContent).toBe(false);
  });

  it('returns hasColumns=false and hasAnyContent=false for a DELETE operation even when columns are still cached', () => {
    const result = setup({
      bulkDetails: { status: JOB_STATUSES.COMPLETED, operationType: OPERATION_TYPES.DELETE },
      visibleColumns: [{ value: 'name' }, { value: 'barcode' }],
    });

    expect(result.hasColumns).toBe(false);
    expect(result.hasAnyContent).toBe(false);
  });

  it('returns hasAnyContent=true when columns are present', () => {
    const result = setup({
      bulkDetails: { status: JOB_STATUSES.COMPLETED },
      visibleColumns: [{ value: 'name' }],
    });

    expect(result.hasColumns).toBe(true);
    expect(result.hasAnyContent).toBe(true);
  });

  it('returns hasAnyContent=true when a download link is available', () => {
    const result = setup({
      perms: { ...NO_PERMS, hasAnyEditPermissions: true },
      searchParams: { step: EDITING_STEPS.UPLOAD },
      bulkDetails: {
        status: JOB_STATUSES.COMPLETED,
        linkToMatchedRecordsCsvFile: 'some/path.csv',
      },
      visibleColumns: [],
    });

    expect(result.hasLinks).toBe(true);
    expect(result.hasAnyContent).toBe(true);
  });

  it('returns hasAnyContent=true and isStartBulkDeleteActive when a start delete action is available', () => {
    const result = setup({
      perms: { ...NO_PERMS, hasUserDeleteInAppPerm: true },
      searchParams: { step: EDITING_STEPS.UPLOAD, currentRecordType: CAPABILITIES.USER },
      bulkDetails: { status: JOB_STATUSES.DATA_MODIFICATION },
      visibleColumns: [],
    });

    expect(result.isStartBulkDeleteActive).toBe(true);
    expect(result.hasStartButtons).toBe(true);
    expect(result.hasAnyContent).toBe(true);
  });
});
