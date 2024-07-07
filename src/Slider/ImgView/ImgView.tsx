import React, { useState, useEffect } from 'react'
import { TStory } from '../DATA'
import styles from './styles.module.scss'
import cn from 'classnames'

interface IProps {
  currentImg: TStory
  handleNextImg: () => void
  handlePrevImg: () => void
  handleCloseImgView: () => void
}

const TIMER = 500
const TOUCH_DISTANCE_TO_CHANGE_IMG = 30

enum EDirection {
  next = 'next',
  prev = 'prev',
}

export const ImgView: React.FC<IProps> = ({
  currentImg,
  handleNextImg,
  handlePrevImg,
  handleCloseImgView,
}) => {
  const [displayedImg, setDisplayedImg] = useState<TStory>(currentImg)
  const [newImg, setNewImg] = useState<TStory | undefined>(undefined)
  const [transitioning, setTransitioning] = useState(false)
  const [direction, setDirection] = useState<EDirection | null>(null)

  const [touchStartX, setTouchStartX] = useState<null | number>(null)
  const [touchDistance, setTouchDistance] = useState<{
    current: number
    new: number
  }>({ current: 0, new: 0 })
  const [isDragging, setIsDragging] = useState(false)

  useEffect(() => {
    if (displayedImg !== currentImg && !isDragging) {
      setNewImg(currentImg)
      setTransitioning(true)

      const timer = setTimeout(() => {
        setDisplayedImg(currentImg)
        setNewImg(undefined)
        setTransitioning(false)
      }, TIMER)

      return () => clearTimeout(timer)
    }
  }, [displayedImg, currentImg, transitioning, isDragging])

  const stylesRecord = styles as Record<string, string>

  const getAnimationClasses = (isOldImg: boolean) => {
    const classes = {
      [stylesRecord.slideInFromRight]:
        !isOldImg && transitioning && direction === EDirection.next,
      [stylesRecord.slideInFromLeft]:
        !isOldImg && transitioning && direction === EDirection.prev,
    }

    return cn(classes)
  }

  const handleChangeImg = (direction: EDirection) => {
    if (direction === EDirection.next) {
      setDirection(EDirection.next)
      handleNextImg()
      return
    }

    setDirection(EDirection.prev)
    handlePrevImg()
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX)
    setIsDragging(true)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartX !== null) {
      const currentX = e.touches[0].clientX
      const distance = currentX - touchStartX
      const containerWidth = e.currentTarget.clientWidth

      setTouchDistance({
        current: distance,
        new:
          distance > 0
            ? distance - containerWidth - TOUCH_DISTANCE_TO_CHANGE_IMG
            : distance + containerWidth + TOUCH_DISTANCE_TO_CHANGE_IMG,
      })

      if (Math.abs(distance) > TOUCH_DISTANCE_TO_CHANGE_IMG && isDragging) {
        if (touchDistance) {
          if (touchDistance.current > 0) {
            if (displayedImg === currentImg) {
              handlePrevImg()
            } else {
              setNewImg(currentImg)
            }
          } else {
            if (displayedImg === currentImg) {
              handleNextImg()
            } else {
              setNewImg(currentImg)
            }
          }
        }
      }
    }
  }

  const handleTouchEnd = () => {
    setTransitioning(true)

    const shouldChangeImg =
      Math.abs(touchDistance.current) > TOUCH_DISTANCE_TO_CHANGE_IMG

    if (shouldChangeImg) {
      setDisplayedImg(newImg || displayedImg)
    }

    setTouchDistance({ current: 0, new: 0 })
    setTouchStartX(null)
    setIsDragging(false)

    setDisplayedImg(currentImg)
    setNewImg(undefined)
  }

  return (
    <div className={styles.container}>
      <button className={styles.close} onClick={handleCloseImgView}>
        X
      </button>
      <button
        className={styles.next}
        onClick={() => handleChangeImg(EDirection.prev)}
        disabled={transitioning}
      >
        prev
      </button>
      <div className={styles.view}>
        <div
          className={styles.view__container}
          onTouchEnd={handleTouchEnd}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
        >
          <img
            className={cn(styles.image, styles.old, getAnimationClasses(true))}
            style={{
              transform: isDragging
                ? `translateX(${touchDistance.current}px)`
                : 'none',
            }}
            src={displayedImg.img}
            alt={String(currentImg.id)}
          />
          {newImg && (
            <img
              className={cn(
                styles.image,
                styles.new,
                getAnimationClasses(false)
              )}
              style={{
                transform: isDragging
                  ? `translateX(${touchDistance.new}px)`
                  : 'none',
              }}
              src={newImg.img}
              alt={String(currentImg.id)}
            />
          )}
        </div>
      </div>
      <button
        className={styles.next}
        onClick={() => handleChangeImg(EDirection.next)}
        disabled={transitioning}
      >
        next
      </button>
    </div>
  )
}
