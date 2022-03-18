import style from './style.module.scss'
import {animated} from 'react-spring' 

export default function Wheel(props) {
  return <animated.div class={style.wheel} style={{...props.style}}>

  </animated.div>
}