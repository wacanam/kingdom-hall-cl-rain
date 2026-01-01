import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Droplet, 
  Sparkles,
  Wind,
  Waves,
} from 'lucide-react'
import { 
  Broom,
  Toilet,
  Bathtub,
  Drop,
  PaintBucket,
  HandSoap,
} from '@phosphor-icons/react'

const cleaningIcons = [
  { Icon: Broom, label: 'Broom', isPhosphor: true },
  { Icon: Toilet, label: 'Toilet', isPhosphor: true },
  { Icon: Bathtub, label: 'Bathtub', isPhosphor: true },
  { Icon: HandSoap, label: 'Soap', isPhosphor: true },
  { Icon: PaintBucket, label: 'Bucket', isPhosphor: true },
  { Icon: Drop, label: 'Drop', isPhosphor: true },
  { Icon: Droplet, label: 'Droplet', isPhosphor: false },
  { Icon: Sparkles, label: 'Sparkles', isPhosphor: false },
  { Icon: Wind, label: 'Wind', isPhosphor: false },
  { Icon: Waves, label: 'Waves', isPhosphor: false },
]

export function CleaningIcon() {
  const [currentIndex, setCurrentIndex] = useState(0)
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % cleaningIcons.length)
    }, 2000)
    
    return () => clearInterval(interval)
  }, [])
  
  const { Icon, isPhosphor } = cleaningIcons[currentIndex]
  
  return (
    <div className="relative h-12 w-12">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ scale: 0.8, opacity: 0, rotate: -20 }}
          animate={{ scale: 1, opacity: 1, rotate: 0 }}
          exit={{ scale: 0.8, opacity: 0, rotate: 20 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="absolute inset-0 flex items-center justify-center"
        >
          {isPhosphor ? (
            <Icon className="h-12 w-12 text-white" weight="duotone" />
          ) : (
            <Icon className="h-12 w-12 text-white" />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
