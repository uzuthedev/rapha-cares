export default function SectionHeading({ title, subtitle }) {
  return (
    <div className="mb-12 text-center">
      <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-rc-forest-dark tracking-tight">
        {title}
      </h1>
      {subtitle && (
        <p className="mx-auto mt-3 max-w-2xl text-rc-muted text-base sm:text-lg leading-relaxed font-sans">
          {subtitle}
        </p>
      )}
    </div>
  );
}
