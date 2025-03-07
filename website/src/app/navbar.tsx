export default function Navbar() {
    return (
      <nav className="h-20 flex justify-around place-items-center bg-gray-950 sticky top-0 border-b-2 border-amber-400 text-gray-200">
            <img src="https://hc-cdn.hel1.your-objectstorage.com/s/v3/c252531d54ac77f3a1cbbec472898065e5d7fdee_logo-removebg-preview.png" alt="logo" className="h-25"/>
            <h1 className="text-center text-2xl font-bold">VanishHive</h1>
            <input type="button" value="Try it" className="w-fit px-4 py-2 rounded-4xl border-2 font-semibold bg-gray-900 cursor-pointer text-amber-400 transition-all hover:bg-amber-400 hover:text-gray-900 hover:border-amber-400"/>
      </nav>
    );
  }
  