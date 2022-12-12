import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { within } from '@testing-library/dom';
import { MemoryRouter } from 'react-router-dom';
import { QueryClientProvider } from 'react-query';

import '../../../test/jest/__mock__';

import { queryClient } from '../../../test/jest/utils/queryClient';
import { CAPABILITIES, CAPABILITIES_VALUE } from '../../constants';
import RetrievedDataList from './RetrievedDataList';
import { listUsers } from '../../../test/jest/__mock__/fakeData';


const renderRetrievedDataList = (capability) => {
  render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={[`/bulk-edit?capabilities=${capability}`]}>
        <RetrievedDataList />
      </MemoryRouter>,
    </QueryClientProvider>,
  );
};

describe('Render RetrievedDataList', () => {
  it('Should render user list if match capabilities', () => {
    [CAPABILITIES.USER, CAPABILITIES.ITEM, CAPABILITIES.HOLDINGS].forEach(capability => {
      renderRetrievedDataList(capability);

      waitFor(() => {
        const rows = screen.getAllByRole('row');

        rows.forEach((row, index) => {
          listUsers.rows[index].row.forEach(r => expect(within(row).getByText(r)).toBeInTheDocument());
        });
      });
    });
  });

  it('Should render correct title info', () => {
    [CAPABILITIES.USER, CAPABILITIES.ITEM, CAPABILITIES.HOLDINGS].forEach(capability => {
      renderRetrievedDataList(capability);

      waitFor(() => {
        const matched = 10;

        screen.findByText(`${matched} matching ${CAPABILITIES_VALUE[capability]} records found.`);
      });
    });
  });
});
