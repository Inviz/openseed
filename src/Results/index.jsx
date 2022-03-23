import style from './style.module.scss'
import slideStyle from '../slide/style.module.scss'
import { useTransition, config, animated } from 'react-spring';

export default function Intro({children, state,  navigate, ...props}) {
  const back = state.gene3 ? 'chosenGene3' : state.gene2 ? 'chosenGene2' : 'chosenGene1'
  return <animated.div {...props} className={`${slideStyle.slide} ${style.slide} ${props.class}`}>
    <div class={`${slideStyle.inside} ${style.inside}`}>
      <header>
        <button class={slideStyle.back} onClick={() => navigate(back)}><span class="icon">◀</span> Change</button>
        <button class={slideStyle.forward} onClick={() => navigate('ready')}><span class="icon">✕</span> Start over</button>
        <span>Your plant</span>
      </header>
      {children}

      <div class={style.info}>
        <h1>Hibiscus</h1>
        <dl>
          <dt>1. Faster growth</dt>
          <dd>Ace-octo synth</dd> 
          <dt>2. Faster growth</dt>
          <dd>Ace-octo synth</dd> 
        </dl>
        <p>header shall provide a declaration or definition for errno. The symbol errno shall expand to a modifiable lvalue of type int. It is unspecified whether errno is a macro or an identifier declared with external linkage. If a macro definition is suppressed in order to access an actual object, or a program defines an identifier with the name errno, the behavior is undefined.</p>
      </div>
    </div>
  </animated.div>
}