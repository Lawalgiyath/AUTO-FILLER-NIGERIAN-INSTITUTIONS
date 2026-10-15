export default function Header() {
  return (
    <header className="unilag-gradient text-white shadow-lg">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {/* UNILAG Logo */}
            <div className="bg-white rounded-full p-2 w-16 h-16 flex items-center justify-center">
              <img 
                src="/unilag-logo.png" 
                alt="UNILAG Logo" 
                className="w-12 h-12 object-contain"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'block';
                }}
              />
              <div 
                style={{ display: 'none' }} 
                className="text-unilag-maroon font-bold text-2xl"
              >
                UL
              </div>
            </div>
            
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">
                Staff Form AutoFiller
              </h1>
              <p className="text-sm md:text-base text-unilag-gold">
                University of Lagos
              </p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex space-x-6">
            <a 
              href="#upload" 
              className="hover:text-unilag-gold transition-colors font-semibold"
            >
              Upload
            </a>
            <a 
              href="#instructions" 
              className="hover:text-unilag-gold transition-colors font-semibold"
            >
              Instructions
            </a>
            <a 
              href="https://github.com/Lawalgiyath/AUTO-FILLER-NIGERIAN-INSTITUTIONS" 
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-unilag-gold transition-colors font-semibold"
            >
              GitHub
            </a>
          </nav>
        </div>
      </div>
    </header>
  );
}
