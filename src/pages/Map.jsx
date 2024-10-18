import { Navbar } from "../components/Navbar"
import { Footer } from "../components/Footer"
import { MapCard } from "../components/MapCard"

export function Map () {
  return (
    <div >
      <Navbar isTransparent={true}/>
      <div className="pt-[4.5rem]"> 
        <MapCard />
      </div>
      <Footer/>
    </div>
  )
}
