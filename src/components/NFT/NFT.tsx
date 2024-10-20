import React, { useState, useRef, useEffect } from "react"

export const NFT = ({ image, height }: { image: string; height: number }) => {
  const [animate, setAnimate] = useState(true)

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const imageRef = useRef<HTMLImageElement>(null)

  useEffect(() => {
    if (height > 0 && imageRef.current && canvasRef.current) {
      getSnapshot(imageRef.current, canvasRef.current, height)
    }
  }, [image, height])

  return (
    <NFTGrid
      onMouseEnter={() => {
        setAnimate(false)
      }}
      onMouseLeave={() => {
        // snapshot the current frame so the transition to the canvas is smooth
        if (imageRef.current && canvasRef.current) {
          getSnapshot(imageRef.current, canvasRef.current, height)
        }
        setAnimate(true)
      }}
    >
      <NFTCanvas ref={canvasRef} />
      <NFTImage
        ref={imageRef}
        src={image}
        className={`absolute top-0 left-0 ${animate ? "z-20" : ""}`} // Adjust z-index dynamically
        hidden={!animate}
        onLoad={() => {
          // snapshot for the canvas
          if (height > 0 && imageRef.current && canvasRef.current) {
            getSnapshot(imageRef.current, canvasRef.current, height)
          }
        }}
      />
    </NFTGrid>
  )
}

export const NFTGrid = ({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      className="relative grid grid-cols-1 gap-0 overflow-hidden rounded-2xl"
      {...props}
    >
      {children}
    </div>
  )
}

export const NFTCanvas = React.forwardRef<
  HTMLCanvasElement,
  React.CanvasHTMLAttributes<HTMLCanvasElement>
>((props, ref) => {
  return <canvas className="relative top-0 left-0" ref={ref} {...props}></canvas>
})

export const NFTImage = React.forwardRef<
  HTMLImageElement,
  React.ImgHTMLAttributes<HTMLImageElement>
>((props, ref) => {
  return <img className="z-10" ref={ref} {...props} />
})

// snapshots a src img into a canvas
export function getSnapshot(
  src: HTMLImageElement,
  canvas: HTMLCanvasElement,
  targetHeight: number,
) {
  const context = canvas.getContext("2d")

  if (context) {
    let { width, height } = src

    // src may be hidden and not have the target dimensions
    const ratio = width / height
    height = targetHeight

    // different browsers must have width set to load properly
    width = targetHeight
    // width = Math.round(ratio * targetHeight)

    // Ensure crispness at high DPIs
    canvas.width = width * devicePixelRatio
    canvas.height = height * devicePixelRatio
    canvas.style.width = width + "px"
    canvas.style.height = height + "px"
    context.scale(devicePixelRatio, devicePixelRatio)

    context.clearRect(0, 0, width, height)
    context.drawImage(src, 0, 0, width, height)
  }
}

export const LoadingNFT = ({ height }: { height: number }) => {
  return (
    <div className="animate-pulse">
      <div
        style={{ width: `${height}px`, height: `${height}px` }}
        className="bg-marginalGray-850 rounded-3xl"
      ></div>
    </div>
  )
}
