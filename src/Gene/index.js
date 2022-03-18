import style from './style.module.scss'
import slideStyle from '../slide/style.module.scss'
import { useTransition, config, animated } from 'react-spring';
import { useState, useEffect, useMemo } from 'preact/hooks';

export default function Intro({ children, navigation, navigate,  ...props }) {
  const [choice, setChoice] = useState();

  const index = useMemo(() => {
    if (props.id == 'gene1') {
      return 0;
    } else if (props.id == 'gene2') {
      return 1;
    } else {
      return 2;
    }
  }, [props.id])

  const isCurrent = navigation.current.includes('Gene' + (index + 1))

  
  const result = useMemo(() => <div class={style.result}>
    <h1>Modification {index + 1}: Growth</h1>
    <p>Spi-pleblo-dabl-wahoo</p>
    <p>Now, you’re jumping because POSIX didn’t take care/in mind during designing some hardware that weren’t even dreamt about (GPUs for heavy 3D, VR, touchscreens, etc.) Hell, point me to one that can design something with *future* optimization that I will hire him/her right now!</p>
  </div>, []);

  const list  = useMemo(() => <div>
    <p class={style.intro}>Biomodification of plants involves picking a modifier that will add new traits to the plant. You can pick up to three.</p>


    <ul class={slideStyle.tree} onClick={() => navigate('chosenGene' + (index + 1))}>
      <li>
        <h2>Growth</h2>
        <ul class={slideStyle.list}>
          <li>Gene 1</li>
          <li>Gene 2</li>
          <li>Gene 3</li>
          <li>Gene 4</li>
        </ul>
      </li>
      <li>
        <h2>Color</h2>
        <ul class={slideStyle.list}>
          <li>Gene 1</li>
          <li>Gene 2</li>
          <li>Gene 3</li>
          <li>Gene 4</li>
        </ul>
      </li>
      <li>
        <h2>Bio protection</h2>
        <ul class={slideStyle.list}>
          <li>Gene 1</li>
          <li>Gene 2</li>
          <li>Gene 3</li>
          <li>Gene 4</li>
        </ul>
      </li>
      <li>
        <h2>Cool stuff</h2>
        <ul class={slideStyle.list}>
          <li>Gene 1</li>
          <li>Gene 2</li>
          <li>Gene 3</li>
          <li>Gene 4</li>
        </ul>
      </li>
    </ul>
  </div>,  []);


  const transition = useTransition(choice ? [result] : [list], {
    enter: {
      opacity: 1
    },
    from: {
      position: 'absolute',
      opacity: 0,
    },
    leave: {
      opacity: 0
    },
    config: config.slow,
    key: (item) => item.props.class
  })

  useEffect(() => {
    setChoice(() => {
      if (navigation.current == 'chosenGene' + (index + 1) || navigation.current == 'detailsGene' + (index + 1)) {
        return 'Hibiscus'
      } else {
        return null
      }
    })
  }, [navigation])

  const bringForward = (e) => {
    navigate('chooseGene' + (index + 1));
    e.preventDefault();
    e.stopPropagation()
  }

  return <animated.div {...props} className={`${slideStyle.slide} ${style.slide} ${props.class}`} onClickCapture={!isCurrent ? bringForward : null}>
    <div class={slideStyle.inside}>
      <header>
        <button class={slideStyle.back} hidden={!choice} onClick={() => navigate('chooseGene' + (index + 1))}><span class="icon">✕</span> Change mod</button>
        <button class={slideStyle.back} hidden={choice || index > 0 || !isCurrent} onClick={() => navigate('chosenPlant')}>▲ Plant</button>
        <button class={slideStyle.back} hidden={choice || index == 0 || !isCurrent} onClick={() => navigate('chosenGene' + (index))}><span class="icon">◀</span> Previous</button>
        {!isCurrent && <button onClick={() => navigate('chooseGene' + (index + 1))}>▼ Modify the plant</button>}
        {isCurrent && !choice && <span>Pick {index == 0 ? '1st' : index == 1 ? '2nd' : '3d'} modifier</span>}
        {isCurrent && choice && <button class={index < 2 ? style.center : style.forward} onClick={() => navigate('results')}>{index == 0 ? 'Finish with 1 mod' : index == 1 ? 'Finish with 2 mods' : '✓ Finish'}</button>}
      </header>
      <div class={style.content}>

      {transition((style, item) => (
        <animated.div style={style}>{item}</animated.div>
      ))}
      </div>
    </div>
    {props.id != 'gene1' && <button hidden={navigation.current.toLowerCase().includes(props.id)} class={style.next} onClick={() => navigate('chooseGene' + (index + 1))}><span>Add mod</span></button>}
  
  </animated.div>
}