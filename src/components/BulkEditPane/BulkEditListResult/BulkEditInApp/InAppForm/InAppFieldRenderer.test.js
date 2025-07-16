import React from 'react';
import { Router } from 'react-router-dom';
import { IntlProvider } from 'react-intl';
import { render, fireEvent, screen } from '@folio/jest-config-stripes/testing-library/react';
import { QueryClientProvider } from 'react-query';

import { createMemoryHistory } from 'history';
import { InAppFieldRenderer } from './InAppFieldRenderer';
import { CONTROL_TYPES, CAPABILITIES } from '../../../../../constants';
import { useSearchParams } from '../../../../../hooks';
import { queryClient } from '../../../../../../test/jest/utils/queryClient';
import '../../../../../../test/jest/__mock__/reactIntl.mock';
import {
  useBulkOperationTenants,
  useElectronicAccessEcs,
  useElectronicAccess,
  useHoldingsNotes,
  useHoldingsNotesEcs,
  useInstanceNotes,
  useItemNotes,
  useItemNotesEcs,
  useLoanTypes,
  useLoanTypesEcs,
  usePatronGroup,
  useStatisticalCodes
} from '../../../../../hooks/api';

jest.mock('../../../../../hooks/api/useLoanTypes');
jest.mock('../../../../../hooks/api/useLoanTypesEcs');
jest.mock('../../../../../hooks/api/useInstanceNotes');
jest.mock('../../../../../hooks/api/useHoldingsNotes');
jest.mock('../../../../../hooks/api/useHoldingsNotesEcs');
jest.mock('../../../../../hooks/api/useItemNotes');
jest.mock('../../../../../hooks/api/useItemNotesEcs');
jest.mock('../../../../../hooks/api/usePatronGroup');
jest.mock('../../../../../hooks/api/useElectronicAccess');
jest.mock('../../../../../hooks/api/useElectronicAccessEcs');
jest.mock('../../../../../hooks/api/useStatisticalCodes');
jest.mock('../../../../../hooks/api/useBulkOperationTenants');
jest.mock('../../../../../hooks/useSearchParams');
jest.mock('@folio/stripes/core', () => ({
  ...jest.requireActual('@folio/stripes/core'),
  useStripes: jest.fn(),
  checkIfUserInCentralTenant: jest.fn(() => false),
}));
jest.mock('../../../../../utils/sortAlphabetically', () => ({
  ...jest.requireActual('../../../../../utils/sortAlphabetically'),
  sortAlphabeticallyComponentLabels: jest.fn().mockImplementation((arr) => arr),
}));

describe('FolioFieldRenderer (integration)', () => {
  const baseField = {
    name: 'fieldName',
    options: () => [],
    colSize: 2,
    dirty: false,
    showWhen: undefined,
    itemSchema: [],
  };

  const defaultProps = {
    field: {
      ...baseField,
      type: CONTROL_TYPES.INPUT
    },
    item: { fieldName: 'initial' },
    option: {},
    path: [0, 'path'],
    ctx: {
      index: 0,
      row: { }
    },
    allOptions: [],
    fields: [],
    onChange: jest.fn(),
    onActionChange: jest.fn(),
  };

  const history = createMemoryHistory();

  const renderMe = overrides => render(
    <Router history={history}>
      <QueryClientProvider client={queryClient}>
        <IntlProvider locale="en">
          <InAppFieldRenderer {...defaultProps} {...overrides} />
        </IntlProvider>
      </QueryClientProvider>
    </Router>
  );

  beforeEach(() => {
    jest.clearAllMocks();
    useSearchParams.mockReturnValue({ currentRecordType: CAPABILITIES.ITEM });
    useBulkOperationTenants.mockReturnValue({
      isTenantsLoading: false,
      tenants: [],
    });
  });

  it('renders nothing if showWhen returns false', () => {
    const { container } = renderMe({
      field: {
        ...baseField,
        type: CONTROL_TYPES.INPUT,
        showWhen: () => false
      },
    });

    expect(container.firstChild).toBeNull();
  });

  it('renders real TextField for CONTROL_TYPES.INPUT and calls onChange', () => {
    renderMe({
      field: {
        ...baseField,
        type: CONTROL_TYPES.INPUT
      }
    });

    const input = screen.getByRole('textbox', { name: /ui-bulk-edit\.ariaLabel\.textField/ });
    expect(input).toHaveValue('initial');

    fireEvent.change(input, { target: { value: 'new text' } });

    expect(defaultProps.onChange).toHaveBeenCalledWith({
      path: [0, 'path'],
      val: 'new text',
      name: 'fieldName',
    });
  });

  it('renders real TextArea for CONTROL_TYPES.TEXTAREA and calls onChange', () => {
    renderMe({
      field: {
        ...baseField,
        type: CONTROL_TYPES.TEXTAREA
      }
    });
    const textarea = screen.getByRole('textbox', { name: /ui-bulk-edit\.ariaLabel\.textArea/ });
    expect(textarea.tagName).toBe('TEXTAREA');
    expect(textarea).toHaveValue('initial');

    fireEvent.change(textarea, { target: { value: 'longer text' } });

    expect(defaultProps.onChange).toHaveBeenCalledWith({
      path: [0, 'path'],
      val: 'longer text',
      name: 'fieldName',
    });
  });

  it('renders real Datepicker for CONTROL_TYPES.DATE and calls onChange', () => {
    renderMe({
      field: {
        ...baseField,
        type: CONTROL_TYPES.DATE
      },
      item: { fieldName: '2023-06-01' },
    });
    const dateInput = screen.getByRole('textbox', { name: /ui-bulk-edit\.ariaLabel\.date/ });
    expect(dateInput).toHaveValue('06/01/2023');

    fireEvent.change(dateInput, { target: { value: '2023-07-15' } });

    expect(defaultProps.onChange)
      .toHaveBeenCalledWith({
        path: [0, 'path'],
        val: '2023-07-15',
        name: 'fieldName',
      });
  });

  it('renders real Select for CONTROL_TYPES.PATRON_GROUP_SELECT', () => {
    usePatronGroup.mockReturnValue({
      isLoading: false,
      userGroups: [],
    });

    renderMe({
      field: {
        ...baseField,
        type: CONTROL_TYPES.PATRON_GROUP_SELECT
      }
    });

    const select = screen.getByRole('combobox', { name: /ui-bulk-edit\.ariaLabel\.patronGroupSelect/ });
    expect(select).toBeInTheDocument();
  });

  it('renders real Select for CONTROL_TYPES.STATUS_SELECT', () => {
    renderMe({
      field: {
        ...baseField,
        type: CONTROL_TYPES.STATUS_SELECT
      }
    });

    const select = screen.getByRole('combobox', { name: /ui-bulk-edit\.ariaLabel\.statusSelect/ });
    expect(select).toBeInTheDocument();
  });

  it('renders real Select for CONTROL_TYPES.LOAN_TYPE', () => {
    useLoanTypes.mockReturnValue({
      isLoading: false,
      loanTypes: [],
    });

    useLoanTypesEcs.mockReturnValue({
      isFetching: false,
      loanTypesEcs: [],
    });

    renderMe({
      field: {
        ...baseField,
        type: CONTROL_TYPES.LOAN_TYPE
      }
    });

    const multiSelectButton = screen.getByRole('button', { name: /ui-bulk-edit.layer.selectLoanType/ });
    expect(multiSelectButton).toBeInTheDocument();
  });

  describe('CONTROL_TYPES.NOTE_SELECT', () => {
    it('renders HoldingNotesControl when recordType is HOLDING', () => {
      useSearchParams.mockReturnValue({ currentRecordType: CAPABILITIES.HOLDING });
      useHoldingsNotes.mockReturnValue({
        isHoldingsNotesLoading: false,
        holdingsNotes: []
      });
      useHoldingsNotesEcs.mockReturnValue({
        isFetching: false,
        notesEcs: [],
      });

      renderMe({
        field: {
          ...baseField,
          type: CONTROL_TYPES.NOTE_SELECT
        }
      });
      const select = screen.getByRole('combobox', { name: /ui-bulk-edit.ariaLabel.holdingsNotes/ });
      expect(select)
        .toBeInTheDocument();
    });

    it('renders ItemNotesControl when recordType is ITEM', () => {
      useSearchParams.mockReturnValue({ currentRecordType: CAPABILITIES.ITEM });
      useItemNotes.mockReturnValue({
        isItemNotesLoading: false,
        itemNotes: []
      });
      useItemNotesEcs.mockReturnValue({
        isFetching: false,
        notesEcs: [],
      });

      renderMe({
        field: {
          ...baseField,
          type: CONTROL_TYPES.NOTE_SELECT
        }
      });
      const select = screen.getByRole('combobox', { name: /ui-bulk-edit.ariaLabel.itemNotes/ });

      expect(select).toBeInTheDocument();
    });

    it('renders InstanceNotesControl when recordType is INSTANCE', () => {
      useSearchParams.mockReturnValue({ currentRecordType: CAPABILITIES.INSTANCE });
      useInstanceNotes.mockReturnValue({
        isInstanceNotesLoading: false,
        instanceNotes: []
      });

      renderMe({
        field: {
          ...baseField,
          type: CONTROL_TYPES.NOTE_SELECT
        }
      });

      const select = screen.getByRole('combobox', { name: /ui-bulk-edit.ariaLabel.instanceNotes/ });

      expect(select).toBeInTheDocument();
    });
  });

  it('renders real Select for CONTROL_TYPES.NOTE_DUPLICATE_SELECT', () => {
    renderMe({
      field: {
        ...baseField,
        type: CONTROL_TYPES.NOTE_DUPLICATE_SELECT
      }
    });
    const select = screen.getByRole('combobox', { name: /ui-bulk-edit.ariaLabel.duplicateSelect/ });
    expect(select).toBeInTheDocument();
  });

  it('renders real Select for CONTROL_TYPES.ELECTRONIC_ACCESS_RELATIONSHIP_SELECT', () => {
    useElectronicAccess.mockReturnValue({
      electronicAccessRelationships: [],
      isElectronicAccessLoading: false
    });
    useElectronicAccessEcs.mockReturnValue({
      escData: [],
      isFetching: false
    });

    renderMe({
      field: {
        ...baseField,
        type: CONTROL_TYPES.ELECTRONIC_ACCESS_RELATIONSHIP_SELECT
      }
    });

    const select = screen.getByRole('combobox', { name: /ui-bulk-edit.ariaLabel.urlRelationshipSelect/ });
    expect(select).toBeInTheDocument();
  });

  it('renders real Select for CONTROL_TYPES.STATISTICAL_CODES_SELECT', () => {
    useStatisticalCodes.mockReturnValue({
      statisticalCodes: [],
      isStatisticalCodesLoading: false
    });

    renderMe({
      field: {
        ...baseField,
        type: CONTROL_TYPES.STATISTICAL_CODES_SELECT
      },
      item: { fieldName: [] },
    });

    const select = screen.getByRole('combobox', { name: /ui-bulk-edit.ariaLabel.statisticalCode/ });
    expect(select).toBeInTheDocument();
  });

  it('renders ACTION select and calls onActionChange', () => {
    const actions = [
      {
        label: 'First',
        value: 'first'
      },
      {
        label: 'Second',
        value: 'second'
      },
    ];
    renderMe({
      field: {
        ...baseField,
        type: CONTROL_TYPES.ACTION,
        options: () => actions
      },
      onActionChange: defaultProps.onActionChange,
    });

    const actionSelect = screen.getByTestId('select-actions-0');
    expect(actionSelect).toBeInTheDocument();

    fireEvent.change(actionSelect, { target: { value: 'second' } });

    expect(defaultProps.onActionChange).toHaveBeenCalledWith({
      path: [0, 'path'],
      val: 'second',
      name: 'fieldName',
      option: defaultProps.option,
      ctx: defaultProps.ctx,
    });
  });
});
