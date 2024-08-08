import React, { useEffect, useRef, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { IconSpinner } from './ui/icons'
import { motion } from 'framer-motion'
import { Document } from '@prisma/client'
import { readFileandTokenize } from '@/app/actions/documents/actions-documents'

interface DropzoneProps {
  onChange: (newFiles: File[]) => void
  className?: string
  fileExtension?: string
  handleCallback?: (tokens: number) => void
  isUploading?: (isUploading: boolean) => void
  addDocument: (document: Document) => void
}

export function Dropzone({
  onChange,
  className,
  fileExtension,
  handleCallback,
  isUploading,
  addDocument,
  ...props
}: DropzoneProps) {
  interface TokenHistory {
    tokens: number
    file: File
  }

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [totalTokens, setTotalTokens] = useState(0);
  const [tokenHistory, setTokenHistory] = useState<{ tokens: number; file: File }[]>([]);
  const [uploadingFiles, setUploadingFiles] = useState<Set<string>>(new Set());

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (index: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: index * 0.1, duration: 0.5 }
    })
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    const { files } = e.dataTransfer
    handleFiles(files)
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log('Files:', e.target.files)
    const { files } = e.target
    if (files) {
      handleFiles(files)
    }
  }

  const handleFiles = async (incomingFiles: FileList) => {
    const MAX_FILE_SIZE = 60 * 1024 * 1024; // 60MB
    const validFiles = Array.from(incomingFiles).filter(
      file => !fileExtension || file.name.endsWith(`.${fileExtension}`) && file.size <= MAX_FILE_SIZE 
    )
    if (validFiles.length !== incomingFiles.length) {
      const invalidFiles = Array.from(incomingFiles).filter(file => file.size > MAX_FILE_SIZE).map(file => file.name);

      if (invalidFiles.length > 0) {
        setError(`Some files were rejected. File size limit is 60MB. The following file(s) exceed the limit: ${invalidFiles.join(', ')}`) 
      } else {
        setError(`Some files were rejected. Allowed type: .${fileExtension}`)
      }

    } else {
      setError(null)
    }

    // updating the total tokens
    validFiles.forEach(async file => {
      const formData = new FormData()
      formData.append('file', file)
      
      // Mark the file as uploading
      setUploadingFiles(prev => {
        const newSet = new Set(prev)
        newSet.add(file.name)
        return newSet
      })
    
      if (isUploading) {
        isUploading(true)
      }
    
      const res = await readFileandTokenize(formData)
    
      if (res && res.tokenized) {
        // Update total tokens
        setTotalTokens(prevTokens => prevTokens + res.tokenized.length)
        
        if (res.document) {
          addDocument(res.document)
        }
    
        // Update the token history
        setTokenHistory(prevHistory => [
          ...prevHistory,
          { tokens: res.tokenized.length, file }
        ])
    
        if (handleCallback) {
          handleCallback(totalTokens + res.tokenized.length)
        }
      }
    
      // After upload and processing are done
      setUploadingFiles(prev => {
        const updated = new Set(prev)
        updated.delete(file.name) // Unmark the file as uploading
        return updated
      })
    
      // Check if any files are still uploading
      if (isUploading) {
        isUploading(uploadingFiles.size > 0)
      }
    })
    

    setFiles(prevFiles => [...prevFiles, ...validFiles])
    onChange([...files, ...validFiles])
  }

  const handleRemoveFile = (
    e: React.MouseEvent<HTMLButtonElement>,
    fileName: string
  ) => {
    e.stopPropagation() // This stops the event from reaching the Card component

    const updatedFiles = files.filter(file => file.name !== fileName)
    setFiles(updatedFiles)
    onChange(updatedFiles)

    // updating the total tokens
    const removedFile = tokenHistory.find(file => file.file.name === fileName)
    if (removedFile) {
      setTotalTokens(prevTokens => prevTokens - removedFile.tokens)
    }

    if (handleCallback && removedFile) {
      handleCallback(totalTokens - removedFile.tokens)
    }
  }

  const handleCardClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  useEffect(() => {
    console.log('Total tokens:', totalTokens)
  }, [totalTokens])

  return (
    <>
      <Card
        className={`border-2 border-dashed bg-transparent hover:cursor-pointer hover:border-muted-foreground/50 ${className}`}
        onClick={handleCardClick}
        {...props}
      >
        <CardContent
          className="flex flex-col items-center justify-center space-y-2 px-2 py-4 text-xs"
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <div className="flex items-center justify-center text-muted-foreground">
            <span className="font-medium">
              Drag and Drop Files Here or Click to Upload
            </span>
            <input
              ref={fileInputRef}
              type="file"
              accept={fileExtension ? `.${fileExtension}` : undefined}
              onChange={handleFileInputChange}
              className="hidden"
              multiple
            />
          </div>
          {error && <span className="text-red-500">{error}</span>}
        </CardContent>
      </Card>
      <motion.div className="space-y-3">
        {files.map((file, index) => (
          <motion.div
            key={index}
            className={`flex justify-between items-center w-full p-3 border rounded-lg bg-transparent transition-colors duration-200 ease-in-out`}
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            custom={index}
          >
            <div className="flex items-center">
              {uploadingFiles.has(file.name) ? (
                <IconSpinner className="mr-2 animate-spin self-center" />
              ) : null}
              <p>{`${file.name} (${Math.round(file.size / 1024)} KB)`}</p>
            </div>
            <div className="flex items-center">
              <p className="mr-4">
                Tokens:{' '}
                {tokenHistory.find(item => item.file.name === file.name)?.tokens || 0}{' '}
                tokens
              </p>
              <button
                onClick={(e) => handleRemoveFile(e, file.name)}
                className="text-red-500 hover:text-red-700"
              >
                Remove
              </button>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </>
  );
}
