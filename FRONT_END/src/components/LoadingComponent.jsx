import Lottie from 'react-lottie';
import * as loadingAnimation from '../assets/lottie/load0.json'

const LoadingComponent = ()=>{
    const defaultOptions = {
      loop: true,
      autoplay: true, 
      animationData: loadingAnimation,
      rendererSettings: {
        preserveAspectRatio: 'xMidYMid slice'
      }
    };

    return <div>
                <Lottie options={defaultOptions}
                height={100}
                width={100}/>
            </div>
  }

  export default LoadingComponent;