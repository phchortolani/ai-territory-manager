"use client"

import * as React from "react"
import moment from "moment"
import "moment/locale/pt-br"
import { CalendarIcon } from "@radix-ui/react-icons"
import { DateRange } from "react-day-picker"
import { ptBR } from "date-fns/locale"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

moment.locale("pt-br")

export function DatePickerWithRange({ final_date, initial_date, onChange }: { initial_date?: Date, final_date?: Date, onChange?: (date: DateRange) => void }) {
    const [date, setDate] = React.useState<DateRange | undefined>({ from: initial_date, to: final_date, })

    function setDateRange(range: DateRange | undefined) {
        const from = range?.from
        const to = range?.to

        setDate({ from, to })
        if (onChange) {
            onChange({ from, to })
        }
    }

    return (
        <div className={cn("grid gap-2 w-full")}>
            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        id="date"
                        variant={"outline"}
                        className={cn(
                            " w-full  justify-start text-left font-normal",
                            !date && "text-muted-foreground"
                        )}
                    >
                        <CalendarIcon />
                        {date?.from ? (
                            date.to ? (
                                <>
                                    {moment(date.from).format("DD [de] MMM")} à {" "}
                                    {moment(date.to).format("DD [de] MMM")}
                                </>
                            ) : (
                                moment(date.from).format("LL")
                            )
                        ) : (
                            <span>Selecione uma data</span>
                        )}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                        initialFocus
                        mode="range"
                        defaultMonth={date?.from}
                        selected={date}
                        onSelect={(range) => setDateRange(range)}
                        numberOfMonths={2}
                        locale={ptBR}
                    />
                </PopoverContent>
            </Popover>
        </div>
    )
}
