'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import InfiniteScroll from 'react-infinite-scroll-component'

const generateImages = (start: number, end: number) => {
  const sizes = [
    { width: 400, height: 600 },  // Tall
    { width: 400, height: 300 },  // Medium
    { width: 400, height: 200 },  // Small
  ]
  return Array.from({ length: end - start }, (_, i) => {
    const size = sizes[Math.floor(Math.random() * sizes.length)]
    return {
      id: start + i,
      url: `/placeholder.svg?width=${size.width}&height=${size.height}`,
      width: size.width,
      height: size.height,
      alt: `Image ${start + i}`
    }
  })
}

export function ResponsiveMasonryGallery() {
  const [images, setImages] = useState(generateImages(0, 21))
  const [hasMore, setHasMore] = useState(true)
  const [columns, setColumns] = useState(3)
  const galleryRef = useRef<HTMLDivElement>(null)

  const fetchMoreData = () => {
    const newImages = generateImages(images.length, images.length + 21)
    setImages([...images, ...newImages])
    if (images.length >= 100) {
      setHasMore(false)
    }
  }

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setColumns(1)
      } else if (window.innerWidth < 920) {
        setColumns(2)
      } else {
        setColumns(3)
      }
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    if (!galleryRef.current) return

    const gallery = galleryRef.current
    gallery.innerHTML = ''

    const columnElements = Array.from({ length: columns }, () => document.createElement('div'))

    columnElements.forEach(column => {
      column.style.display = 'flex'
      column.style.flexDirection = 'column'
      column.style.flex = '1'
      column.style.gap = '8px'
      gallery.appendChild(column)
    })

    images.forEach((image, index) => {
      const column = columnElements[index % columns]
      const imgContainer = document.createElement('div')
      imgContainer.style.width = '100%'
      imgContainer.style.position = 'relative'
      imgContainer.style.paddingBottom = `${(image.height / image.width) * 100}%`
      
      const img = document.createElement('img')
      img.src = image.url
      img.alt = image.alt
      img.style.position = 'absolute'
      img.style.top = '0'
      img.style.left = '0'
      img.style.width = '100%'
      img.style.height = '100%'
      img.style.objectFit = 'cover'
      
      imgContainer.appendChild(img)
      column.appendChild(imgContainer)
    })
  }, [images, columns])

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 bg-background">
        <div className="w-full px-4 py-4">
          <Image 
            src="/placeholder.svg?height=50&width=200" 
            alt="Logo" 
            width={200} 
            height={50} 
            className="mx-auto"
          />
        </div>
      </header>
      <main className="w-full px-4 py-8">
        <InfiniteScroll
          dataLength={images.length}
          next={fetchMoreData}
          hasMore={hasMore}
          loader={<h4 className="text-center py-4">Loading...</h4>}
          endMessage={
            <p className="text-center py-4">Yay! You have seen it all</p>
          }
        >
          <div ref={galleryRef} className="flex w-full gap-2" />
        </InfiniteScroll>
      </main>
    </div>
  )
}