import style from './style.module.scss'
import slideStyle from '../slide/style.module.scss'
import { useTransition, config, animated } from 'react-spring';

export default function Intro({children, ...props}) {
  return <animated.div {...props} className={`${slideStyle.slide} ${style.slide} ${props.class}`}>
    <div class={slideStyle.inside}>
      {children}
    
      <h1>Your super plant</h1>
      <p>Here are the stats</p>
    </div>
  </animated.div>
}