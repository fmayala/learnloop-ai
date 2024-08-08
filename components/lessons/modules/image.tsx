import React from 'react'
import { Module } from '@prisma/client'
import { ModuleIcon } from './icons'
import { default as Img } from 'next/image'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from '../../ui/carousel'
import { Card, CardContent } from '@/components/ui/card'

interface ImageProps {
  module: Module
  images: string[]
}

export function Image({ module }: ImageProps) {
  return (
    <div className="rounded-lg border bg-background p-8 w-full">
      <div className="flex items-center mb-4">
        <ModuleIcon type="image" />
        <h2 className="text-base font-bold ml-2">
          {module.topic || 'Multiple-Choice Title'}
        </h2>
      </div>
      <p className="text-base leading-9 text-muted-foreground">
        {module.description ||
          'This is a short summary of the audio content, providing an overview of what listeners can expect.'}
      </p>
      <div className="flex flex-col space-y-4"></div>
    </div>
  )
}

export function ImageDisplay({ module, images }: ImageProps) {
  console.log('Images:', images)
  return (
    <div className="rounded-lg border bg-background p-8 w-full">
      <div className="flex items-center mb-4">
        <ModuleIcon type="image" />
        <h2 className="text-base font-bold ml-2">
          {module.topic || 'Image Gallery'}
        </h2>
      </div>
      <p className="text-base leading-9 text-muted-foreground">
        {module.description ||
          'This is a short summary of the image content, providing an overview of what viewers can expect.'}
      </p>
      <div className="flex flex-col space-y-4 px-6 mt-6">
        <Carousel className="w-full">
          <CarouselContent>
            {images.map((image, index) => (
              <CarouselItem key={index}>
                <img
                  src={image.link}
                  alt={`Image ${index + 1}`}
                  className="rounded-lg w-full h-auto" // Set specific width and height here if necessary
                  style={{
                    height: '600px', // Set a fixed height
                    width: '100%', // Set width to 100% of the container
                    objectFit: 'contain' // This will cover the area of the box without distorting the aspect ratio of the image
                  }}
                />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
    </div>
  )
}
