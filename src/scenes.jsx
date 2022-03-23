

import { dragAction, createUseGesture } from '@use-gesture/react';
const useGesture = createUseGesture([dragAction])
import { useRef } from 'preact/hooks'
import { config} from 'react-spring'



const getWheel = (settings) => {
  return {
    y: settings.height - settings.width * 0.5,
    width: settings.width * 1.1,
    height: settings.width * 1.1,
    x: - settings.width * .05,
    rotateZ: -60,
    scale: 1
  }
}


export function useGestureDrag(navigate, state, scenes, settings, items, getGestureScene, options, props) {

  const gesture = useRef()

  const scrub = (fromSceneName, toSceneName, delta) => {
    const fromScene = scenes[fromSceneName];
    const toScene = scenes[toSceneName];


    for (let object in toScene) {
      const item = items.find((i) => i.id == object);
      if (!item) continue;
      const transition = item.transition;
      for (let prop in toScene[object]) {
        var to = toScene[object][prop];
        var from = fromScene[object] && fromScene[object][prop] != null ? fromScene[object][prop] : null;
        if (from == null) {
          continue;
        }
        var now = from + (to - from) * delta; 
        transition.ctrl.springs[prop].start({
          config: { tension: 100, friction: 13, mass: 1 },
          to: now
        });
      }
    }
  }

  const bind = useGesture({
    onDrag: ({ args: [navigation], event, axis, direction, movement, tap, down, cancel, offset: [x, y] }) => {
      if (tap) {
        return;
      }


      if (!gesture.scene) {
      console.log('OnDrag', navigation.current)

        var next = getGestureScene(navigation.current, state, axis, direction);
        var element = document.getElementById(getSceneComponent(navigation.current));;
        if (axis == 'y' && direction[1] == 1 && element) {
          const scrolled = Array.prototype.some.call(element.querySelectorAll('*'), (el) => {
            return el.scrollTop > 10
          });
          if (scrolled) {
            return cancel();
          }
        }
        if (next) {
          gesture.element = element;
          gesture.scene = next;
          gesture.axis = axis;
          gesture.direction = direction[ axis == 'x' ? 0 : 1];
        }
        event.stopPropagation();

      }
      if (!gesture.scene) return cancel();

      const d = gesture.axis == 'x' ? 0 : 1;
      const max = gesture.axis == 'x' ? settings.width : settings.height;
      if (down) {
        const progress = Math.max(0, Math.min(1, gesture.direction * movement[d] / max));
        
        if (gesture.progress == null) {
          gesture.progress = 0;
        }
        gesture.delta = progress - gesture.progress
        gesture.progress = progress;
        scrub(navigation.current, gesture.scene, gesture.progress);
      } else {
        if ( gesture.progress > 0.2 && direction[d] != - gesture.direction) {
          console.log('Next', gesture.scene)
          navigate(gesture.scene);
        } else {
          console.log('Back', gesture.scene)
          navigate(navigation.current);
        }
        for (var prop in gesture) {
          gesture[prop] = null;
        }
      }
    },
  },
  {
    drag: { 
      preventDefault: true,
      filterTaps: true,
      threshold: [5, 10],
      preventDefault: true,
      ...options
    },
  });

  return {scrub, bind};
}



export function getSceneComponent(current) {
  switch (current) {
    case 'ready':
    case 'initial':
      return 'intro';
      case 'choosePlant':
      case 'chosenPlant':
        return 'plants';
      case 'chooseGene1':
      case 'chosenGene1':
        return 'gene1';
  }
}

export function getGestureScene(current, state, axis, direction) {
  switch (current) {
    case 'ready':
      if (axis == 'y' && direction[1] == -1) {
        return 'choosePlant'
      }
      break;
    case 'choosePlant':
      if (axis == 'y' && direction[1] == 1) {
        return 'ready'
      }
      break;
    case 'chosenPlant':
      if (axis == 'y' && direction[1] == -1) {
        return 'chooseGene1'
      }
      break;

    case 'chooseGene1':
      if (axis == 'y' && direction[1] == 1) {
        return 'chosenPlant'
      }
      break;

    case 'chosenGene1':
      if (axis == 'y' && direction[1] == -1) {
        return 'detailsGene1'
      }
      if (axis == 'x' && direction[0] == -1) {
        return 'chooseGene2'
      }
      if (axis == 'x' && direction[0] == 1) {
        return 'chooseGene1'
      }
      break;

    case 'detailsGene1':
      if (axis == 'y' && direction[1] == 1) {
        return 'chosenGene1'
      }

    case 'chooseGene2':
      if (axis == 'x' && direction[0] == 1) {
        return 'chosenGene1'
      }
      break;

    case 'chosenGene2':
      if (axis == 'y' && direction[1] == -1) {
        return 'detailsGene2'
      }
      if (axis == 'x' && direction[0] == -1) {
        return 'chooseGene3'
      }
      break;

    case 'detailsGene2':
      if (axis == 'y' && direction[1] == 1) {
        return 'chosenGene2'
      }


    case 'chooseGene3':
      if (axis == 'x' && direction[0] == 1) {
        return 'chosenGene2'
      }
      break;

    case 'chosenGene3':
      if (axis == 'y' && direction[1] == -1) {
        return 'detailsGene3'
      }
      if (axis == 'x' && direction[0] == -1) {
        return 'results'
      }
      break;

    case 'detailsGene3':
      if (axis == 'y' && direction[1] == 1) {
        return 'chosenGene3'
      }
    
    case 'results':
      if (axis == 'x' && direction[0] == 1) {
        return state.gene3 ? 'chosenGene3' : state.gene2 ? 'chosenGene2' : 'chosenGene1'
      }

      if (axis == 'y' && direction[1] == -1) {
        return 'manage'
      }
    case 'manage':
      if (axis == 'y' && direction[1] == 1) {
        return 'results'
      }
  }
}

export function getScenes(settings) {
  return {
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
        y: settings.height - 60,
      },
      wheel: {
        ...getWheel(settings),
        y: settings.height,
        scale: 0
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
        x: settings.width
      },
      details: {
        y: settings.height
      },
      wheel: getWheel(settings)
    },

    chosenGene1: {
      gene1: {
        y: 0,
        x: 0,
      },
      gene2: {
        x: settings.width - 80,
        $delay: (p) => (p == 'chooseGene1' ? 800 : 0),
        $config: (p) => (p == 'chooseGene1' ? {tension: 100} : {}),
      },
      details: {
        y: settings.height - 60,
      },
      wheel: {
        ...getWheel(settings),
        rotateZ: -85,
        $delay: (p) => (p == 'chooseGene1' ? 800 : 0),
        $config: (p) => (p == 'chooseGene1' ? {...config.slow, mass: 3, tension: 100} : {}),
      },
      results: {
        scale: 0,
        opacity: 0
      }
    },
    detailsGene1: {
      gene1: {
        y: -settings.height + settings.width / 2,
        $config: {
          tension: 50, friction: 60, mass: 1.5
        }
      },
      gene2: {
        opacity: 0,
        x: settings.width - 20
      },
      details: {
        y: settings.width / 2,
        $config: {
          tension: 50, friction: 20, mass: 1.5
        }
      },
      wheel: {
        ...getWheel(settings),
        $config: () => ({mass: 2, tension: 20, friction: 11}),
        y: - 0,
        rotateZ: -60,
        scale: 0.9
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
        x: settings.width
      },
      details: {
        y: settings.height
      },
      wheel: {
        ...getWheel(settings),
        rotateZ: -180
      }
    },

    chosenGene2: {
      gene2: {
        x: 0,
        y: 0
      },
      gene3: {
        x: settings.width - 80,
        $delay: (p) => (p == 'chooseGene2' ? 800 : 0),
        $config: (p) => (p == 'chooseGene2' ? {tension: 100} : {}),
      },
      details: {
        y: settings.height - 60,
      },
      wheel: {
        ...getWheel(settings),
        //y: settings.height - settings.width * 0.4 - 60,
        $delay: (p) => (p == 'chooseGene2' ? 800 : 0),
        $config: (p) => (p == 'chooseGene2' ? {...config.slow, mass: 3, tension: 100} : {}),
        rotateZ: -205
      },
      results: {
        scale: 0,
        opacity: 0
      }
    },

    detailsGene2: {
      gene2: {
        y: -settings.height + settings.width / 2,
        $config: {
          tension: 50, friction: 60, mass: 1.5
        }
      },
      gene3: {
        opacity: 0,
        x: settings.width - 20
      },
      details: {
        y: settings.width / 2,
        $config: {
          tension: 50, friction: 20, mass: 1.5
        }
      },
      wheel: {
        ...getWheel(settings),
        y: - 0,
        scale: 0.9,
        $config: () => ({mass: 2, tension: 20, friction: 11}),
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
        ...getWheel(settings),
        rotateZ: -300,
        $delay: (p) => (p == 'chooseGene1' ? 800 : 0)
      }
    },

    chosenGene3: {
      gene3: {
        x: 0,
        y: 0
      },
      details: {
        y: settings.height - 60
      },
      wheel: {
        ...getWheel(settings),
        rotateZ: -300,
      },
      results: {
        scale: 0,
        opacity: 0
      }
    },

    detailsGene3: {
      gene3: {
        y: -settings.height + settings.width / 2,
        $config: {
          tension: 50, friction: 60, mass: 1.5
        }
      },
      details: {
        y: settings.width / 2,
        $config: {
          tension: 50, friction: 20, mass: 1.5
        }
      },
      wheel: {
        ...getWheel(settings),
        $config: () => ({mass: 2, tension: 20, friction: 11}),
        y: - 0,
        scale: 0.9,
        rotateZ: -300
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
        $delay: (p) => (p.includes('Gene') ? 900 : 0),
        $config: (p) => (p.includes('Gene') ? { friction: 80, mass: 1 } : config.slow),
        x: 0,
        scale: 1,
        y: 0,
        opacity: 1
      },
      wheel: {
        ...getWheel(settings),
        y: - 20,
        scale: 0.5,
        rotateZ: -1080
      },
      details: {
        y: settings.height
      },
      manage: {
        y: settings.height - 60
      }
    },

    manage: {
      results: {
        y: - settings.height
      },
      manage: {
        y: 0
      },
      wheel: {
        y: - settings.width * 0.22,
        x: - settings.width * 0.05,
        scale: 0.25
      }
    }
  }
}
