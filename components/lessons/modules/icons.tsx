// Icons can be imported from a library or defined as SVG components
import {
  FaBookOpen,
  FaImage,
  FaVideo,
  FaQuestionCircle,
  FaMusic,
  FaPenFancy,
  FaCheckDouble,
  FaPencilAlt
} from 'react-icons/fa'

export const ModuleIcon = ({ type, className }: { type: string, className?: string }) => {
  switch (type) {
    case 'video':
      return <FaVideo className={`text-lg ${className}`}  />
    case 'image':
      return <FaImage className={`text-lg ${className}`} />
    case 'article':
      return <FaBookOpen className={`text-lg ${className}`}  />
    case 'multiple-choice':
      return <FaQuestionCircle className={`text-lg ${className}`}  />
    case 'true/false':
      return <FaCheckDouble className={`text-lg ${className}`}  />
    case 'audio':
      return <FaMusic className={`text-lg ${className}`}  />
    case 'short-answer':
      return <FaPenFancy className={`text-lg ${className}`}  />
    case 'fitb':
        return <FaPencilAlt className={`text-lg ${className}`}  />
    case 'fill-in-the-blank':
        return <FaPencilAlt className={`text-lg ${className}`}  />
    case 'true-false':
        return <FaCheckDouble className={`text-lg ${className}`}  />
    default:
      return null // or a default icon
  }
}
