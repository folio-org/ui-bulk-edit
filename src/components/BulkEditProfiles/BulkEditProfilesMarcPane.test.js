import React from 'react';
import { IntlProvider } from 'react-intl';
import { MemoryRouter } from 'react-router-dom';

import { render, screen, within } from '@folio/jest-config-stripes/testing-library/react';
import userEvent from '@folio/jest-config-stripes/testing-library/user-event';

import { BulkEditProfilesMarcPane } from './BulkEditProfilesMarcPane';
import { useBulkEditForm } from '../../hooks/useBulkEditForm';
import { useProfilesSummaryForm } from '../../hooks/useProfilesSummaryForm';
import { getMappedContentUpdates, getContentUpdatesBody } from '../BulkEditPane/BulkEditListResult/BulkEditInApp/helpers';


jest.mock('@folio/stripes/components', () => ({
  Pane: ({ paneTitle, onClose, footer, appIcon, children }) => (
    <div data-testid="pane">
      <div data-testid="pane-title">{paneTitle}</div>
      <div data-testid="pane-appicon">{appIcon ? 'icon' : ''}</div>
      <button type="button" onClick={onClose}>pane-close</button>
      <div data-testid="pane-footer">{footer}</div>
      {children}
    </div>
  ),
  AccordionSet: ({ children }) => <div data-testid="accordion-set">{children}</div>,
  Layout: ({ children }) => <div data-testid="layout">{children}</div>,
  ExpandAllButton: () => <button type="button">expand-all</button>,
}));

jest.mock('@folio/stripes/core', () => ({
  AppIcon: ({ app, iconKey }) => <div data-testid="app-icon">{`${app}:${iconKey}`}</div>,
  useStripes: () => ({ hasPerm: () => true }),
}));

jest.mock('../../constants', () => ({
  RECORD_TYPES_MAPPING: { USER: 'user' },
  getAdministrativeDataOptions: (formatMessage) => [
    { value: 'a', label: typeof formatMessage === 'function' ? formatMessage({ id: 'a' }) : 'a' },
    { value: 'b', label: typeof formatMessage === 'function' ? formatMessage({ id: 'b' }) : 'b' },
  ],
}));

jest.mock('../../utils/helpers', () => ({
  filterOptionsByPermissions: jest.fn(opts => opts),
}));

jest.mock('../../utils/sortAlphabetically', () => ({
  sortAlphabetically: jest.fn(opts => opts),
}));

jest.mock('../BulkEditPane/BulkEditListResult/BulkEditInApp/helpers', () => ({
  folioFieldTemplate: jest.fn(),
  getMappedContentUpdates: jest.fn(() => [{ rule: 'mapped' }]),
  getContentUpdatesBody: jest.fn(() => ({
    bulkOperationRules: [{ rule_details: [{ k: 'v' }] }],
  })),
}));

jest.mock('../BulkEditPane/BulkEditListResult/BulkEditMarc/helpers', () => ({
  marcFieldTemplate: jest.fn(),
}));

jest.mock('../BulkEditPane/BulkEditListResult/BulkEditInApp/validation', () => ({
  validationSchema: {},
}));
jest.mock('../BulkEditPane/BulkEditListResult/BulkEditMarc/validation', () => ({
  validationSchema: {},
}));

jest.mock('../../hooks/useBulkEditForm', () => ({
  useBulkEditForm: jest.fn(),
}));
jest.mock('../../hooks/useProfilesSummaryForm', () => ({
  useProfilesSummaryForm: jest.fn(),
}));
jest.mock('../../hooks', () => ({
  useBulkPermissions: () => ({ hasSettingsLockPerms: true }),
  useSearchParams: () => ({ currentRecordType: 'USER' }),
}));

jest.mock('./forms/BulkEditProfilesSummaryForm', () => ({
  BulkEditProfilesSummaryForm: ({ onChange, formState, lockedDisabled }) => (
    <div data-testid="summary-form">
      <div data-testid="summary-name">{formState.name}</div>
      <div data-testid="summary-locked-disabled">{String(lockedDisabled)}</div>
      <button type="button" onClick={() => onChange('Changed Name', 'name')}>summary-change-name</button>
    </div>
  ),
}));

jest.mock('./forms/BulkEditProfilesFormFooter', () => ({
  BulkEditProfilesFormFooter: ({ onCancel, onSave, isSaveDisabled }) => (
    <div data-testid="footer">
      <button type="button" onClick={onCancel}>cancel</button>
      <button type="button" disabled={isSaveDisabled} onClick={onSave}>save</button>
      <div data-testid="save-disabled">{String(!!isSaveDisabled)}</div>
    </div>
  ),
}));

jest.mock('./forms/BulkEditProfilesMarcForm', () => ({
  BulkEditProfilesMarcForm: ({
    fields,
    setFields,
    marcFields,
    setMarcFields,
    options,
    entityType,
    isAdministrativeFormPristine,
  }) => (
    <div data-testid="marc-wrapper">
      <div data-testid="marc-wrapper-fields-count">{fields.length}</div>
      <div data-testid="marc-wrapper-marcfields-count">{marcFields.length}</div>
      <div data-testid="marc-wrapper-entity">{entityType}</div>
      <div data-testid="marc-wrapper-pristine">{String(isAdministrativeFormPristine)}</div>
      <div data-testid="marc-wrapper-options">{options.length}</div>
      <button type="button" onClick={() => setFields([...fields, { id: 'new-admin' }])}>add-admin-field</button>
      <button type="button" onClick={() => setMarcFields([...marcFields, { id: 'new-marc', subfields: [] }])}>add-marc-field</button>
    </div>
  ),
}));

const setUseBulkEditFormReturns = (adminRet, marcRet) => {
  useBulkEditForm.mockReset();
  useBulkEditForm
    .mockReturnValueOnce(adminRet)
    .mockReturnValueOnce(marcRet);
};

const setSummaryHook = (ret) => {
  useProfilesSummaryForm.mockReset();
  useProfilesSummaryForm.mockReturnValue(ret);
};

const renderPane = (overrideProps = {}) => {
  const props = {
    title: 'Pane Title',
    initialSummaryValues: { name: 'N', description: 'D', locked: false },
    initialRuleDetails: [],
    initialMarcRuleDetails: [],
    isLoading: false,
    onSave: jest.fn(),
    onClose: jest.fn(),
    onOpenModal: jest.fn(),
    ...overrideProps,
  };

  const view = render(
    <IntlProvider locale="en">
      <MemoryRouter>
        <BulkEditProfilesMarcPane {...props} />
      </MemoryRouter>
    </IntlProvider>
  );
  return { props, ...view };
};

describe('BulkEditProfilesMarcPane', () => {
  beforeEach(() => {
    setUseBulkEditFormReturns(
      { fields: [{ id: 'a1' }], setFields: jest.fn(), isValid: true, isPristine: true },
      { fields: [{ id: 'm1' }], setFields: jest.fn(), isValid: true, isPristine: true }
    );
    setSummaryHook({
      formState: { name: 'N', description: 'D', locked: false },
      setFormState: jest.fn(),
      isValid: true,
      isPristine: true,
    });
  });

  it('renders Pane, title, app icon, accordion set, and nested forms', () => {
    renderPane();

    expect(screen.getByTestId('pane')).toBeInTheDocument();
    expect(screen.getByTestId('pane-title')).toHaveTextContent('Pane Title');
    expect(screen.getByTestId('pane-appicon')).toHaveTextContent('icon');
    expect(screen.getByTestId('accordion-set')).toBeInTheDocument();
    expect(screen.getByTestId('summary-form')).toBeInTheDocument();
    expect(screen.getByTestId('marc-wrapper')).toBeInTheDocument();
  });

  it('passes props to BulkEditProfilesMarcForm and supports mutating via setters', async () => {
    const user = userEvent.setup();
    renderPane();

    expect(screen.getByTestId('marc-wrapper-fields-count')).toHaveTextContent('1');
    expect(screen.getByTestId('marc-wrapper-marcfields-count')).toHaveTextContent('1');
    expect(screen.getByTestId('marc-wrapper-entity')).toHaveTextContent('USER');
    expect(screen.getByTestId('marc-wrapper-pristine')).toHaveTextContent('true');
    expect(screen.getByTestId('marc-wrapper-options')).toHaveTextContent('2');

    await user.click(screen.getByText('add-admin-field'));
    await user.click(screen.getByText('add-marc-field'));
  });

  it('disables Save when all forms are pristine', () => {
    renderPane();
    expect(screen.getByTestId('save-disabled')).toHaveTextContent('true');
  });

  it('enables Save when at least one bulk form changed and all valid', () => {
    setUseBulkEditFormReturns(
      { fields: [{ id: 'a1' }], setFields: jest.fn(), isValid: true, isPristine: false }, // admin changed
      { fields: [{ id: 'm1' }], setFields: jest.fn(), isValid: true, isPristine: true }
    );
    renderPane();
    expect(screen.getByTestId('save-disabled')).toHaveTextContent('false');
  });

  it('pane close calls onClose when pristine, otherwise onOpenModal', async () => {
    const user = userEvent.setup();

    const { props, unmount, getByText } = renderPane();
    await user.click(getByText('pane-close'));
    expect(props.onClose).toHaveBeenCalled();
    unmount();

    setUseBulkEditFormReturns(
      { fields: [{ id: 'a1' }], setFields: jest.fn(), isValid: true, isPristine: false },
      { fields: [{ id: 'm1' }], setFields: jest.fn(), isValid: true, isPristine: true }
    );
    const { props: props2, getByText: getByText2, unmount: unmount2 } = renderPane();
    await user.click(getByText2('pane-close'));
    expect(props2.onOpenModal).toHaveBeenCalled();
    unmount2();
  });

  it('footer Cancel mirrors the same close logic', async () => {
    const user = userEvent.setup();

    setUseBulkEditFormReturns(
      { fields: [{ id: 'a1' }], setFields: jest.fn(), isValid: true, isPristine: false },
      { fields: [{ id: 'm1' }], setFields: jest.fn(), isValid: true, isPristine: true }
    );
    const view1 = renderPane();
    const footer1 = view1.getByTestId('footer');
    await user.click(within(footer1).getByRole('button', { name: 'cancel' }));
    expect(view1.props.onOpenModal).toHaveBeenCalled();
    view1.unmount();

    setUseBulkEditFormReturns(
      { fields: [{ id: 'a1' }], setFields: jest.fn(), isValid: true, isPristine: true },
      { fields: [{ id: 'm1' }], setFields: jest.fn(), isValid: true, isPristine: true }
    );
    const view2 = renderPane();
    const footer2 = view2.getByTestId('footer');
    await user.click(within(footer2).getByRole('button', { name: 'cancel' }));
    expect(view2.props.onClose).toHaveBeenCalled();
    view2.unmount();
  });

  it('builds payload and calls onSave when Save is enabled', async () => {
    const user = userEvent.setup();

    setUseBulkEditFormReturns(
      { fields: [{ id: 'a1' }], setFields: jest.fn(), isValid: true, isPristine: false }, // admin changed
      { fields: [{ id: 'm1', foo: 'bar' }], setFields: jest.fn(), isValid: true, isPristine: true }
    );
    setSummaryHook({
      formState: { name: 'Name', description: 'Desc', locked: true },
      setFormState: jest.fn(),
      isValid: true,
      isPristine: false,
    });

    const { props } = renderPane();

    expect(screen.getByTestId('save-disabled')).toHaveTextContent('false');
    await user.click(screen.getByText('save'));

    expect(getMappedContentUpdates).toHaveBeenCalledWith([{ id: 'a1' }], expect.any(Array));
    expect(getContentUpdatesBody).toHaveBeenCalledWith({
      bulkOperationId: null,
      contentUpdates: [{ rule: 'mapped' }],
    });

    expect(props.onSave).toHaveBeenCalledWith({
      name: 'Name',
      description: 'Desc',
      locked: true,
      entityType: 'USER',
      ruleDetails: [[{ k: 'v' }]],
      marcRuleDetails: [{ bulkOperationId: null, id: 'm1', foo: 'bar' }],
    });
  });

  it('disables Save when loading', () => {
    setUseBulkEditFormReturns(
      { fields: [{ id: 'a1' }], setFields: jest.fn(), isValid: true, isPristine: false },
      { fields: [{ id: 'm1' }], setFields: jest.fn(), isValid: true, isPristine: true }
    );
    renderPane({ isLoading: true });
    expect(screen.getByTestId('save-disabled')).toHaveTextContent('true');
  });
});
