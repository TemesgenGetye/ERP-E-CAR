export default function Loading() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <div className="flex flex-col items-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-zinc-900 mb-4"></div>
        {/* <h2 className="text-xl font-semibold text-[var(--heading)]">
          Loading...
        </h2>
        <p className="text-gray-500 mt-2">
          Please wait while we prepare your content
        </p> */}
      </div>
    </div>
  );
}
