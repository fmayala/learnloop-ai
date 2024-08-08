import React from 'react'
import { Module } from '@prisma/client'
import { ModuleIcon } from './icons'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel'

// Create interface based off this
/*
{
            "kind": "youtube#searchResult",
            "etag": "_bA6rRu25zFWIAv_OilgwWeyfYA",
            "id": {
                "kind": "youtube#video",
                "videoId": "gjVX47dLlN8"
            }
        }, */

interface Video {
  kind: string,
  etag: string,
  id: {
    kind: string,
    videoId: string
  }
}

interface VideoProps {
  module: Module,
  videos?: Video[]
}

export function Video({ module }: VideoProps) {
  return (
    <div className="rounded-lg border bg-background p-8">
      <div className="flex items-center mb-4">
        <ModuleIcon type="video" />
        <h2 className="text-base font-bold ml-2">
          {module.topic || 'Multiple-Choice Title'}
        </h2>
      </div>
      <p className="text-md text-muted-foreground">
        {module.description ||
          'This is a short summary of the audio content, providing an overview of what listeners can expect.'}
      </p>
      <div className="flex flex-col space-y-4">
        {/* Audio player element */}
        {/* <audio controls className="w-full">
          {<source src={module.content || 'path/to/your/audio/file.mp3'} type="audio/mpeg" /> }
          Your browser does not support the audio element.
        </audio> */}
      </div>
    </div>
  )
}

export function VideoDisplay({ module, videos }: VideoProps) {
  return (
    <div className="rounded-lg border bg-background p-8 w-full">
      <div className="flex items-center mb-4">
        <ModuleIcon type="video" />
        <h2 className="text-base font-bold ml-2">
          {module.topic || 'Multiple-Choice Title'}
        </h2>
      </div>
      <p className="text-base leading-9 text-muted-foreground">
        {module.description ||
          'This is a short summary of the audio content, providing an overview of what listeners can expect.'}
      </p>
      <div className="flex flex-col space-y-4 px-6 mt-6">
      <Carousel className="w-full">
          <CarouselContent>
            {videos && videos.map((image, index) => (
              <CarouselItem key={index}>
                <iframe
                  src={`https://www.youtube.com/embed/${image.id.videoId}`}
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

