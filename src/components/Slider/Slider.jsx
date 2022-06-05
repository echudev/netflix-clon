import { useEffect, useRef, useState } from 'react'
import { Header } from './Header/Header'
import { ButtonLeft } from './ButtonLeft/ButtonLeft';
import { ButtonRight } from './ButtonRight/ButtonRight';
import { Card } from './Card/Card';
import { useGetSliderConfig } from './hooks/useGetSliderConfig.js';
import style from './Slider.module.css';

export const Slider = (props) => {
  const fakeArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
  const [sliderTransition, setSliderTransition] = useState(false)
  const [firstSlide, setFirstSlide] = useState(true);
  const slider = useRef(null);
  const [btnOpacity, setBtnOpacity] = useState(0);
  const [cardsToShow, cardWidth, cardHeight, btnWidth] = useGetSliderConfig();




  const avanzar = () => {
    setTimeout(() => {
      firstSlide ? setFirstSlide(false) : null;
    }, 500);

    if (!sliderTransition) {
      setSliderTransition(true);
      slider.current.style.transition = 'cubic-bezier(.42,.02,.37,1.06) .6s';
      const itemsWidth = slider.current.firstChild.getBoundingClientRect().width;
      slider.current.style.transform = `translateX(-${(itemsWidth * cardsToShow) + (itemsWidth * 0.25)}px)`;
      const restore = () => {
        slider.current.style.transition = 'none';
        slider.current.style.transform = `translateX(-${cardWidth * 0.75}%)`;
        for (let i = 0; i < Math.floor(cardsToShow); i++) {
          const firstChild = slider.current.firstChild;
          slider.current.append(firstChild)
        }
        setSliderTransition(false);
        slider.current.removeEventListener('transitionend', restore);
      }
      slider.current.addEventListener('transitionend', restore);
    }
  }

  const retroceder = () => {
    if (!sliderTransition) {
      setSliderTransition(true);
      for (let i = 0; i < Math.floor(cardsToShow); i++) {
        const lastChild = slider.current.lastChild;
        slider.current.prepend(lastChild)
      }
      slider.current.style.transition = 'none';
      const itemsWidth = slider.current.firstChild.getBoundingClientRect().width;
      slider.current.style.transform = `translateX(-${(itemsWidth * cardsToShow) + (itemsWidth * 0.25)}px)`;
      setTimeout(() => {
        slider.current.style.transition = 'cubic-bezier(.42,.02,.37,1.06) .6s';
        slider.current.style.transform = `translateX(-${cardWidth * 0.75}%)`;
        setSliderTransition(false);
      }, 30);
    }
  }


  return (
    <div className={style.slider_container} >
      <Header titulo={props.titulo} />
      <ButtonLeft
        height={cardHeight}
        width={btnWidth}
        firstSlide={firstSlide}
        opacity={btnOpacity} setOpacity={setBtnOpacity}
        retroceder={retroceder}
      />
      <ButtonRight
        height={cardHeight}
        width={btnWidth}
        opacity={btnOpacity} setOpacity={setBtnOpacity}
        avanzar={avanzar}
      />
      <div
        ref={slider}
        className={style.slider}
        style={{ transform: `translateX(-${cardWidth * 0.75}%)` }}
        onMouseEnter={() => { setBtnOpacity(1) }}
        onMouseLeave={() => { setBtnOpacity(0) }}
      >
        {props.data.loading && fakeArray.map((data, i) => {
          return (<Card
            data={data} key={i}
            width={cardWidth} height={cardHeight} />)
        })}
        {props.data.collection && props.data.collection.results.map((data, i) => {
          return (<Card
            data={data}
            key={data.id} i={i}
            firstSlide={firstSlide}
            width={cardWidth} height={cardHeight}
            setBtnOpacity={setBtnOpacity} />)
        })}
      </div>
    </div>
  )
}
