import React, { useState, useEffect } from 'react';
import { useUI } from '../../contexts/UIContext';
import './ClockWidget.css';

export default function ClockWidget() {
  const { clockPref } = useUI();
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  if (!clockPref.showClock) return null;

  // Format Hours, Minutes, Seconds
  let hours = time.getHours();
  const minutes = String(time.getMinutes()).padStart(2, '0');
  const seconds = String(time.getSeconds()).padStart(2, '0');
  let ampm = '';

  if (!clockPref.format24h) {
    ampm = hours >= 12 ? ' PM' : ' AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
  }
  const formattedHours = String(hours).padStart(2, '0');

  // Format Date and Day
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June', 
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  
  const dayName = days[time.getDay()];
  const dateNum = time.getDate();
  const monthName = months[time.getMonth()];
  const yearName = time.getFullYear();

  return (
    <div className="clock-widget-glass">
      <div className="clock-time">
        {formattedHours}:{minutes}
        {clockPref.showSeconds && <span className="clock-seconds">:{seconds}</span>}
        {!clockPref.format24h && <span className="clock-ampm">{ampm}</span>}
      </div>
      {clockPref.showDate && (
        <div className="clock-date-container">
          <span className="clock-day">{dayName}</span>
          <span className="clock-date">{dateNum} {monthName} {yearName}</span>
        </div>
      )}
    </div>
  );
}
