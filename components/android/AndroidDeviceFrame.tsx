import Image from "next/image";

interface AndroidDeviceFrameProps {
  screenshot?: string;
  alt?: string;
}

export default function AndroidDeviceFrame({ screenshot, alt = "Android screenshot" }: AndroidDeviceFrameProps) {
  return (
    <div className="relative w-[200px] h-[420px] mx-auto">
      <div className="absolute inset-0 rounded-[1.5rem] border-4 border-gray-700 bg-gray-900 shadow-2xl overflow-hidden">
        {screenshot ? (
          <Image src={screenshot} alt={alt} fill className="object-cover" />
        ) : (
          <div className="w-full h-full bg-gray-800 flex items-center justify-center">
            <span className="text-4xl">🤖</span>
          </div>
        )}
      </div>
      <div className="absolute top-3 left-1/2 -translate-x-1/2 w-4 h-4 bg-gray-900 rounded-full z-10" />
    </div>
  );
}
