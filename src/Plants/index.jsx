import style from './style.module.scss'
import slideStyle from '../slide/style.module.scss'
import { useTransition, config, animated } from 'react-spring';
import { useState, useEffect, useMemo } from 'preact/hooks';


import { useGestureDrag } from '../scenes.jsx'


export default function Intro({ settings, children, navigation, navigate, state, setState, ...props }) {
  const choice = state[props.id];
  const setChoice = (value) => {
    setState((s) => ({...s, [props.id]: value}))
  }


  const isCurrent = navigation.current == 'choosePlant' || navigation.current == 'chosenPlant';
  useEffect(() => {
    if (isCurrent) {
      if (choice) {
        navigate('chosenPlant');
      } else {
        navigate('choosePlant');
      }
    }
  }, [choice, navigation.current])
  


  const scenes = useMemo(() => {
    return {
      chosen: {
        list: {
          x: -settings.width + 60
        },
        result: {
          x: 60,
          opacity: 1
        }
      },
      choose: {
        list: {
          x: 0
        },
        result: {
          x: settings.width / 4 + 60,
          opacity: .3
        }
      }
    }
  }, [settings])

  const list = useMemo(() => <ul class={slideStyle.tree} onClick={() => setChoice('a')}>
    <li>
      <h2>Trees</h2>
      <ul class={slideStyle.list}>
        <li>Orchid tree</li>
        <li>Apple</li>
        <li>Soy bean</li>
        <li>Strawberyr</li>
        <li>Plumeria</li>
        <li>Hibiscus</li>
      </ul>
    </li>
    <li>
      <h2>Flowers</h2>
      <ul class={slideStyle.list}>
        <li>Orchid tree</li>
        <li>Apple</li>
        <li>Soy bean</li>
        <li>Strawberyr</li>
        <li>Plumeria</li>
        <li>Hibiscus</li>
      </ul>
    </li>
    <li>
      <h2>Grass</h2>
      <ul class={slideStyle.list}>
        <li>Orchid tree</li>
        <li>Apple</li>
        <li>Soy bean</li>
        <li>Strawberyr</li>
        <li>Plumeria</li>
        <li>Hibiscus</li>
      </ul>
    </li>
    <li>
      <h2>Vegetables</h2>
      <ul class={slideStyle.list}>
        <li>Potato</li>
        <li>Apple</li>
        <li>Soy bean</li>
        <li>Strawberyr</li>
        <li>Plumeria</li>
        <li>Hibiscus</li>
      </ul>
    </li>
  </ul>, [])

  const result = useMemo(() => <div class={style.content}>
    <h1>Akacia</h1>
    <p>Acacia, commonly known as the wattles or acacias, is a large genus of shrubs and trees in the subfamily Mimosoideae of the pea family Fabaceae.</p>
    <p> Initially, it comprised a group of plant species native to Africa and Australasia, but it has now been limited to contain only the Australasian species. The genus name is New Latin, borrowed from the Greek ἀκακία (akakia), a term used by Dioscorides for a preparation extracted from the leaves and fruit pods of Vachellia nilotica, the original type of the genus.[4] In his Pinax (1623), Gaspard Bauhin mentioned the Greek ἀκακία from Dioscorides as the origin of the Latin name.[5]</p>
  </div>, [])

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
    if (scene == 'choose') {
      setChoice(null);
    } else {
      setChoice('abc');
    }
  }


  const { bind, scrub } = useGestureDrag(setTab, state, scenes, settings, items, getGestureScene, {
    axis: 'x'
  });

  return <animated.div {...props} className={`${slideStyle.slide} ${style.slide} ${props.class}`}>
    <div class={slideStyle.inside} {...bind({current, previous})} style={{touchAction: 'pan-x pan-y'}}>
      {children}

      <header>
        <button hidden={isCurrent} onClick={() => navigate('choosePlant')}>▼ Start by choosing a plant</button>
        <button hidden={!isCurrent || !choice} class={slideStyle.back} onClick={() => setChoice(null)}><span class="icon">◀</span> Choose other plant</button>
        <span hidden={!(isCurrent && !choice)}>Choose plant</span>
      </header>

      <div class={style.wrapper}>
        {transition((s, item) => (
          <animated.div class={style.page} style={s}>{item.node}</animated.div>
        ))}
      </div>
    </div>
  </animated.div>
}