import { useState, useEffect } from 'react'
import { getDocuments } from '@/app/actions/documents/actions-documents'
import { Document } from '@prisma/client'
import { motion } from 'framer-motion'
import { IconSpinner } from './ui/icons'

// Props for selecting a document
interface DocumentListProps {
  selectDocument: (document: Document) => void
  selectedDocuments: Document[]
}

export function DocumentList({
  selectDocument,
  selectedDocuments
}: DocumentListProps) {
  const [documents, setDocuments] = useState<Document[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [isLoading, setIsLoading] = useState(false) // Loading state
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
    const fetchDocuments = async () => {
      setIsLoading(true)
      try {
        const { documents, totalPages } = await getDocuments(
          currentPage,
          perPage
        ) as {
          documents: Document[],
          totalPages: number
        }
        setDocuments(documents)
        setTotalPages(totalPages)
        console.log('Documents:', documents, 'Total pages:', totalPages)
      } catch (error) {
        console.error('Failed to fetch documents:', error)
        // Optionally, handle errors here
      } finally {
        setIsLoading(false)
      }
    }

    fetchDocuments()
  }, [currentPage])

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber)
  }

  return (
    <motion.div className="">
      <h2 className="text-md font-semibold mb-4">Saved Documents</h2>
      {isLoading ? (
        <IconSpinner className="size-6 animate-spin" />
      ) : documents.length > 0 ? (
        <motion.ul className="space-y-3">
          {documents.map((document, index) => (
            <motion.li
              key={document.id}
              className={`my-2 flex items-center justify-between hover:text-muted w-full cursor-pointer border rounded-lg p-3 ${selectedDocuments.some(d => d.id === document.id) ? 'text-muted bg-white' : 'hover:bg-white'} transition-colors duration-200 ease-in-out`}
              onClick={() => selectDocument(document)}
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              custom={index}
            >
              <p className="font-semibold">{document.name}</p>
              <p>
                Tokens: <span>{document.contextSize}</span>
              </p>
            </motion.li>
          ))}
        </motion.ul>
      ) : (
        <p className="text-gray-500">No documents found.</p>
      )}
      <div className="flex justify-center space-x-2 mt-4">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNumber => (
          <button
            key={pageNumber}
            className={`px-3 py-1 border rounded ${pageNumber === currentPage ? 'bg-muted text-white' : 'bg-transparent hover:bg-muted text-white'}`}
            onClick={() => handlePageChange(pageNumber)}
            disabled={pageNumber === currentPage}
          >
            {pageNumber}
          </button>
        ))}
      </div>
    </motion.div>
  )
}

export default DocumentList
