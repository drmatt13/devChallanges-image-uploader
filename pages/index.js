import { useState, useEffect, useRef } from 'react'
import Head from 'next/head'

export default function Home() {

  const [processingImage, setProcessingImage] = useState(false)
  const [image, setImage] = useState()
  const [link, setLink] = useState()

  const input = useRef(),
        dragContainer = useRef(),
        uploadBtn = useRef(),
        linkContainer = useRef()

  const preventDefault = e => {
    e.preventDefault()
    e.stopPropagation()
  }

  const processImage = (image) => {

    setProcessingImage(true)

    // if (image.type != ('image/png' || 'image/jpeg')) return { success: false }

    const reader = new FileReader()
    reader.readAsDataURL(image) 
    reader.onloadend = async () => {
      try {
        const req = await fetch('/api/save-image', {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            'data': reader.result,
            'name': image.name
          })
        })
        const res = await req.json()
        setProcessingImage(false)
        if (res.success = true) {
          setImage([image.name, URL.createObjectURL(image)])
          setLink(`${process.env.NEXT_PUBLIC_URL}/images/${image.name}`)
        }
        return res
      } catch (error) {
        console.log(error)
        setProcessingImage(false)
        return { success: false }
      }
    }

  }

  const copyLink = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(link).then(() => {
        console.log('Copied to clipboard successfully.');
      }, (err) => {
        console.log('Failed to copy the text to clipboard.', err);
      });
    } else if (window.clipboardData) {
      window.clipboardData.setData("Text", link);
    }
  }

  useEffect(() => {
    // handle input
    input.current.onchange = () => {
      processImage(input.current.files[0])
    }
    // handle drag and drop
    dragContainer.current.addEventListener('dragenter', preventDefault, false)
    dragContainer.current.addEventListener('dragleave', preventDefault, false)
    dragContainer.current.addEventListener('dragover', preventDefault, false)
    dragContainer.current.addEventListener('drop', preventDefault, false)
    dragContainer.current.addEventListener('drop', e => {
      processImage(e.dataTransfer.files[0])
    })
  }, [])

  return <>
    <Head>
      <title>Image Uploader</title>
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png"></link>
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png"></link>
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png"></link>
    </Head>
    <style jsx>{`
      .min-h-screen {
        font-family: 'Roboto', sans-serif;
      }
    `}</style>
    {/* hidden input */}
    <input ref={input} type="file" accept="image/png, image/jpeg" className="hidden" />
    {/* hidden input */}
    <div className="min-h-screen w-full flex justify-center items-center bg-gray-100">
      <div className="sm:w-96 px-8 pt-10 pb-9 bg-white text-gray-600 rounded-xl shadow border flex flex-col items-center">
        {(!processingImage && !image) && <>
          <h1 className="text-2xl">Upload your image</h1>
          <h2 className="mt-3 text-xs">File should be Jpeg, Png...</h2>
          <div ref={dragContainer} className="flex flex-col items-center justify-evenly w-full mt-5 h-52 bg-gray-100 rounded-xl border border-1 border-blue-500 border-dashed">
            <i className="far fa-images text-blue-300 text-7xl" />
            <div className="text-gray-400 text-xs select-none">Drag & Drop your image here</div>
          </div>
          <div className="mt-4 text-gray-400 text-xs">Or</div>
          <button 
            ref={uploadBtn} 
            onClick={() => input.current.click()}
            className="flex mt-4 py-2 px-6 rounded-xl bg-blue-600 text-white hover:bg-blue-500"
          >
            Choose a file
          </button>
        </>}
        {processingImage && <>
          <h1 className="mt-10 text-xl">Uploading...</h1>
          <div className="mt-10 w-full"></div>
        </>}
        {(!processingImage && image) && <>
          <i className="fas fa-check-circle text-green-600 text-5xl" />
          <h1 className="mt-4 text-xl">Uploaded Successfully!</h1>
          <div className="mt-5 mx-16 w-full h-52">
            <img 
              className="object-cover h-full w-full rounded-xl"
              src={image[1]} 
              alt={image[0]} />
          </div>
          <div className="mt-8  p-0.5 w-full rounded-xl shadow border flex items-center">
            <div
              ref={linkContainer}
              className="flex-1 px-3 text-sm truncate"
            >
              {link}
            </div>
            <div
              onClick={copyLink}
              className="select-none h-full flex items-center px-4 py-2 bg-blue-600 text-white hover:bg-blue-500 rounded-xl cursor-pointer"
            >
              Copy Link
            </div>
          </div>
        </>}
      </div>
      <footer className="absolute bottom-2 right-4 text-gray-400">created by Matthew Sweeney</footer>
    </div>
  </>
}
