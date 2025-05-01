
import * as React from "react"
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface DatePickerProps {
  date?: Date | null
  onSelect?: (date: Date | undefined) => void
  defaultMonth?: Date
  mode?: "single" | "range" | "multiple"
  captionLayout?: "buttons" | "dropdown"
  disabled?: boolean
  className?: string
}

export function DatePicker({
  date,
  onSelect,
  defaultMonth,
  mode = "single",
  captionLayout = "dropdown",
  disabled = false,
  className,
}: DatePickerProps) {
  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-full justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
            disabled={disabled}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? format(date, "PPP") : <span>Pick a date</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode={mode}
            selected={date || undefined}
            onSelect={onSelect}
            defaultMonth={defaultMonth}
            captionLayout={captionLayout}
            initialFocus
            className={cn("p-3 pointer-events-auto")}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}
