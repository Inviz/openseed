import style from './style.module.scss'
import slideStyle from '../slide/style.module.scss'
import { useTransition, config, animated } from 'react-spring';


export default function Intro({children, ...props}) {
  return <animated.div {...props} className={`${slideStyle.slide} ${style.slide} ${props.class}`}>
    <div class={`${slideStyle.inside} ${style.inside}`}>
      {children}
      
      <h1>Open Seed</h1>
      <p>Create your own plants</p>
    </div>
  </animated.div>
}