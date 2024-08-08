import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { IconSpinner } from './ui/icons'
import { RCourse } from '@/lib/types'
import { getCourses } from '@/app/actions/canvas/actions'

// Props for selecting a course
interface CourseListProps {
  selectCourse: (course: any) => void
  selectedCourse: RCourse | null
}

export function CourseList({ selectCourse, selectedCourse }: CourseListProps) {
  const [allCourses, setAllCourses] = useState<any[]>([])
  const [displayedCourses, setDisplayedCourses] = useState<any[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const perPage = 5

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (index: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: index * 0.1, duration: 0.5 }
    })
  }

  useEffect(() => {
    const fetchAllCourses = async (page: number) => {
      setIsLoading(true)
      try {
        const response: RCourse[] = await getCourses(page, perPage)
        if (response && response.length > 0) {
          setAllCourses(prevCourses => [...prevCourses, ...response])
          fetchAllCourses(page + 1)  // Recursively fetch next page
        } else {
          setIsLoading(false)  // Stop loading when no more courses are found
          setCurrentPage(1)  // Reset to first page for display
        }
      } catch (error) {
        console.error('Failed to fetch courses:', error)
        setIsLoading(false)
      }
    }

    fetchAllCourses(1)  // Start fetching from page 1
  }, [])
  useEffect(() => {
    // Calculate the slice of courses to display based on the current page
    const startIndex = (currentPage - 1) * perPage
    const endIndex = startIndex + perPage
    setDisplayedCourses(allCourses.slice(startIndex, endIndex))
  }, [currentPage, allCourses])

  const handleNextPage = () => {
    setCurrentPage(current => current + 1)
  }

  const handlePrevPage = () => {
    setCurrentPage(current => current - 1)
  }

  return (
    <motion.div className="">
      <h2 className="text-xl font-bold mb-4">Available Courses</h2>
      {isLoading ? (
        <IconSpinner className="size-6 animate-spin" />
      ) : displayedCourses.length > 0 ? (
        <motion.ul className="space-y-3">
          {displayedCourses.map((course, index) => (
            <motion.li
              key={course.id}
              className={`my-2 flex items-center justify-between hover:text-muted w-full cursor-pointer border rounded-lg p-3 ${selectedCourse?.id === course.id ? 'text-muted bg-white' : 'hover:bg-white'} transition-colors duration-200 ease-in-out`}
              onClick={() => selectCourse(course)}
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              custom={index}
            >
              <p className="font-semibold">{course.name}</p>
              <p>
                Select
              </p>
            </motion.li>
          ))}
        </motion.ul>
      ) : (
        <p className="text-gray-500">No courses found.</p>
      )}
      <div className="flex justify-center space-x-2 mt-4">
        <button
          className={`px-4 py-1 border rounded ${currentPage > 1 ? 'hover:bg-muted text-white' : 'bg-transparent dark:text-muted cursor-not-allowed'}`}
          onClick={handlePrevPage}
          disabled={currentPage <= 1}
        >
          Prev
        </button>
        <button
          className={`px-4 py-1 border rounded ${currentPage * perPage < allCourses.length ? 'hover:bg-muted text-white' : 'bg-transparent dark:text-muted cursor-not-allowed'}`}
          onClick={handleNextPage}
          disabled={currentPage * perPage >= allCourses.length}
        >
          Next
        </button>
      </div>
    </motion.div>
  )
}

export default CourseList
