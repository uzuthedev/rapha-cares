export default function SectionHeading({ title, subtitle }) {
  return (
    <div className="mb-10 text-center">
      <h1 className="font-display text-3xl text-rc-terracotta-dark sm:text-4xl">{title}</h1>
      {subtitle && <p className="mx-auto mt-3 max-w-2xl text-stone-600">{subtitle}</p>}
    </div>
  );
}
