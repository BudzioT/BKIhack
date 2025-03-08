export default function Landing() {
    return (
        <main className="min-h-screen flex flex-col place-items-center text-gray-200 bg-gray-900">
            <div className="text-center flex flex-col justify-center place-items-center pt-40 pb-20">
                <h1 className="text-8xl font-bold">Welcome to <br /> Vanish<span className="text-amber-400">Hive!</span></h1>
                <p className="text-2xl py-4">Your place to stay safe on the web</p>
                <div>
                    <input type="button" value="Try it out" className="w-fit px-4 py-2 rounded-4xl border-2 font-semibold bg-gray-900 cursor-pointer text-amber-400 transition-all hover:bg-amber-400 hover:text-gray-900 hover:border-amber-400 mx-2"/>
                    <input type="button" value="Get chrome extension" className="w-fit px-4 py-2 rounded-4xl border-2 font-semibold bg-gray-900 cursor-pointer text-amber-400 transition-all hover:bg-amber-400 hover:text-gray-900 hover:border-amber-400 mx-2"/>
                </div>
            </div>
            <div className="flex flex-col justify-center place-items-center w-4/5">
                <h2 className="text-3xl font-semibold underline pb-10">Our goal</h2>
                <div className="w-full border-2 border-amber-500 h-30 rounded-xl text-justify">
                    <p className="text-gray-200 font-semibold py-6 px-12 font-xl">In a world where your digital footprint can feel like a shadow you can’t escape, VanishHive is here to light the way. We believe that staying safe online isn’t just about protection – it’s about empowerment. With the right tools and knowledge, you can take control of your digital life, one step at a time. Our goal? To make cybersecurity not just a necessity, but a superpower.</p>
                </div>
            </div>
        </main>
    );
  }
  