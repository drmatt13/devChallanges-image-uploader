import Head from 'next/head'

export default function Home() {
  return <>
    <div className="min-h-screen w-full flex justify-center items-center bg-gray-100">
      <div className="bg-white rounded-xl shadow-lg border flex flex-col items-center">
        <h1 className="mt-10 text-xl text-black">
          Upload your image
        </h1>
        <h2 className="mt-3 text-xs">
          File should be .Jpeg, .Png...
        </h2>
        <div className="flex flex-col items-center justify-evenly mt-6 mx-10 w-64 h-40 bg-gray-100 rounded-xl border border-1 border-blue-500">
          <i className="far fa-images text-blue-300 text-7xl" />
          <div className="text-gray-400 text-xs select-none">Drag & Drop your image here</div>
        </div>
        <div className="mt-4 text-gray-400 text-xs">Or</div>
        <button className="flex mt-4 mb-8 py-2 px-6 rounded-xl bg-blue-600 text-white hover:bg-blue-500 ">
          Choose a file
        </button>
      </div>
    </div>
  </>
}
