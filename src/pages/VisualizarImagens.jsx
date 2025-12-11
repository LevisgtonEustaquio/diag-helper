import Navbar from "../components/Navbar";
import AnimatedH1 from "../components/AnimatedH1";

function VisualizarImagens(){

    return (
        <div className="min-h-screen bg-gray-100 flex">
            <Navbar />

            
        <main className="flex-1 p-8">
            <div className="flex justify-center items-center mb-6">
          <AnimatedH1>Visuaoizar imagens</AnimatedH1>

        </div>
        </main>
        </div>
    )
}

export default VisualizarImagens;