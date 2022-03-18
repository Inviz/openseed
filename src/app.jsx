
import style from './style.module.scss'

import Slide from './slide'
import { useState, useMemo, useEffect } from 'preact/hooks'
import { useTransition, config, animated } from 'react-spring';

import Intro from './Intro';
import Plants from './Plants';
import Gene from './Gene';
import Details from './Details';
import Results from './Results';
import Wheel from './Wheel';

const getScenes = (settings) => {
  return  {
    initial: {
      intro: {
        y: 0,
      },
      plants: {
        y: settings.height,
        opacity: 0,
      },
    },
  
    ready: {
      intro: {
        y: 0,
      },
      plants: {
        y: settings.height - 60,
        opacity: 1
      }
    },
  
    choosePlant: {
      intro: {
        y: -settings.height,
      },
      plants: {
        y: 0,
      },
      gene1: {
        y: settings.height,
      }
    },
  
    chosenPlant: {
      plants: {
        y: 0,
      },
      gene1: {
        y: settings.height -60,
      },
      wheel: {
        y: settings.height * 1.5
      }
    },
  
    chooseGene1: {
      plants: {
        y: -settings.height,
      },
      gene1: {
        y: 0,
      },
      gene2: {
        x: settings.width + 100
      },
      details: {
        y: settings.height
      },
      wheel: {
        y: settings.height - settings.width * 0.4,
        width: settings.width * 1.2,
        height: settings.width * 1.2,
        marginLeft: - settings.width * .1,
        rotateZ: -60
      }
    },
  
    chosenGene1: {
      gene1: {
        y: 0,
      },
      gene2: {
        x: settings.width - 80
      },
      details: {
        y: settings.height -60
      },
      wheel: {
        y: settings.height - settings.width * 0.4 - 60,
        width: settings.width * 1.2,
        height: settings.width * 1.2,
        rotateZ: -85
      },
      results: {
        scale: 0
      }
    },
    detailsGene1: {
      gene1: {
        y: -settings.height + 150
      },
      gene2: {
        opacity: 0,
        x: settings.width - 20
      },
      details: {
        y: 150
      },
      wheel: {
        y: -window.innerWidth * 0.1,
        width: settings.width * 1.2,
        height: settings.width * 1.2,
        rotateZ: -60,
        scale: 0.8
      }
    },
  
  
  
    chooseGene2: {
      gene1: {
        x: -settings.width,
      },
      gene2: {
        x: 0
      },
      gene3: {
        x: settings.width + 100
      },
      details: {
        y: settings.height
      },
      wheel: {
        y: settings.height - settings.width * 0.4,
        width: settings.width * 1.2,
        height: settings.width * 1.2,
        rotateZ: -180
      }
    },
  
    chosenGene2: {
      gene2: {
        x: 0
      },
      gene3: {
        x: settings.width - 80
      },
      details: {
        y: settings.height - 60
      },
      wheel: {
        y: settings.height - settings.width * 0.4 - 60,
        rotateZ: -205
      },
      results: {
        scale: 0
      }
    },
  
    detailsGene2: {
      gene2: {
        y: -settings.height + 150
      },
      gene3: {
        opacity: 0,
        x: settings.width - 20
      },
      details: {
        y: 150
      },
      wheel: {
        y: settings.height - 800,
        rotateZ: -180
      }
    },
  

  
    chooseGene3: {
      gene2: {
        x: -settings.width,
      },
      gene3: {
        x: 0
      },
      details: {
        y: settings.height
      },
      wheel: {
        y: settings.height - settings.width * 0.4,
        rotateZ: -300
      }
    },
  
    chosenGene3: {
      gene3: {
        x: 0
      },
      details: {
        y: settings.height - 60
      },
      wheel: {
        y: settings.height - settings.width * 0.4 - 60,
        rotateZ: -300
      },
      results: {
        scale: 0
      }
    },
  
    detailsGene3: {
      gene3: {
        y: -settings.height + 150
      },
      details: {
        y: 150
      },
      wheel: {
        y: settings.height - 800,
        rotateZ: -180
      }
    },
  
    results: {
      gene1: {
        x: -settings.width,
      },
      gene2: {
        x: -settings.width,
      },
      gene3: {
        x: -settings.width,
      },
      results: {
        x: 0,
        scale: 1,
        y: 250
      },
      wheel: {
        y: -100,
        scale: 0.5,
        rotateZ: -1080
      },
      details: {
        y: settings.height
      }
    }
  }
}



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
  }
    return s
}

export function App(props) {
  const [navigation, setNavigation] = useState(() => ({previous: 'initial', current: 'initial'}));


  const [settings, setSettings] = useState(() => ({
    width: window.innerWidth,
    height: window.innerHeight
  }));

  const [scenes, setScenes] = useState(() => getScenes(settings))



  useEffect(() => {
    const onResize = () => {
      setSettings(() => ({
        width: window.innerWidth,
        height: window.innerHeight
      }))
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


  useEffect(() => {
    setTimeout(() => {
      navigate('ready')
    }, 500)
  }, []);

  
  const items = useMemo(() => [
    {Component: Intro, id: "intro"},
    {Component: Plants, id: "plants"},
    {Component: Gene, id: "gene1"},
    {Component: Gene, id: "gene2"},
    {Component: Gene, id: "gene3"},
    {Component: Results, id: "results"},
    {Component: Wheel, id: "wheel"},
    {Component: Details, id: "details"},
  ].filter((item) => {
    return getStyle(scenes[navigation.previous][item.id]) ||
        getStyle(scenes[navigation.current][item.id])
  }), [navigation]);


  const transitions = useTransition(items, {
    from: (item) => getStyle(scenes[navigation.previous][item.id]),
    enter: (item) => getStyle(scenes[navigation.current][item.id]),
    update: (item) =>  getStyle(scenes[navigation.current][item.id]),
    config: config.molasses,
    key: (item) => item.id
  })


  return <div class={style.app}>
    {transitions((style, {Component, ...props}) => (
    <Component {...props} navigation={navigation} navigate={navigate}
      style={style}>
      </Component>
  ))}
  </div>
}
