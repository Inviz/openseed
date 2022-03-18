import style from './style.module.scss'
import slideStyle from '../slide/style.module.scss'
import { useTransition, config, animated } from 'react-spring';
import { useState, useEffect, useMemo } from 'preact/hooks';

export default function Intro({ children, navigation, navigate, ...props }) {
  const [choice, setChoice] = useState();

  useEffect(() => {
    setChoice(() => {

      if (navigation.current == 'chosenPlant') {
        return 'Hibiscus'
      } else {
        return null
      }
    })
  }, [navigation])

  const isCurrent = navigation.current != 'intro' && navigation.current != 'ready';

  const list = useMemo(() => <ul class={slideStyle.tree} onClick={() => navigate('chosenPlant')}>
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

  const transition = useTransition(choice ? [result] : [list], {
    enter: {
      opacity: 1
    },
    from: {
      position: 'absolute',
      width: '100%',
      top: 60,
      opacity: 0,
    },
    leave: {
      opacity: 0
    },
    config: config.slow,
    key: (item) => item.props.class
  })

  return <animated.div {...props} className={`${slideStyle.slide} ${style.slide} ${props.class}`}>
    <div class={slideStyle.inside}>
      {children}

      <header>
        {!isCurrent && <button onClick={() => navigate('choosePlant')}>▼ Start by choosing a plant</button>}
        {isCurrent && choice && <button class={slideStyle.back} onClick={() => navigate('choosePlant')}><span class="icon">✕</span> Choose other plant</button>}
        {isCurrent && !choice && <span>Choose plant</span>}
      </header>

      {transition((style, item) => (
        <animated.div style={style}>{item}</animated.div>
      ))}
    </div>
  </animated.div>
}