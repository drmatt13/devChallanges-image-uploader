import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
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
        const req = await fetch('/api?test=test', {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            'data': reader.result
          })
        })
        const res = await req.json()
        if (res.success === true) {
          setImage([image.name, URL.createObjectURL(image)])
          setLink(`${process.env.NEXT_PUBLIC_URL}/${res.id}`)
        }
        console.log(res)
        setProcessingImage(false)
      } catch (error) {
        console.log(error)
        setProcessingImage(false)
        return { success: false }
      }
    }

  }

  function fallbackCopyTextToClipboard(text) {
    var textArea = document.createElement("textarea");
    textArea.value = text;
    
    // Avoid scrolling to bottom
    textArea.style.top = "0";
    textArea.style.left = "0";
    textArea.style.position = "fixed";
  
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
  
    try {
      var successful = document.execCommand('copy');
      var msg = successful ? 'successful' : 'unsuccessful';
      console.log('Fallback: Copying text command was ' + msg);
    } catch (err) {
      console.error('Fallback: Oops, unable to copy', err);
    }
  
    document.body.removeChild(textArea);
  }
  function copyTextToClipboard(text) {
    if (!navigator.clipboard) {
      fallbackCopyTextToClipboard(text);
      return;
    }
    navigator.clipboard.writeText(text).then(function() {
      console.log('Async: Copying to clipboard was successful!');
    }, function(err) {
      console.error('Async: Could not copy text: ', err);
    });
  }

  const copyLink = () => {
    fallbackCopyTextToClipboard(link)
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
    <input ref={input} type="file" accept="image/png, image/gif, image/jpeg" className="hidden" />
    {/* hidden input */}
    <div className="min-h-screen px-4 w-full flex justify-center items-center bg-gray-100">
      <div className="w-80 xs:w-96 px-8 pt-10 pb-9 bg-white text-gray-600 rounded-xl shadow border flex flex-col items-center">
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
          <h1 className="w-full text-xl">Uploading...</h1>
          <div className="w-full h-2 mt-6 rounded-full bg-gray-200 overflow-hidden">
            <div className="bg-blue-500 h-full w-1/3 rounded-full animate-progress-bar" />
          </div>
        </>}
        {(!processingImage && image) && <>
          <i className="fas fa-check-circle text-green-600 text-5xl" />
          <h1 className="mt-4 text-xl text-center">Uploaded Successfully!</h1>
          <div className="mt-5 mx-16 w-full h-52 cursor-pointer">
            <Link href={link}>
              <img 
                  className="object-cover h-full w-full rounded-xl"
                  src={image[1]} 
                  alt={image[0]} 
              />
            </Link>
          </div>
          <div className="mt-8 p-0.5 w-full rounded-xl shadow border flex items-center justify-between">
            <div
              ref={linkContainer}
              className="flex-1 px-3 text-sm truncate"
            >
              <div className="max-w-full truncate">{link}</div>
            </div>
            <div
              onClick={copyLink}
              className="select-none h-full flex items-center px-4 py-2 flex-shrink-0 bg-blue-600 text-white hover:bg-blue-500 rounded-xl cursor-pointer"
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
