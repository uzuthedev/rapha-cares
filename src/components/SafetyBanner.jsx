export default function SafetyBanner() {
  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-40 border-t-2 border-rc-terracotta-dark bg-stone-900 px-4 py-3 text-center shadow-lg"
      role="alert"
    >
      <p className="text-sm font-bold leading-snug text-white sm:text-base">
        This website is a resource directory, not a crisis line. If you are experiencing a mental
        health emergency, please dial{' '}
        <a href="tel:988" className="underline decoration-2 underline-offset-2 hover:text-rc-dusty-light">
          988
        </a>{' '}
        immediately.
      </p>
    </div>
  );
}
