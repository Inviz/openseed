import style from './style.module.scss'

export default function Slide({children, ...props}) {
  return <section  {...props} className={`${style.slide} ${props.class}`}>
    {children}
  </section>
}