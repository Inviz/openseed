import style from './style.module.scss'
import slideStyle from '../slide/style.module.scss'
import { useTransition, config, animated } from 'react-spring';

export default function Intro({children,  navigate, navigation, ...props}) {
  const isCurrent = navigation.current == 'manage'
  return <animated.div {...props} className={`${slideStyle.slide} ${style.slide} ${props.class}`}>
    <div class={`${slideStyle.inside} ${style.inside}`}>
      <header>
        {isCurrent && <button class={slideStyle.back} onClick={() => navigate('results')}><span class="icon">▲</span> Overview</button>}
        {!isCurrent && <button onClick={() => navigate('manage')}>▼ Proceed with the plant</button>}
        <span>{isCurrent && 'Moving forward'}</span>
      </header>
      {children}

      <h1>What to do now?</h1>

      <div class={style.actions}>
        <button>Order plant</button>
        <button>Share plant</button>
        <button onClick={() => navigate('choosePlant')}>Browse plants</button>
      </div>
    </div>
  </animated.div>
}