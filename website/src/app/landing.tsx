import Link from "next/link";
import News from './CyberSecurityNewsSlider';

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
                <div className="w-4/5 border-2 border-amber-500 h-fit rounded-xl text-justify">
                    <p className="text-gray-200 font-semibold py-6 px-12 font-xl">In a world where your digital footprint can feel like a shadow you can’t escape, VanishHive is here to light the way. We believe that staying safe online isn’t just about protection – it’s about empowerment. With the right tools and knowledge, you can take control of your digital life, one step at a time. Our goal? To make cybersecurity not just a necessity, but a superpower.</p>
                </div>
            </div>
            <News/>
            <div className="w-4/5 mx-auto">
                <h2 className="text-4xl font-semibold underline pt-5 pb-5 text-center">Tools</h2>
                <div className="h-50 w-4/5 rounded-xl border-3 border-amber-400 flex justify-between my-5 mx-auto p-5">
                    <div>
                        <h3 className="text-2xl font-semibold">Metadata removal</h3>
                        <p className="">See metadata associated with a file you upload and delete it</p>
                        <Link href="/metadata">
                            <input type="button" value="Try it out" className="w-fit px-4 py-2 rounded-4xl border-2 font-semibold bg-gray-900 cursor-pointer text-amber-600 transition-all hover:bg-amber-600 hover:text-gray-900 hover:border-amber-600 mx-2 my-8"/>
                        </Link>
                    </div>
                    <img src="https://hc-cdn.hel1.your-objectstorage.com/s/v3/9192603388ad9f429d730c600d23563f9af13b7f_image.png" alt="" className="rounded-lg"/>
                </div>
                <div className="h-50 w-4/5 rounded-xl border-3 border-amber-400 flex justify-between my-5 mx-auto p-5">
                    <div>
                        <h3 className="text-2xl font-semibold">AI chat</h3>
                        <p className="">See metadata associated with a file you upload and delete it</p>
                        <input type="button" value="Try it out" className="w-fit px-4 py-2 rounded-4xl border-2 font-semibold bg-gray-900 cursor-pointer text-amber-600 transition-all hover:bg-amber-600 hover:text-gray-900 hover:border-amber-600 mx-2 my-8"/>
                    </div>
                    <img src="https://hc-cdn.hel1.your-objectstorage.com/s/v3/9192603388ad9f429d730c600d23563f9af13b7f_image.png" alt="" className="rounded-lg"/>
                </div>
                <div className="h-50 w-4/5 rounded-xl border-3 border-amber-400 flex justify-between my-5 mx-auto p-5">
                    <div>
                        <h3 className="text-2xl font-semibold">Virustotal api</h3>
                        <p className="">See metadata associated with a file you upload and delete it</p>
                        <input type="button" value="Try it out" className="w-fit px-4 py-2 rounded-4xl border-2 font-semibold bg-gray-900 cursor-pointer text-amber-600 transition-all hover:bg-amber-600 hover:text-gray-900 hover:border-amber-600 mx-2 my-8"/>
                    </div>
                    <img src="https://hc-cdn.hel1.your-objectstorage.com/s/v3/9192603388ad9f429d730c600d23563f9af13b7f_image.png" alt="" className="rounded-lg"/>
                </div>
                <div className="h-50 w-4/5 rounded-xl border-3 border-amber-400 flex justify-between my-5 mx-auto p-5">
                    <div>
                        <h3 className="text-2xl font-semibold">Password strengh checker</h3>
                        <p className="">See metadata associated with a file you upload and delete it</p>
                        <Link href="/pass">
                        <input type="button" value="Try it out" className="w-fit px-4 py-2 rounded-4xl border-2 font-semibold bg-gray-900 cursor-pointer text-amber-600 transition-all hover:bg-amber-600 hover:text-gray-900 hover:border-amber-600 mx-2 my-8"/>
                        </Link>
                    </div>
                    <img src="https://hc-cdn.hel1.your-objectstorage.com/s/v3/9192603388ad9f429d730c600d23563f9af13b7f_image.png" alt="" className="rounded-lg"/>
                </div>
            </div>
        </main>
    );
  }
  