import React, { useState } from 'react';
import { format } from 'date-fns';
import { CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { Popover, PopoverTrigger, PopoverContent } from '@radix-ui/react-popover';
import { DayPicker } from 'react-day-picker';
import { Button } from '@/components/ui/button'; // Adjust this path based on your project structure

const DatePicker = ({ className, selected } : {className?: any, selected: any}) => {
  const [date, setDate] = useState(null);

  const formattedDate = date ? format(date, "PPP") : 'Pick a date';

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className={`w-[280px] justify-start text-left font-normal ${!date && "text-muted-foreground"}`}>
          <CalendarIcon className="mr-2 h-4 w-4" />
          {formattedDate}
        </Button>
      </PopoverTrigger>
      <PopoverContent className={`p-0 ${className} bg-border rounded-md w-[400px]`}>
        <DayPicker
          mode="single"
          selected={date || selected}
          onSelect={(date) => {
            setDate(date || selected);
          }}
          showOutsideDays
          classNames={{
            months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
            month: "space-y-4",
            caption: "flex justify-center pt-1 relative items-center",
            caption_label: "text-sm font-medium",
            nav: "space-x-1 flex items-center",
            nav_button: "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100",
            nav_button_previous: "absolute left-1",
            nav_button_next: "absolute right-1",
            table: "w-full border-collapse space-y-1",
            head_row: "flex",
            head_cell: "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
            row: "flex w-full mt-2",
            cell: "h-9 w-9 text-center text-sm p-0 relative focus-within:relative focus-within:z-20",
            day: "h-9 w-9 p-0 font-normal opacity-100",
            day_selected: "bg-primary text-primary-foreground",
            day_today: "bg-accent text-accent-foreground",
            day_outside: "text-muted-foreground opacity-50",
            day_disabled: "text-muted-foreground opacity-50",
            day_range_middle: "bg-accent text-accent-foreground",
            day_hidden: "invisible",
          }}
          // components={{
          //   IconLeft: ChevronLeft,
          //   IconRight: ChevronRight
          // }}
        />
      </PopoverContent>
    </Popover>
  );
};

export default DatePicker;
