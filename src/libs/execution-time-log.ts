export const logExecutionTime = (startTime: number): void => {
  const endTime = Date.now();
  const timeDiff = endTime - startTime;

  const seconds = Math.floor(timeDiff / 1000);
  const milliseconds = timeDiff % 1000;

  console.log(`===> execution time: ${seconds}s ${milliseconds}ms`);
};
