import { useGetCurrencyRateQuery } from "@/services/api"
import { useState } from "react";
import { DatePicker } from "@heroui/date-picker";
import { getLocalTimeZone, today } from "@internationalized/date";
import type { DateValue } from "@internationalized/date";


export const SelectDate = () => {
    const [value, setValue] = useState<DateValue | null>(
        today(getLocalTimeZone())
    );

    const formatDate = (date: Date): string => date.toISOString().split("T")[0];
    const [selectedDate, setSelectedDate] = useState<string>(formatDate(today(getLocalTimeZone()).toDate(getLocalTimeZone()))
    );

    const { isLoading } = useGetCurrencyRateQuery({ date: selectedDate });

    const onChangeDate = (date: DateValue) => {
        const formatted = formatDate(date.toDate(getLocalTimeZone()));
        setValue(date);
        setSelectedDate(formatted);
    };
    return (
        <DatePicker
            isRequired
            name="date"
            isDisabled={isLoading}
            fullWidth
            value={value}
            onChange={val => onChangeDate(val as DateValue)}
            maxValue={today(getLocalTimeZone())}
            minValue={today(getLocalTimeZone()).subtract({ days: 30 })}
            label="Fecha" />
    );
}



