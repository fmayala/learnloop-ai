import { computed, signal } from '@preact/signals-react'
import { useEffect, useState } from 'react'
import { FaRegClock } from 'react-icons/fa' // Importing clock icon from FontAwesome

// Format elapsed time in HH:MM:SS
const formatElapsedTime = (seconds: number) => {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const remainingSeconds = seconds % 60
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
}

export function TimeElapsed({ startTime }: { startTime?: number }) {
  const [count, setCount] = useState(
    Math.floor((Date.now() - (startTime ?? 0)) / 1000)
  )

  useEffect(() => {
    //Implementing the setInterval method
    const interval = setInterval(() => {
      setCount(count + 1)
    }, 1000)

    //Clearing the interval
    return () => clearInterval(interval)
  }, [count])

  return (
    <div className="flex items-center space-x-2">
      <FaRegClock className="text-muted-foreground" />
      <span>{formatElapsedTime(count)}</span>
    </div>
  )
}
