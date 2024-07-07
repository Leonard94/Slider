import { useState } from 'react'
import { Preview } from './Preview/Preview'
import { ImgView } from './ImgView/ImgView'
import { DATA } from './DATA'
import styles from './styles.module.scss'

export const Slider = () => {
  const [currentImgId, setCurrentImgId] = useState<null | number>(null)

  const handleSetImgForView = (id: number) => {
    setCurrentImgId(id)
  }

  const handleNextImgForView = () => {
    const currentIndexElement = DATA.findIndex(
      (item) => item.id === currentImgId
    )

    const newEl = DATA[currentIndexElement + 1]?.id

    if (newEl) {
      return setCurrentImgId(newEl)
    }
    setCurrentImgId(DATA[0].id)
  }

  const handlePrevImgForView = () => {
    const currentIndexElement = DATA.findIndex(
      (item) => item.id === currentImgId
    )

    const newEl = DATA[currentIndexElement - 1]?.id

    if (newEl) {
      return setCurrentImgId(newEl)
    }
    setCurrentImgId(null)
  }

  const handleCloseImgView = () => {
    setCurrentImgId(null)
  }

  const getCurrentImg = DATA.find((img) => img.id === currentImgId)

  return (
    <div className={styles.slider}>
      <Preview data={DATA} handleClickPreviewImg={handleSetImgForView} />
      {getCurrentImg && (
        <ImgView
          currentImg={getCurrentImg}
          handleNextImg={handleNextImgForView}
          handlePrevImg={handlePrevImgForView}
          handleCloseImgView={handleCloseImgView}
        />
      )}
    </div>
  )
}
