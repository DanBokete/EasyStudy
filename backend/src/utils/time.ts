export function getTimeDifferenceInSeconds(startTime: Date, endTime: Date) {
  if (endTime < startTime) {
    endTime.setDate(startTime.getDate() + 1);
  }

  const timeDifferenceInSeconds = Math.floor(
    (endTime.getTime() - startTime.getTime()) / 1000,
  );

  return timeDifferenceInSeconds;
}
