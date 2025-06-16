import { StudySession } from '@prisma/client';
import { getTimeDifferenceInSeconds } from './time';

export function formatStudySession(studySession: StudySession) {
  const duration = getTimeDifferenceInSeconds(
    studySession.startTime,
    studySession.endTime,
  );

  const displayedStartTime = studySession.startTime
    .toISOString()
    .split('T')[1]
    .slice(0, 5);

  const displayedEndTime = studySession.endTime
    .toISOString()
    .split('T')[1]
    .slice(0, 5);

  return { ...studySession, duration, displayedStartTime, displayedEndTime };
}

export function formatStudySessions(studySessions: StudySession[]) {
  return studySessions.map((studySession) => formatStudySession(studySession));
}
