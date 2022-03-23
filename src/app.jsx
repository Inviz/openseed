
import style from './style.module.scss'

import Slide from './slide'
import { useState, useMemo, useEffect, useRef } from 'preact/hooks'
import { useTransition, config, animated } from 'react-spring';

import Intro from './Intro';
import Plants from './Plants';
import Gene from './Gene';
import Details from './Details';
import Results from './Results';
import Wheel from './Wheel';
import Manage from './Manage';

import { getGestureScene, getScenes, getSceneComponent, useGestureDrag } from './scenes.jsx'


const getStyle = (s) => {
  if (s) {
    return {
      x: 0,
      rotateY: 0,
      y: 0,
      opacity: 1,
      scale: 1,
      ...s
    }
  } else {
    return null;
  }
}

const getWindowSize = () => {
  return {
    width: Math.min(window.innerWidth,374),
    height: Math.min(window.innerHeight, 812)
  }
}

export function App(props) {
  const [navigation, setNavigation] = useState(() => ({previous: 'ready', current: 'ready'}));


  const [settings, setSettings] = useState(getWindowSize);

  const [scenes, setScenes] = useState(() => getScenes(settings))

  const [state, setState] = useState(() => ({}));


  useEffect(() => {
    const onResize = () => {
      setSettings(getWindowSize)
      setScenes(getScenes(settings));
      navigate();
    };

    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize)
  }, [settings])

  const navigate = (slide) => {
    setNavigation((n) => slide ? ({
      previous: n.current,
      current: slide
    }) : {...n})
  }


/*
  useEffect(() => {
    setTimeout(() => {
      navigate('ready')
    }, 500)
  }, []);
 */
  
  const items = useMemo(() => [
    {Component: Intro, id: "intro"},
    {Component: Plants, id: "plants"},
    {Component: Wheel, id: "wheel"},
    {Component: Details, id: "details"},
    {Component: Gene, id: "gene1"},
    {Component: Gene, id: "gene2"},
    {Component: Gene, id: "gene3"},
    {Component: Results, id: "results"},
    {Component: Manage, id: "manage"},
  ].filter((item) => {
    return getStyle(scenes[navigation.previous][item.id]) ||
        getStyle(scenes[navigation.current][item.id])
  }), [navigation]);


  const transitions = useTransition(items, {
    from: (item) => getStyle(scenes[navigation.previous][item.id]),
    enter: (item) => getStyle(scenes[navigation.current][item.id]) ,
    update: (item) =>  {  
      return getStyle(scenes[navigation.current][item.id]);
    },
    key: (item) => item.id,
    config: (item, p) => {
      const id = item.id;
      if (!scenes[navigation.current][id] || !scenes[navigation.current][id].$config) {
        if (item.id == 'wheel') {
          return { tension: 60, friction: 15, mass: 1}
        } else {
          return { ...config.slow, mass: 3}
        }
      }
      var c = scenes[navigation.current][id].$config;
      if (typeof c == 'function')
        return c(navigation.previous, p);
      return c;
    },
    delay: (id) => {
      if (!scenes[navigation.current][id] || !scenes[navigation.current][id].$delay) {
        return
      }
      var delay = scenes[navigation.current][id].$delay;
      if (typeof delay == 'function')
        return delay(navigation.previous);
      return delay;
    },
    //trail: 70
  })

  transitions((style, item, transition) => {
    item.transition = transition;
  });



  const {bind, scrub} = useGestureDrag(navigate, state, scenes, settings, items, getGestureScene, {
    axis: 'lock'
  });
  useEffect(() => {
    var i = 0;
    setInterval(() => {
//      scrub('results', i += 0.1)
    })
  }, [])


  return <div class={style.app} {...bind(navigation)} style={{touchAction: 'pan-x pan-y'}}>
    {transitions((style, {Component, ...props}) => (
    <Component {...props} navigation={navigation} navigate={navigate} settings={settings} state={state} setState={setState}
      style={style}>
      </Component>
  ))}
  </div>
}
