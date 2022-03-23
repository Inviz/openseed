import style from './style.module.scss'
import slideStyle from '../slide/style.module.scss'
import { useTransition, config, animated } from 'react-spring';

export default function Details({children, navigation, navigate, ...props}) {
  const currentGene = navigation.current.match(/Gene\d+/)
  const isCurrent = navigation.current.includes('details')
  return <animated.div {...props} className={`${slideStyle.slide} ${style.slide} ${isCurrent ? style.current : null} ${props.class}`} style={{...props.style, zIndex: 11}}>
    <div class={slideStyle.inside}>
      <header>
        <button hidden={!isCurrent} onClick={() => navigate('chosen' + currentGene[0])} class={slideStyle.back}>▲ Mod</button>
        <button disabled hidden={!isCurrent}>Customize mod</button>
        <button hidden={!(currentGene && !isCurrent)} onClick={() => navigate('details' + currentGene[0])}>▼ Read more/Customize </button>
      </header>   
      <div class={style.content}>

      <h1>About this gene</h1>
      <p>Since the 1950s, acetylene has mainly been manufactured by the partial combustion of methane.[8][17][18] It is a recovered side product in production of ethylene by cracking of hydrocarbons. Approximately 400,000 tonnes were produced by this method in 1983.[8] Its presence in ethylene is usually undesirable because of its explosive character and its ability to poison Ziegler–Natta catalysts. It is selectively hydrogenated into ethylene, usually using Pd–Ag catalysts.[19]</p>


<p>Acetylene factory with annual capacity of 90,000 tons, commissioned in 2020 by BASF.</p>
<p>Until the 1950s, when oil supplanted coal as the chief source of reduced carbon, acetylene (and the aromatic fraction from coal tar) was the main source of organic chemicals in the chemical industry. It was prepared by the hydrolysis of calcium carbide, a reaction discovered by Friedrich Wöhler in 1862[20] and still familiar to students:</p>
      {children}
      </div>
    </div>
 
  </animated.div>
}