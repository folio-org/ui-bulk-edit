import { JOB_STATUSES } from '../constants';

export const pollForStatus = (ky, id) => {
  const interval = 1000;
  return new Promise((resolve, reject) => {
    const intervalId = setInterval(async () => {
      try {
        const data = await ky.get(`bulk-operations/${id}`).json();
        if (data.status !== JOB_STATUSES.DATA_MODIFICATION_IN_PROGRESS) {
          clearInterval(intervalId); resolve(data.status);
        }
      } catch (error) { clearInterval(intervalId); reject(error); }
    }, interval);
  });
};
