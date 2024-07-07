import styles from './styles.module.scss'
import { TStory } from '../DATA'

type TProps = {
  data: TStory[]
  handleClickPreviewImg: (id: number) => void
}

export const Preview: React.FC<TProps> = ({ data, handleClickPreviewImg }) => {
  return (
    <div className={styles.preview}>
      {data.map((item) => (
        <div
          key={item.id}
          className={styles.item}
          onClick={() => handleClickPreviewImg(item.id)}
        >
          <img src={item.img} alt={String(item.id)} />
        </div>
      ))}
    </div>
  )
}
