import Benzin from './components/Benzin/Benzin'
import useBenzin from './hooks/useBenzin'

const BenzinScreen = () => {
  const state = useBenzin()

  return <Benzin state={state} />
}

export default BenzinScreen
