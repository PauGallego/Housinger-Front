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

function fakeFetch(date, { signal }) {

    let id = getRandomNumber(1, 100);
    const fetchPromise = fetch(`${API_BASE_URL}/v1/propertyCalendar/getByProperty/441`, { signal })
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
    const { highlightedDays = [], day, outsideCurrentMonth, ...other } = props;

    const isSelected =
        !props.outsideCurrentMonth && highlightedDays.indexOf(props.day.date()) >= 0;

    return (
        <Badge
            key={props.day.toString()}
            overlap="circular"
            badgeContent={isSelected ? '❌' : undefined} 
        >
            <PickersDay {...other} outsideCurrentMonth={outsideCurrentMonth} day={day} />
        </Badge>
    );
}

export default function DateCalendarServerRequest() {
    const requestAbortController = React.useRef(null);
    const [isLoading, setIsLoading] = React.useState(false);
    const [highlightedDays, setHighlightedDays] = React.useState([1, 2, 15]);
    const [entrada, setEntrada] = React.useState(initialValue);
    const [salida, setSalida] = React.useState(initialValue);


    const handleEntradaChange = (event) => {
        setEntrada(dayjs(event.target.value));
    };

    const handleSalidaChange = (event) => {
        setSalida(dayjs(event.target.value));
    };

    const fetchHighlightedDays = (date) => {
        const controller = new AbortController();
        fakeFetch(date, {
            signal: controller.signal,
        })
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

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <div>
                <DateCalendar
                    defaultValue={initialValue}
                    loading={isLoading}
                    onMonthChange={handleMonthChange}
                    renderLoading={() => <DayCalendarSkeleton />}
                    slots={{
                        day: ServerDay,
                    }}
                    slotProps={{
                        day: {
                            highlightedDays,
                        },
                    }}
                />
                <div className='flex gap-[60px] ml-[30px] md:ml-[130px] lg:ml-[0px]'>
                    <div>
                        <p htmlFor="entrada">Fecha de entrada:</p>
                        <input
                            type="date"
                            id="entrada"
                            value={entrada.format('YYYY-MM-DD')}
                            onChange={handleEntradaChange}
                        />
                    </div>
                    <div>
                        <p htmlFor="salida">Fecha de salida:</p>
                        <input
                            type="date"
                            id="salida"
                            value={salida.format('YYYY-MM-DD')}
                            onChange={handleSalidaChange}
                        />
                    </div>
                </div>
            </div>
        </LocalizationProvider>
    );
}
