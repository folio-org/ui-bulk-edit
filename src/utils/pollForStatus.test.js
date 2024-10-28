import { useOkapiKy } from '@folio/stripes/core';
import { JOB_STATUSES } from '../constants';
import { pollForStatus } from './pollForStatus';

describe('pollForStatus', () => {
  const mockGet = jest.fn(() => ({
    json: (data) => Promise.resolve(data),
  }));
  jest.useFakeTimers();

  beforeEach(() => {
    mockGet.mockClear();
    useOkapiKy.mockClear().mockReturnValue({
      get: mockGet,
    });
  });

  afterEach(() => {
    jest.clearAllMocks(); // Сбрасываем все моки после каждого теста
  });

  it('should resolve with the final status when status is not DATA_MODIFICATION_IN_PROGRESS', async () => {
    const finalStatus = 'COMPLETED';
    mockGet
      .mockImplementationOnce(() => ({
        json: () => Promise.resolve({ status: JOB_STATUSES.DATA_MODIFICATION_IN_PROGRESS }),
      }))
      .mockImplementationOnce(() => ({
        json: () => Promise.resolve({ status: finalStatus }),
      }));

    const promise = pollForStatus(useOkapiKy(), 'mockId');

    // Эмулируем интервалы вручную
    jest.advanceTimersByTime(1000);
    await Promise.resolve();
    jest.advanceTimersByTime(1000);
    await Promise.resolve();

    await expect(promise).resolves.toBe(finalStatus);
    expect(mockGet).toHaveBeenCalledTimes(2);
  });

  it('should reject with an error if the request fails', async () => {
    const error = new Error('Request failed');
    mockGet.mockImplementationOnce(() => {
      throw error;
    });

    const promise = pollForStatus(useOkapiKy(), 'mockId');

    jest.advanceTimersByTime(1000);
    await Promise.resolve();

    await expect(promise).rejects.toThrow('Request failed');
    expect(mockGet).toHaveBeenCalledTimes(1);
  });
});
