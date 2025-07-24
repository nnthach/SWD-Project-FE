import React, { useEffect, useState } from "react";
import styles from "./CycleDetail.module.scss";
import axios from "../../config/axios";
import {
  addMonths,
  subMonths,
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  isSameMonth,
  differenceInDays,
  parseISO,
  parse,
} from "date-fns";

const dayTypeMap = {
  menstruation: { icon: "🩸", class: "icon-period" },
  fertile: { icon: "♥", class: "icon-fertile" },
  highfertility: { icon: "♥", class: "icon-high-fertile" },
  ovulation: { icon: "♥", class: "icon-ovulation" },
  relativesafe: { icon: "✓", class: "icon-safe" },
  absolutesafe: { icon: "✓", class: "icon-absolute-safe" },
  takepill: { icon: "💊", class: "icon-takepill" },
};

const CycleDetail = () => {
  const [calendarData, setCalendarData] = useState([]);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [isChecked, setIsChecked] = useState(false);

  const processCycle = (data) => {
    const result = [];

    const start = parseISO(data.startDate); // yyyy-MM-dd
    const end = parse(data.endDate, "dd-MM-yyyy", new Date());
    const ovulation = parse(data.ovulationDate, "dd-MM-yyyy", new Date());
    const pill = parse(data.pillReminder, "dd-MM-yyyy", new Date());
    const fertileStart = parse(data.fertilityWindowStart, "dd-MM-yyyy", new Date());
    const fertileEnd = parse(data.fertilityWindowEnd, "dd-MM-yyyy", new Date());

    let current = new Date(start);

    while (current <= end) {
      let dayType = null;

      if (current >= start && current < addDays(start, data.periodLength)) {
        dayType = "menstruation";
      } else if (current.toDateString() === ovulation.toDateString()) {
        dayType = "ovulation";
      } else if (current >= fertileStart && current <= fertileEnd) {
        const diff = differenceInDays(ovulation, current);
        if (diff === 2 || diff === 1) {
          dayType = "highfertility";
        } else {
          dayType = "fertile";
        }
      } else if (current.toDateString() === pill.toDateString()) {
        dayType = "takepill";
      } else {
        dayType = "relativesafe";
      }

      result.push({
        date: current.toISOString(),
        dayType,
      });

      current = addDays(current, 1);
    }

    return result;
  };

  useEffect(() => {
    const fetchCycle = async () => {
      try {
        const res = await axios.get("/menstrualcycle/latest");
        console.log("✅ Cycle data:", res.data);
        const days = processCycle(res.data);
        setCalendarData(days);
      } catch (error) {
        console.error("❌ Error fetching cycle data:", error);
      }
    };

    fetchCycle();
  }, []);

  const getDayType = (date) => {
    return calendarData.find(
      (item) => new Date(item.date).toDateString() === date.toDateString()
    )?.dayType || null;
  };

  const formatMonthYear = (date) => format(date, "MMMM yyyy");

  const previousMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));

  const generateCalendar = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart, { weekStartsOn: 0 });
    const endDate = endOfWeek(monthEnd, { weekStartsOn: 0 });

    const days = [];
    let day = startDate;

    while (day <= endDate) {
      const isCurrentMonth = isSameMonth(day, monthStart);
      const type = getDayType(day);
      const typeInfo = type ? dayTypeMap[type] : null;

      days.push(
        <div
          key={day}
          className={`${styles["day-cell"]} 
                      ${!isCurrentMonth ? styles["other-month"] : ""} 
                      ${type ? styles[type] : ""}`}
        >
          <div className={styles["day-number"]}>{format(day, "d")}</div>
          {typeInfo && (
            <span className={`${styles["day-icon"]} ${styles[typeInfo.class]}`}>
              {typeInfo.icon}
            </span>
          )}
        </div>
      );

      day = addDays(day, 1);
    }

    return days;
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>Your Cycle Overview</div>
      <div className={styles["calendar-container"]}>
        <div className={styles["calendar-header"]}>
          <button className={styles["nav-btn"]} onClick={previousMonth}>‹</button>
          <div className={styles["month-title"]}>{formatMonthYear(currentMonth)}</div>
          <button className={styles["nav-btn"]} onClick={nextMonth}>›</button>
        </div>

        <div className={styles.calendar}>
          <div className={styles["calendar-grid"]}>
            <div className={styles["day-header"]}>Sun</div>
            <div className={styles["day-header"]}>Mon</div>
            <div className={styles["day-header"]}>Tue</div>
            <div className={styles["day-header"]}>Wed</div>
            <div className={styles["day-header"]}>Thu</div>
            <div className={styles["day-header"]}>Fri</div>
            <div className={styles["day-header"]}>Sat</div>
            {generateCalendar()}
          </div>
        </div>
      </div>

      <div className={styles.legend}>
        {Object.entries(dayTypeMap).map(([key, { icon, class: className }]) => (
          <div key={key} className={styles["legend-item"]}>
            <div className={`${styles["legend-icon"]} ${styles[className]}`}>{icon}</div>
            <div>
              <div className={styles["legend-title-text"]}>
                {{
                  menstruation: "Menstruation",
                  fertile: "Fertile Day",
                  highfertility: "High Fertility",
                  ovulation: "Ovulation",
                  relativesafe: "Relatively Safe",
                  absolutesafe: "Absolutely Safe",
                  takepill: "Take Pill",
                }[key]}
              </div>
              <div className={styles["legend-description"]}>
                {{
                  menstruation: "You are on your period.",
                  fertile: "You are within the fertile window.",
                  highfertility: "2 days before ovulation – high fertility.",
                  ovulation: "Peak fertility day.",
                  relativesafe: "Lower chance of conception.",
                  absolutesafe: "Very low chance of conception.",
                  takepill: "Don't forget to take your birth control pill.",
                }[key]}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CycleDetail;
