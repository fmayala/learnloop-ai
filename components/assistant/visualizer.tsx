import {
  useState,
  useEffect,
  useLayoutEffect,
  useRef,
  MouseEventHandler
} from 'react'

import './index.css'
import { BarItem, BarsData, Controls, GetBarsDataParams } from './types/types'
import { useWebWorker } from './helpers/useWebWorker'
import {
  drawByBlob,
  drawByLiveStream,
  formatToInlineStyleValue,
  getBarsData,
  initialCanvasSetup
} from './helpers'
import { useLatest } from './helpers/useLatest'
import { useDebounce } from './helpers/useDebounce'
import { motion } from 'framer-motion'

interface VoiceVisualizerProps {
  controls: Controls
  height?: string | number
  width?: string | number
  speed?: number
  backgroundColor?: string
  mainBarColor?: string
  secondaryBarColor?: string
  barWidth?: number
  gap?: number
  rounded?: number
  fullscreen?: boolean
  isControlPanelShown?: boolean
  isDownloadAudioButtonShown?: boolean
  animateCurrentPick?: boolean
  onlyRecording?: boolean
  isDefaultUIShown?: boolean
  defaultMicrophoneIconColor?: string
  defaultAudioWaveIconColor?: string
  mainContainerClassName?: string
  canvasContainerClassName?: string
  isProgressIndicatorShown?: boolean
  progressIndicatorClassName?: string
  isProgressIndicatorTimeShown?: boolean
  progressIndicatorTimeClassName?: string
  isProgressIndicatorOnHoverShown?: boolean
  progressIndicatorOnHoverClassName?: string
  isProgressIndicatorTimeOnHoverShown?: boolean
  progressIndicatorTimeOnHoverClassName?: string
  isAudioProcessingTextShown?: boolean
  audioProcessingTextClassName?: string
  controlButtonsClassName?: string
}

const VoiceVisualizer = ({
  controls: {
    audioRef,
    audioData,
    isRecordingInProgress,
    recordedBlob,
    duration,
    currentAudioTime,
    audioSrc,
    bufferFromRecordedBlob,
    togglePauseResume,
    startRecording,
    stopRecording,
    saveAudioFile,
    isAvailableRecordedAudio,
    isPausedRecordedAudio,
    isPausedRecording,
    isProcessingStartRecording,
    isProcessingRecordedAudio,
    isCleared,
    formattedDuration,
    formattedRecordingTime,
    formattedRecordedAudioCurrentTime,
    clearCanvas,
    setCurrentAudioTime,
    isProcessingOnResize,
    _setIsProcessingOnResize,
    _setIsProcessingAudioOnComplete
  },
  width = '100%',
  height = 200,
  speed = 3,
  backgroundColor = 'transparent',
  mainBarColor = '#FFFFFF',
  secondaryBarColor = '#5e5e5e',
  barWidth = 2,
  gap = 1,
  rounded = 5,
  isControlPanelShown = true,
  isDownloadAudioButtonShown = false,
  animateCurrentPick = true,
  fullscreen = false,
  onlyRecording = false,
  isDefaultUIShown = true,
  defaultMicrophoneIconColor = mainBarColor,
  defaultAudioWaveIconColor = mainBarColor,
  mainContainerClassName,
  canvasContainerClassName,
  isProgressIndicatorShown = !onlyRecording,
  progressIndicatorClassName,
  isProgressIndicatorTimeShown = true,
  progressIndicatorTimeClassName,
  isProgressIndicatorOnHoverShown = !onlyRecording,
  progressIndicatorOnHoverClassName,
  isProgressIndicatorTimeOnHoverShown = true,
  progressIndicatorTimeOnHoverClassName,
  isAudioProcessingTextShown = true,
  audioProcessingTextClassName,
  controlButtonsClassName
}: VoiceVisualizerProps) => {
  const [hoveredOffsetX, setHoveredOffsetX] = useState(0)
  const [canvasCurrentWidth, setCanvasCurrentWidth] = useState(0)
  const [canvasCurrentHeight, setCanvasCurrentHeight] = useState(0)
  const [canvasWidth, setCanvasWidth] = useState(0)
  const [isRecordedCanvasHovered, setIsRecordedCanvasHovered] = useState(false)
  const [screenWidth, setScreenWidth] = useState(window.innerWidth)
  const [isResizing, setIsResizing] = useState(false)

  const isMobile = screenWidth < 768
  const formattedSpeed = Math.trunc(speed)
  const formattedGap = Math.trunc(gap)
  const formattedBarWidth = Math.trunc(
    isMobile && formattedGap > 0 ? barWidth + 1 : barWidth
  )
  const unit = formattedBarWidth + formattedGap * formattedBarWidth

  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const picksRef = useRef<Array<BarItem | null>>([])
  const indexSpeedRef = useRef(formattedSpeed)
  const indexRef = useRef(formattedBarWidth)
  const index2Ref = useRef(formattedBarWidth)
  const canvasContainerRef = useRef<HTMLDivElement | null>(null)

  const currentScreenWidth = useLatest(screenWidth)

  const {
    result: barsData,
    setResult: setBarsData,
    run
  } = useWebWorker<BarsData[], GetBarsDataParams>({
    fn: getBarsData,
    initialValue: [],
    onMessageReceived: completedAudioProcessing
  })

  const debouncedOnResize = useDebounce(onResize)

  useEffect(() => {
    onResize()

    const handleResize = () => {
      if (currentScreenWidth.current === window.innerWidth) return

      if (isAvailableRecordedAudio) {
        setScreenWidth(window.innerWidth)
        _setIsProcessingOnResize(true)
        setIsResizing(true)
        debouncedOnResize()
      } else {
        setScreenWidth(window.innerWidth)
        onResize()
      }
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [width, isAvailableRecordedAudio])

  useLayoutEffect(() => {
    if (!canvasRef.current) return

    if (indexSpeedRef.current >= formattedSpeed || !audioData.length) {
      indexSpeedRef.current = audioData.length ? 0 : formattedSpeed
      drawByLiveStream({
        audioData,
        unit,
        index: indexRef,
        index2: index2Ref,
        canvas: canvasRef.current,
        picks: picksRef.current,
        isRecordingInProgress,
        isPausedRecording: isPausedRecording,
        backgroundColor,
        mainBarColor,
        secondaryBarColor,
        barWidth: formattedBarWidth,
        rounded,
        animateCurrentPick,
        fullscreen
      })
    }

    indexSpeedRef.current += 1
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    canvasRef.current,
    audioData,
    formattedBarWidth,
    backgroundColor,
    mainBarColor,
    secondaryBarColor,
    rounded,
    fullscreen,
    isDefaultUIShown,
    canvasWidth
  ])

  useEffect(() => {
    if (!isAvailableRecordedAudio) return

    if (isRecordedCanvasHovered) {
      canvasRef.current?.addEventListener('mouseleave', hideTimeIndicator)
    } else {
      canvasRef.current?.addEventListener('mouseenter', showTimeIndicator)
    }

    return () => {
      if (isRecordedCanvasHovered) {
        canvasRef.current?.removeEventListener('mouseleave', hideTimeIndicator)
      } else {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        canvasRef.current?.removeEventListener('mouseenter', showTimeIndicator)
      }
    }
  }, [isRecordedCanvasHovered, isAvailableRecordedAudio])

  useEffect(() => {
    if (
      !bufferFromRecordedBlob ||
      !canvasRef.current ||
      isRecordingInProgress ||
      isResizing
    ) {
      return
    }

    if (onlyRecording) {
      clearCanvas()
      return
    }

    picksRef.current = []
    const bufferData = bufferFromRecordedBlob.getChannelData(0)

    run({
      bufferData,
      height: canvasCurrentHeight,
      width: canvasWidth,
      barWidth: formattedBarWidth,
      gap: formattedGap
    })

    canvasRef.current?.addEventListener('mousemove', setCurrentHoveredOffsetX)

    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      canvasRef.current?.removeEventListener(
        'mousemove',
        setCurrentHoveredOffsetX
      )
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    bufferFromRecordedBlob,
    canvasCurrentWidth,
    canvasCurrentHeight,
    gap,
    barWidth,
    isResizing
  ])

  useEffect(() => {
    if (
      onlyRecording ||
      !barsData?.length ||
      !canvasRef.current ||
      isProcessingRecordedAudio
    )
      return

    if (isCleared) {
      setBarsData([])
      return
    }

    drawByBlob({
      barsData,
      canvas: canvasRef.current,
      barWidth: formattedBarWidth,
      gap: formattedGap,
      backgroundColor,
      mainBarColor,
      secondaryBarColor,
      currentAudioTime,
      rounded,
      duration
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    barsData,
    currentAudioTime,
    isCleared,
    rounded,
    backgroundColor,
    mainBarColor,
    secondaryBarColor
  ])

  useEffect(() => {
    if (isProcessingRecordedAudio && canvasRef.current) {
      initialCanvasSetup({
        canvas: canvasRef.current,
        backgroundColor
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isProcessingRecordedAudio])

  function onResize() {
    if (!canvasContainerRef.current || !canvasRef.current) return

    indexSpeedRef.current = formattedSpeed

    const roundedHeight =
      Math.trunc(
        (canvasContainerRef.current.clientHeight * window.devicePixelRatio) / 2
      ) * 2

    setCanvasCurrentWidth(canvasContainerRef.current.clientWidth)
    setCanvasCurrentHeight(roundedHeight)
    setCanvasWidth(
      Math.round(
        canvasContainerRef.current.clientWidth * window.devicePixelRatio
      )
    )

    setIsResizing(false)
  }

  function completedAudioProcessing() {
    _setIsProcessingOnResize(false)
    _setIsProcessingAudioOnComplete(false)
    if (audioRef?.current && !isProcessingOnResize) {
      audioRef.current.src = audioSrc
    }
  }

  const showTimeIndicator = () => {
    setIsRecordedCanvasHovered(true)
  }

  const hideTimeIndicator = () => {
    setIsRecordedCanvasHovered(false)
  }

  const setCurrentHoveredOffsetX = (e: MouseEvent) => {
    setHoveredOffsetX(e.offsetX)
  }

  const handleRecordedAudioCurrentTime: MouseEventHandler<
    HTMLCanvasElement
  > = e => {
    if (audioRef?.current && canvasRef.current) {
      const newCurrentTime =
        (duration / canvasCurrentWidth) *
        (e.clientX - canvasRef.current.getBoundingClientRect().left)

      audioRef.current.currentTime = newCurrentTime
      setCurrentAudioTime(newCurrentTime)
    }
  }

  return (
    <motion.div
      className={`w-full`}
      initial={{ opacity: 0 }}
      animate={{ opacity: isRecordingInProgress ? 1 : 0 }}
    >
      <div className={`absolute top-0 inset-x-0 z-50`} ref={canvasContainerRef}>
        <canvas
          ref={canvasRef}
          width={canvasWidth}
          height={canvasCurrentHeight}
          onClick={handleRecordedAudioCurrentTime}
          className="w-full"
          style={{ height: formatToInlineStyleValue(height) }}
        >
          Your browser does not support HTML5 Canvas.
        </canvas>
      </div>
    </motion.div>
  )
}

export default VoiceVisualizer
