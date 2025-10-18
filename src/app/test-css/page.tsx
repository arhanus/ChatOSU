export default function TestCSS() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-purple-900 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8 text-center">
          CSS Test Page
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <h2 className="text-xl font-semibold text-white mb-4">Card 1</h2>
            <p className="text-gray-300">
              This card should have a semi-transparent background with blur effect.
            </p>
            <button className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors">
              Button
            </button>
          </div>
          
          <div className="bg-orange-500/20 rounded-xl p-6 border-2 border-orange-500">
            <h2 className="text-xl font-semibold text-orange-300 mb-4">Card 2</h2>
            <p className="text-gray-300">
              This card should have orange styling and borders.
            </p>
            <div className="flex gap-2 mt-4">
              <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm">
                Tag 1
              </span>
              <span className="bg-purple-500 text-white px-3 py-1 rounded-full text-sm">
                Tag 2
              </span>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-pink-500 to-violet-500 rounded-xl p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Card 3</h2>
            <p className="text-white/90">
              This card should have a gradient background from pink to violet.
            </p>
            <div className="mt-4 space-y-2">
              <div className="w-full bg-white/20 rounded-full h-2">
                <div className="bg-white h-2 rounded-full w-3/4"></div>
              </div>
              <div className="w-full bg-white/20 rounded-full h-2">
                <div className="bg-white h-2 rounded-full w-1/2"></div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-12 text-center">
          <p className="text-white/70 text-lg">
            If you can see all the colors, gradients, and styling above, 
            then Tailwind CSS is working correctly!
          </p>
          <div className="mt-6 flex justify-center space-x-4">
            <div className="w-4 h-4 bg-red-500 rounded-full animate-pulse"></div>
            <div className="w-4 h-4 bg-green-500 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
            <div className="w-4 h-4 bg-blue-500 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
          </div>
        </div>
      </div>
    </div>
  );
}
