import style from './style.module.scss'
import slideStyle from '../slide/style.module.scss'
import { useTransition, config, animated } from 'react-spring';
import { useState, useEffect, useMemo, useRef } from 'preact/hooks';

import { useGestureDrag } from '../scenes.jsx'

export default function Gene({ children, navigation, navigate, settings, state, setState, ...props }) {
  const choice = state[props.id];
  const setChoice = (value) => {
    setState((s) => ({...s, [props.id]: value}))
  }
  const gesture = useRef()




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


  useEffect(() => {
    if (isCurrent) {
      if (choice) {
        navigate('chosenGene' + (index + 1));
      } else {
        navigate('chooseGene' + (index + 1));
      }
    }
  }, [choice, isCurrent])
  
  const result = useMemo(() => <div class={style.result}>
    <h1>Modification {index + 1}: Growth</h1>
    <p>Spi-pleblo-dabl-wahoo</p>
    <p>Now, you’re jumping because POSIX didn’t take care/in mind during designing some hardware that weren’t even dreamt about (GPUs for heavy 3D, VR, touchscreens, etc.) Hell, point me to one that can design something with *future* optimization that I will hire him/her right now!</p>
  </div>, []);

  const list  = useMemo(() => <div class={style.list}>
    <p class={style.intro}>Biomodification of plants involves picking a modifier that will add new traits to the plant. You can pick up to three.</p>


    <ul class={slideStyle.tree} onClick={() => setChoice('abcv')}>
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


  const bringForward = (e) => {
    navigate('chooseGene' + (index + 1));
    e.preventDefault();
    e.stopPropagation()
  }


  const scenes = useMemo(() => {
    return {
      chosen: {
        list: {
          x: -settings.width + 0
        },
        result: {
          x: 0,
          opacity: 1
        }
      },
      choose: {
        list: {
          x: 0
        },
        result: {
          x: settings.width / 4,
          opacity: 0.3
        }
      }
    }
  }, [settings])

  const items = useMemo(() => [
    { node: result, id: 'result' },
    { node: list, id: 'list' }
  ], [])

  var current = choice ? 'chosen' : 'choose';
  var previous = choice ? 'choose' : 'chosen';

  const transition = useTransition(items, {
    from: (item) => scenes[previous][item.id],
    trail: 70,
    update: (item) => scenes[current][item.id],
    enter: (item) => scenes[current][item.id],
    config: config.slow,
    key: (item) => item.id
  });

  transition((style, item, transition) => {
    item.transition = transition;
  });

  const getGestureScene = (navigation, state, axis, direction) => {
    if (current == 'choose' && axis == 'x' && direction[0] == -1) {
      return 'chosen'
    }

    if (current == 'chosen' && axis == 'x' && direction[0] == 1) {
      return 'choose'
    }
  }

  const setTab = (scene) => {
    if (choice) {
      setChoice(null)
    } else {
      setChoice('abc')
    }
  }


  const { bind, scrub } = useGestureDrag(gesture, setTab, state, scenes, settings, items, getGestureScene, {
    axis: 'x',
    enabled: (navigation.current == 'chooseGene' + (index + 1) || navigation.current == 'chosenGene' + (index + 1))
  });

  return <animated.div {...props} className={`${slideStyle.slide} ${style.slide} ${props.class}`} onClickCapture={!isCurrent ? bringForward : null}>
    <div class={slideStyle.inside} {...bind({current, previous})} style={{touchAction: 'pan-x pan-y'}}>
      <header>
        <button class={slideStyle.back} hidden={!choice} onClick={() => setChoice(null)}><span class="icon">◀</span> Change mod</button>
        <button class={slideStyle.back} hidden={choice || index > 0 || !isCurrent} onClick={() => navigate('chosenPlant')}>▲ Plant</button>
        <button class={slideStyle.back} hidden={choice || index == 0 || !isCurrent} onClick={() => navigate('chosenGene' + (index))}><span class="icon">◀</span> Previous</button>
        <button hidden={props.id == 'gene1' || navigation.current.toLowerCase().includes(props.id)} class={`${slideStyle.back} ${style.next}`} onClick={() => navigate('chooseGene' + (index + 1))}>Add {index == 1 ? '2nd' : '3d'} <span class="icon">▶</span></button>
      
        <button hidden={navigation.current != 'chosenPlant'} onClick={() => navigate('chooseGene' + (index + 1))}>▼ Modify the plant</button>
        <span hidden={!(isCurrent && !choice)}>Pick {index == 0 ? '1st' : index == 1 ? '2nd' : '3d'} modifier</span>
        <button hidden={!isCurrent || !choice} class={index < 2 ? style.center : style.forward} onClick={() => navigate('results')}>{index == 0 ? 'Finish with 1 mod' : index == 1 ? 'Finish with 2 mods' : '✓ Finish'}</button>
      </header>
      <div class={style.wrapper}>
      {transition((s, item) => (
        <animated.div style={s} class={style.page}>{item.node}</animated.div>
      ))}
      </div>
    </div>
  
  </animated.div>
}