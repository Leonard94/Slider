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

const TIMER = 4000

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

  useEffect(() => {
    if (displayedImg !== currentImg) {
      setNewImg(currentImg)
      setTransitioning(true)

      const timer = setTimeout(() => {
        setDisplayedImg(currentImg)
        setNewImg(undefined)
        setTransitioning(false)
      }, TIMER)

      return () => clearTimeout(timer)
    }
  }, [displayedImg, currentImg, transitioning])

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
        <div className={styles.view__container}>
          <img
            className={cn(styles.image, styles.old, getAnimationClasses(true))}
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
