import styles from "./SelectWeekDate.module.css";

const getWeekDays = (dateFrom: Date, countDay: number, end: number) => {
  const dates: Date[] = [];
  let incrementDay = 0;

  const currentHours = dateFrom.getHours();
  if (end - currentHours < 3) {
    incrementDay = 1;
  }

  for (let i = incrementDay; i < countDay + incrementDay; i++) {
    const newDate = new Date(dateFrom);
    newDate.setDate(dateFrom.getDate() + i);
    dates.push(newDate);
  }

  return dates;
};

type Props = {
  countDay: number;
  onChange: (date: string) => void;
  date: string;
  todayDate: Date;
  endWork: number;
};

export const SelectWeekDate = (props: Props) => {
  const rangeDate = getWeekDays(props.todayDate, props.countDay, props.endWork);

  const weekList = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];

  const checkIsToday = (date: Date): boolean =>
    date.toLocaleDateString() === props.todayDate.toLocaleDateString();

  const getInfoPanelClass = (date: Date) => {
    const classRoot = [styles.calendarItem];

    if (checkIsToday(date)) {
      classRoot.push(styles.calendarItemActive);
    }

    if (date.toDateString() === props.date) {
      classRoot.push(styles.selectDate);
    }

    return classRoot.join(" ");
  };

  const formatterDay = new Intl.DateTimeFormat("ru", {
    day: "2-digit",
    month: "short",
  });

  return (
    <ul className={styles.calendarList}>
      {rangeDate.map((item) => (
        <li key={item.toString()}>
          <button
            className={getInfoPanelClass(item)}
            type="button"
            onClick={() => props.onChange(item.toDateString())}
          >
            <span className={styles.calendarDay}>{weekList[item.getDay() - 1] ?? "Вс"},</span>
            <span className={styles.calendarNumber}>{formatterDay.format(item)}</span>
          </button>
        </li>
      ))}
    </ul>
  );
};
