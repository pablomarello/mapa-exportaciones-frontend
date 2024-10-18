import { Navbar } from "../components/Navbar"
import { Footer } from "../components/Footer"
import { QuestionCard } from "../components/QuestionCard"
import { ImageCard } from "../components/ImageCard"

export function Trivia () {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <ImageCard />
      <div className="flex-grow flex  ">
        <QuestionCard className="flex-grow" />
      </div>
      <Footer />
    </div>
  )
}
