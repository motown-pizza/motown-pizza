import React from 'react';

export const useTime = () => {
  const [now, setNow] = React.useState(() => new Date());

  React.useEffect(() => {
    const update = () => setNow(new Date());

    // sync to next minute boundary
    const msToNextMinute = 60000 - (Date.now() % 60000);

    const timeout = setTimeout(() => {
      update();

      const interval = setInterval(update, 60000);
      // store interval id on window or closure
      (window as any).__minuteInterval = interval;
    }, msToNextMinute);

    return () => {
      clearTimeout(timeout);
      clearInterval((window as any).__minuteInterval);
    };
  }, []);

  return { now };
};
