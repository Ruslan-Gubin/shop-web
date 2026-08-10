import styles from "./SelectDeliveryTime.module.css";

const getDayTimes = (selectDate: string, todayDate: Date, end: number) => {
  const times: number[] = [];

  const isSelectToday =
    new Date(selectDate).toLocaleDateString() === todayDate.toLocaleDateString();

  let startHour = 10;

  if (isSelectToday) {
    const currentHours = todayDate.getHours();
    startHour = currentHours < 8 ? 10 : currentHours + 2;
  }

  for (let i = startHour; i < end; i++) {
    times.push(i);
  }

  return times;
};

type Props = {
  onChange: (date: number) => void;
  date: string;
  todayDate: Date;
  time: number;
  endWork: number;
};

export const SelectDeliveryTime = (props: Props) => {
  const rangeTimes = getDayTimes(props.date, props.todayDate, props.endWork);

  return (
    <>
      {rangeTimes.length > 0 && (
        <ul className={styles.calendarList}>
          {rangeTimes.map((item) => (
            <li key={item}>
              <button
                className={`${styles.calendarItem} ${props.time === item ? styles.selectDate : ""}`}
                type="button"
                onClick={() => props.onChange(item)}
              >
                <span className={styles.calendarNumber}>с {item}:00</span>
                <span className={styles.calendarNumber}>до {item + 1}:00</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </>
  );
};
