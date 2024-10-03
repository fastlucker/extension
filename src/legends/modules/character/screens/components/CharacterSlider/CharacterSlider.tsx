// import Swiper and modules styles
import 'swiper/css'
import 'swiper/css/virtual'
import 'swiper/css/effect-coverflow'
import 'swiper/css/free-mode'

import React, { useRef, useState } from 'react'
import { Navigation } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'

import styles from './CharacterSlider.module.scss'
import Left from './Left'
import penguinPaladin from './penguin-paladin.png'
import Right from './Right'
import slimeCharacter from './slime.png'
import sorceressCharacter from './sorceress.png'
import vitalikCharacter from './vitalik.png'

type Character = {
  id: number
  name: string
  description: string
  image: string
}

const CHARACTERS: Character[] = [
  {
    id: 1,
    name: 'Slime',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    image: slimeCharacter
  },
  {
    id: 2,
    name: 'Sorceress',
    description: 'Morbi id nisl fringilla, aliquet elit sit amet.',
    image: sorceressCharacter
  },
  {
    id: 3,
    name: 'Necromancer Vitalik',
    description: 'Vestibulum condimentum aliquet tortor, eu laoreet magna.',
    image: vitalikCharacter
  },
  {
    id: 4,
    name: 'Penguin Paladin',
    description: 'Vestibulum condimentum aliquet tortor, eu laoreet magna.',
    image: penguinPaladin
  }
]

const CharacterSlider = () => {
  const [currentIndex, setCurrentIndex] = useState(1)
  const sliderRef = useRef(null)

  // Handler to go to the next character
  const handleNext = () => {
    if (!sliderRef.current) return
    sliderRef.current.swiper.slideNext()
  }

  // Handler to go to the previous character
  const handlePrevious = () => {
    if (!sliderRef.current) return

    sliderRef.current.swiper.slidePrev()
  }

  const getClass = (index: number) => {
    if (index === currentIndex) return styles.selected
    if (
      index === (currentIndex + 1) % CHARACTERS.length ||
      (currentIndex === CHARACTERS.length - 1 && index === 0)
    )
      return `${styles.adjacent} ${styles.right}`
    if (
      index === (currentIndex - 1 + CHARACTERS.length) % CHARACTERS.length ||
      (currentIndex === 0 && index === CHARACTERS.length - 1)
    )
      return `${styles.adjacent} ${styles.left}`
    return styles.smaller
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.content}>
        <button type="button" className={styles.button} onClick={handlePrevious}>
          <Left />
        </button>
        <Swiper
          ref={sliderRef}
          slidesPerView="auto"
          spaceBetween={0}
          loop
          centeredSlides
          navigation
          initialSlide={3}
          modules={[Navigation]}
          onSlideChange={(swiper) => {
            setCurrentIndex(swiper.realIndex)
          }}
        >
          {CHARACTERS.map((character, index) => (
            <SwiperSlide className={`${styles.slide} ${getClass(index)}`} key={character.id}>
              <img src={character.image} alt={character.name} className={styles.image} />
            </SwiperSlide>
          ))}
        </Swiper>
        <button type="button" className={styles.button} onClick={handleNext}>
          <Right />
        </button>
      </div>

      <h2 className={styles.name}>{CHARACTERS[currentIndex].name}</h2>
      <p className={styles.description}>{CHARACTERS[currentIndex].description}</p>
    </div>
  )
}

export default CharacterSlider
