import { useEffect, useState } from 'react';

export const usePulling = ({
  refetchingTimeout = 20000,
  dependencies = [],
  interval = 300,
  stopCondition,
}) => {
  const [refetchInterval, setRefetchInterval] = useState(interval);

  let timeout;

  useEffect(() => {
    timeout = setTimeout(() => {
      setRefetchInterval(0);
    }, refetchingTimeout);

    if (stopCondition) {
      setRefetchInterval(0);
    }

    return () => {
      clearTimeout(timeout);
    };
  }, dependencies);

  return {
    refetchInterval,
  };
};
