export default function SafetyBanner({ siteSettings }) {
  const safetyNotice =
    siteSettings?.safetyNotice ||
    'This website is a resource directory, not a crisis line. If you are experiencing a mental health emergency, please dial 988 immediately.';

  return (
    <div
      className="w-full bg-black py-2.5 px-4 text-center z-50 relative"
      role="alert"
    >
      <p className="text-xs sm:text-sm font-normal tracking-wide text-white leading-snug">
        {safetyNotice.includes('988') ? (
          <>
            {safetyNotice.split('988')[0]}
            <a
              href="tel:988"
              className="underline decoration-1 underline-offset-2 font-medium hover:text-stone-300 transition-colors"
            >
              988
            </a>
            {safetyNotice.split('988')[1]}
          </>
        ) : (
          safetyNotice
        )}
      </p>
    </div>
  );
}
