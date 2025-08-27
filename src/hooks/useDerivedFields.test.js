import { useState } from 'react';
import { render, screen, waitFor, cleanup } from '@folio/jest-config-stripes/testing-library/react';
import { useDerivedFields } from './useDerivedFields';

let mockSetForDeleteTrueIndex = -1;
let mockSetForDeleteFalseIndex = -1;
let mockSuppressFromDiscoveryTrueIndex = -1;
let mockSuppressFromDiscoveryFalseIndex = -1;

jest.mock(
  '../components/BulkEditPane/BulkEditListResult/BulkEditInApp/helpers',
  () => {
    // Re-import mocked constants so we can compare option names safely.
    const { ACTIONS, OPTIONS } = jest.requireMock('../constants');

    return {
      getActionIndex: jest.fn((fields, option, action) => {
        if (
          option === OPTIONS.SET_RECORDS_FOR_DELETE &&
          action === ACTIONS.SET_TO_TRUE
        ) return mockSetForDeleteTrueIndex;

        if (
          option === OPTIONS.SET_RECORDS_FOR_DELETE &&
          action === ACTIONS.SET_TO_FALSE
        ) return mockSetForDeleteFalseIndex;

        if (
          option === OPTIONS.SUPPRESS_FROM_DISCOVERY &&
          action === ACTIONS.SET_TO_TRUE
        ) return mockSuppressFromDiscoveryTrueIndex;

        if (
          option === OPTIONS.SUPPRESS_FROM_DISCOVERY &&
          action === ACTIONS.SET_TO_FALSE
        ) return mockSuppressFromDiscoveryFalseIndex;

        return -1;
      }),

      // Make this behave realistically by scanning the array.
      getOptionIndex: jest.fn((fields, option) => (Array.isArray(fields)
        ? fields.findIndex(f => f.option === option)
        : -1)),
    };
  }
);

function HookHarness({ initialFields }) {
  const [fields, setFields] = useState(initialFields);
  useDerivedFields(fields, setFields);

  return (
    <pre data-testid="state">
      {JSON.stringify(fields, null, 2)}
    </pre>
  );
}

afterEach(() => {
  cleanup();
  mockSetForDeleteTrueIndex = -1;
  mockSetForDeleteFalseIndex = -1;
  mockSuppressFromDiscoveryTrueIndex = -1;
  mockSuppressFromDiscoveryFalseIndex = -1;
});

const makeInitialFields = (OPTIONS) => ([
  {
    option: OPTIONS.STAFF_SUPPRESS,
    actionsDetails: {
      actions: [{ name: '', parameters: [] }],
    },
  },
  {
    option: OPTIONS.SUPPRESS_FROM_DISCOVERY,
    actionsDetails: {
      actions: [{ name: '', parameters: [{ name: 'value', value: false }] }],
    },
  },
  {
    option: 'OTHER',
    actionsDetails: {
      actions: [{ name: '', parameters: [] }],
    },
  },
]);

describe('useDerivedFields', () => {
  const { ACTIONS, OPTIONS } = jest.requireMock('../constants');

  test('when "Set for Delete" is toggled TRUE, it sets STAFF_SUPPRESS and SUPPRESS_FROM_DISCOVERY actions to SET_TO_TRUE', async () => {
    mockSetForDeleteTrueIndex = 0;  // simulate presence of SET_RECORDS_FOR_DELETE -> SET_TO_TRUE

    render(<HookHarness initialFields={makeInitialFields(OPTIONS)} />);

    await waitFor(() => {
      const json = JSON.parse(screen.getByTestId('state').textContent);
      const staff = json.find(f => f.option === OPTIONS.STAFF_SUPPRESS);
      const sfd = json.find(f => f.option === OPTIONS.SUPPRESS_FROM_DISCOVERY);

      expect(staff.actionsDetails.actions.every(a => a.name === ACTIONS.SET_TO_TRUE)).toBe(true);
      expect(sfd.actionsDetails.actions.every(a => a.name === ACTIONS.SET_TO_TRUE)).toBe(true);
    });
  });

  test('when "Set for Delete" is toggled FALSE, it clears actions name ("") for STAFF_SUPPRESS and SUPPRESS_FROM_DISCOVERY', async () => {
    mockSetForDeleteFalseIndex = 1; // simulate the presence of SET_RECORDS_FOR_DELETE -> SET_TO_FALSE

    render(<HookHarness initialFields={makeInitialFields(OPTIONS)} />);

    await waitFor(() => {
      const json = JSON.parse(screen.getByTestId('state').textContent);
      const staff = json.find(f => f.option === OPTIONS.STAFF_SUPPRESS);
      const sfd = json.find(f => f.option === OPTIONS.SUPPRESS_FROM_DISCOVERY);

      expect(staff.actionsDetails.actions.every(a => a.name === '')).toBe(true);
      expect(sfd.actionsDetails.actions.every(a => a.name === '')).toBe(true);
    });
  });

  test('when "Suppress from Discovery" is toggled, it updates parameters.value to the correct boolean', async () => {
    // Case 1: toggled TRUE
    mockSuppressFromDiscoveryTrueIndex = 2;

    const { rerender } = render(<HookHarness initialFields={makeInitialFields(OPTIONS)} />);

    await waitFor(() => {
      const json = JSON.parse(screen.getByTestId('state').textContent);
      const sfd = json.find(f => f.option === OPTIONS.SUPPRESS_FROM_DISCOVERY);

      sfd.actionsDetails.actions.forEach(a => a.parameters.forEach(p => expect(p.value).toBe(true)));
    });

    // Case 2: toggled FALSE
    mockSuppressFromDiscoveryTrueIndex = -1;
    mockSuppressFromDiscoveryFalseIndex = 3;

    rerender(<HookHarness initialFields={makeInitialFields(OPTIONS)} />);

    await waitFor(() => {
      const json = JSON.parse(screen.getByTestId('state').textContent);
      const sfd = json.find(f => f.option === OPTIONS.SUPPRESS_FROM_DISCOVERY);

      sfd.actionsDetails.actions.forEach(a => a.parameters.forEach(p => expect(p.value).toBe(false)));
    });
  });

  test('if STAFF_SUPPRESS or SUPPRESS_FROM_DISCOVERY exist and "Set for Delete" TRUE, force their action name to SET_TO_TRUE', async () => {
    mockSetForDeleteTrueIndex = 0;

    render(<HookHarness initialFields={makeInitialFields(OPTIONS)} />);

    await waitFor(() => {
      const json = JSON.parse(screen.getByTestId('state').textContent);
      const staff = json.find(f => f.option === OPTIONS.STAFF_SUPPRESS);
      const sfd = json.find(f => f.option === OPTIONS.SUPPRESS_FROM_DISCOVERY);

      expect(staff.actionsDetails.actions.every(a => a.name === ACTIONS.SET_TO_TRUE)).toBe(true);
      expect(sfd.actionsDetails.actions.every(a => a.name === ACTIONS.SET_TO_TRUE)).toBe(true);
    });
  });
});
