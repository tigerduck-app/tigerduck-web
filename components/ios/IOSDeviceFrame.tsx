import Image from "next/image";

interface IOSDeviceFrameProps {
  screenshot?: string;
  alt?: string;
}

export default function IOSDeviceFrame({ screenshot, alt = "iPhone screenshot" }: IOSDeviceFrameProps) {
  return (
    <div className="relative w-[200px] h-[400px] mx-auto">
      <div className="absolute inset-0 rounded-[2.5rem] border-4 border-gray-800 bg-gray-900 shadow-2xl overflow-hidden">
        {screenshot ? (
          <Image src={screenshot} alt={alt} fill className="object-cover" />
        ) : (
          <div data-testid="device-placeholder" className="w-full h-full bg-gray-800 flex items-center justify-center">
            <span className="text-4xl">📱</span>
          </div>
        )}
      </div>
      <div className="absolute top-3 left-1/2 -translate-x-1/2 w-20 h-5 bg-gray-900 rounded-full z-10" />
    </div>
  );
}
