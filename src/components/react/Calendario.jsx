import React, { useState, useEffect } from 'react';
import './Styles/Calendar.css';

const Calendario = () => {
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [selectedDays, setSelectedDays] = useState([]);
    const [month, setMonth] = useState(new Date().getMonth());
    const [year, setYear] = useState(new Date().getFullYear());

    useEffect(() => {
        // Resetear el calendario al cambiar el mes o el año
        setStartDate(null);
        setEndDate(null);
        setSelectedDays([]);
    }, [month, year]);

    const renderCalendar = () => {
        const currentDate = new Date();
        const firstDayOfMonth = new Date(year, month, 1);
        const lastDayOfMonth = new Date(year, month + 1, 0);
        const numDaysInMonth = lastDayOfMonth.getDate();
        let startingDayOfWeek = firstDayOfMonth.getDay();
        if (startingDayOfWeek === 0) startingDayOfWeek = 7; // Ajustar para empezar desde el lunes
    
        const days = [];
        
        // Agregar los nombres de los días de la semana
        const dayNames = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
        for (let i = 0; i < 7; i++) {
            days.push(
                <div key={`day-name-${i}`} className="day day-name">
                    {dayNames[i]}
                </div>
            );
        }
    
        let dayCounter = 1;
        let nextMonthDayCounter = 1;
    
        for (let i = 1; i <= 42; i++) {
            if (i < startingDayOfWeek || dayCounter > numDaysInMonth) {
                // Placeholder para los días antes del primer día del mes
                days.push(<div key={`placeholder-${i}`} className="day placeholder"></div>);
            } else if (dayCounter <= numDaysInMonth) {
                // Agregar los números de los días del mes actual
                const currentDay = new Date(year, month, dayCounter);
                const isPastDay = currentDay < currentDate;
                const isSelectedDay = selectedDays.some(selectedDay =>
                    selectedDay.toDateString() === currentDay.toDateString()
                );
                days.push(
                    <div
                        key={`day-${dayCounter}`}
                        className={`day ${isPastDay ? 'past-day' : ''} ${isSelectedDay ? 'selected-day' : ''}`}
                        style={{
                            textDecoration: isPastDay ? 'line-through' : 'none',
                            color: isPastDay ? 'red' : 'inherit'
                        }}
                        onClick={() => handleDayClick(currentDay)}
                    >
                        {dayCounter}
                    </div>
                );
                dayCounter++;
            } else {
                // Placeholder para los días después del último día del mes
                days.push(<div key={`placeholder-${i}`} className="day placeholder"></div>);
            }
        }
    
        return days;
    };
    

    const handleDayClick = (clickedDay) => {
        if (!startDate || (startDate && endDate)) {
            setStartDate(clickedDay);
            setEndDate(null);
            setSelectedDays([clickedDay]);
        } else {
            if (clickedDay > startDate) {
                setEndDate(clickedDay);
                setSelectedDays([...selectedDays, clickedDay]);
            } else {
                setEndDate(startDate);
                setStartDate(clickedDay);
                setSelectedDays([clickedDay]);
            }
        }
    };

    const populateYearSelect = () => {
        const currentYear = new Date().getFullYear();
        const years = [];
        for (let year = currentYear; year <= currentYear + 10; year++) {
            years.push(
                <option key={year} value={year}>
                    {year}
                </option>
            );
        }
        return years;
    };

    const populateMonthSelect = () => {
        const months = [];
        for (let monthIndex = 0; monthIndex < 12; monthIndex++) {
            months.push(
                <option key={monthIndex} value={monthIndex}>
                    {new Date(0, monthIndex).toLocaleString("default", { month: "long" })}
                </option>
            );
        }
        return months;
    };

    return (
        <div className="contenedor-calendario mb-10">
            <div className="calendar">
                <div className="dropdown flex gap-2">
                    <select value={month} onChange={(e) => setMonth(parseInt(e.target.value))}>
                        {populateMonthSelect()}
                    </select>
                    <select value={year} onChange={(e) => setYear(parseInt(e.target.value))}>
                        {populateYearSelect()}
                    </select>
                </div>
                <div className="days">
                    {renderCalendar()}
                </div>
            </div>
        </div>
    );
};

export default Calendario;
