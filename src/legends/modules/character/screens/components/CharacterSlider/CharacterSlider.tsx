// import Swiper and modules styles
import 'swiper/css'
import 'swiper/css/virtual'

import React, { useRef, useState } from 'react'
import { EffectCoverflow, Navigation } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'

import styles from './CharacterSlider.module.scss'
import Left from './Left.tsx'
import penguinPaladin from './penguin-paladin.png'
import Right from './Right.tsx'
import slimeCharacter from './slime.png'
import sorceressCharacter from './sorceress.png'
import vitalikCharacter from './vitalik.png'

const characters = [
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
  },
  {
    id: 5,
    name: 'Necromancer Vitalik2',
    description: 'Vestibulum condimentum aliquet tortor, eu laoreet magna.',
    image: vitalikCharacter
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

  const getClass = (index) => {
    if (index === currentIndex) return styles.selected
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.content}>
        <div className={styles.button} onClick={handlePrevious}>
          <Left />
        </div>
        <Swiper
          ref={sliderRef}
          slidesPerView="auto"
          spaceBetween={30}
          effect="coverflow"
          breakpoints={{
            300: {
              slidesPerView: 1,
              spaceBetween: 0
            },
            1024: {
              slidesPerView: 5,
              spaceBetween: 0
            }
          }}
          coverflowEffect={{
            rotate: 0,
            stretch: 0,
            depth: 40,
            slideShadows: false
          }}
          loop
          centeredSlides
          navigation
          initialSlide={2}
          modules={[EffectCoverflow, Navigation]}
          onSlideChange={(swiper) => {
            setCurrentIndex(swiper.realIndex)
          }}
        >
          {characters.map((character, index) => (
            <SwiperSlide key={character.name}>
              <div key={index} className={`${styles.character} ${getClass(index)}`}>
                <div className={styles.characterRelativeWrapper}>
                  <img src={character.image} alt={character.name} className={styles.image} />
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
        <div className={styles.button} onClick={handleNext}>
          <Right />
        </div>
      </div>

      <h2 className={styles.name}>{characters[currentIndex].name}</h2>
      <p className={styles.description}>{characters[currentIndex].description}</p>
    </div>
  )
}

export default CharacterSlider
