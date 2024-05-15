import * as React from 'react';
import dayjs from 'dayjs';
import Badge from '@mui/material/Badge';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { PickersDay } from '@mui/x-date-pickers/PickersDay';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { DayCalendarSkeleton } from '@mui/x-date-pickers/DayCalendarSkeleton';
import { API_BASE_URL } from '../../astro.config';

function getRandomNumber(min, max) {
    return Math.round(Math.random() * (max - min) + min);
}

function fakeFetch(date, { signal }, id) {

    let superid = id.propid;

    const fetchPromise = fetch(`${API_BASE_URL}/v1/propertyCalendar/getByProperty/${superid}`, { signal })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            const today = dayjs();
            const daysInMonth = date.daysInMonth();
            const daysToHighlight = [];

            // Marcamos los días anteriores al día actual
            for (let i = 1; i <= daysInMonth; i++) {
                const currentDate = date.date(i);
                if (currentDate.isBefore(today, 'day')) {
                    daysToHighlight.push(i);
                }
            }

            // Marcamos los días dentro de los rangos de fechas reservadas
            for (let i = 0; i < data.reservedDates.length; i += 2) {
                const startDate = dayjs(data.reservedDates[i]);
                const endDate = dayjs(data.reservedDates[i + 1]);

                if (startDate.isSame(date, 'month') || endDate.isSame(date, 'month')) {
                    const startDay = startDate.isSame(date, 'month') ? startDate.date() : 1;
                    const endDay = endDate.isSame(date, 'month') ? endDate.date() : date.daysInMonth();

                    for (let j = startDay; j <= endDay; j++) {
                        if (!daysToHighlight.includes(j)) {
                            daysToHighlight.push(j);
                        }
                    }
                }
            }

            return { daysToHighlight };
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
            throw error;
        });

    return fetchPromise;
}

const initialValue = dayjs();

function ServerDay(props) {
    const { highlightedDays = [], day, outsideCurrentMonth, onClick, ...other } = props;

    const isSelected =
        !props.outsideCurrentMonth && highlightedDays.indexOf(props.day.date()) >= 0;

    const isDisabled = isSelected ? true : false; 

    const handleClick = () => {
        if (onClick) {
            onClick(day);
        }
    };

    return (
        <Badge
            key={props.day.toString()}
            overlap="circular"
            badgeContent={isSelected ? '❌' : undefined} 
        >
             <PickersDay
                {...other}
                outsideCurrentMonth={outsideCurrentMonth}
                day={day}
                disabled={isSelected}
                style={{ color: isDisabled ? 'grey' : 'black' }}
                onClick={handleClick} 
            />
        </Badge>
    );
}

export default function DateCalendarServerRequest(propid) {
    const requestAbortController = React.useRef(null);
    const [isLoading, setIsLoading] = React.useState(true);
    const [highlightedDays, setHighlightedDays] = React.useState([1, 2, 15]);
    const [selectedDate, setSelectedDate] = React.useState(initialValue);

    const fetchHighlightedDays = (date) => {
        const controller = new AbortController();
        fakeFetch(date, { signal: controller.signal }, propid)
            .then(({ daysToHighlight }) => {
                setHighlightedDays(daysToHighlight);
                setIsLoading(false);
            })
            .catch((error) => {
                if (error.name !== 'AbortError') {
                    throw error;
                }
            });

        requestAbortController.current = controller;
    };

    React.useEffect(() => {
        fetchHighlightedDays(initialValue);
       
        return () => requestAbortController.current?.abort();
    }, []);

    const handleMonthChange = (date) => {
        if (requestAbortController.current) {
            requestAbortController.current.abort();
        }

        setIsLoading(true);
        setHighlightedDays([]);
        fetchHighlightedDays(date);
    };

    const handleDayClick = (date) => {
        const formattedDate = date.format('YYYY-MM-DD HH:mm:ss');
        setSelectedDate(date);

        localStorage.setItem("first_date", formattedDate);
        console.log(formattedDate);
    };
    
    
    

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs} >
            <DateCalendar
                value={selectedDate}
                style={{ color:  'black' }}
                loading={isLoading}
                onMonthChange={handleMonthChange}
                renderLoading={() => <DayCalendarSkeleton />}
                slots={{
                    day: (props) => (
                        <ServerDay {...props} onClick={handleDayClick} />
                    ),
                }}
                slotProps={{
                    day: {
                        highlightedDays,
                    },
                }}
            />
        </LocalizationProvider>
    );
}
