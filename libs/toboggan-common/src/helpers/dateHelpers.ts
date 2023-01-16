interface IDateObj {
  sign: number;
  days: number;
  hours: number;
  minutes: number;
  diff: number;
}
const THRESHOLD_OF_RED = 0;
const THRESHOLD_OF_YELLOW = 6 * 60 * 60 * 1000; // 6 hours
type TDate = number | string | Date;

export const getTimeleftColor = (dateDiffObj:IDateObj) => {
  const timeLeftCellColor =dateDiffObj.diff < THRESHOLD_OF_RED
   ? 'gp-red-20'
   : dateDiffObj.diff >= THRESHOLD_OF_RED &&
     dateDiffObj.diff < THRESHOLD_OF_YELLOW
   ? 'gp-yellow-20'
   : '';
   return timeLeftCellColor;
 };

export const getDateDiffObject = (start: TDate, end: TDate) => {
  const startDate = new Date(start).getTime();
  const endDate = new Date(end).getTime();
  const dateDiff = endDate - startDate;
  const dateInMinutesDiff = Math.floor(dateDiff / 1000 / 60);
  const days = Math.trunc(dateInMinutesDiff / 1440);
  const hours = Math.trunc((dateInMinutesDiff % 1440) / 60);
  const minutes = Math.trunc((dateInMinutesDiff % 1440) % 60);

  const dateObj: IDateObj = {
    sign: 1,
    days: 0,
    hours: 0,
    minutes: 0,
    diff: dateDiff,
  };

  if (days < 0 || hours < 0 || minutes < 0) {
    dateObj.sign = -1;
  }

  if (days !== 0) {
    dateObj.days = Math.abs(days);
  }

  dateObj.hours = Math.abs(hours);
  dateObj.minutes = Math.abs(minutes);

  return dateObj;
};

export const getFormattedDateDiff = ({
  sign,
  days,
  hours,
  minutes,
}: IDateObj) => {
  let copy = '';

  if (sign < 0) {
    copy += '-';
  }

  if (days !== 0) {
    copy += days + 'd ';
  }

  copy += hours + 'hr ';
  copy += minutes + 'm';

  return copy;
};


