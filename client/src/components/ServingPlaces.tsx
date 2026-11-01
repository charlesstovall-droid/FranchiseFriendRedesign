import {
  charlestonAreaPlaces,
  charlestonServing,
  cityPageLinks,
  mountPleasantNeighborhoods,
  mountPleasantServing,
  type ServingCopy,
} from "@shared/service-areas";

function CityLinks() {
  return (
    <nav aria-label="City pages" className="mt-8 flex flex-col gap-2 text-sm">
      {cityPageLinks.map((link) => (
        <a key={link.href} href={link.href} className="font-semibold text-[#12304C] underline decoration-[#9BD7B3] underline-offset-4 hover:decoration-[#F2C740]">
          {link.label}
        </a>
      ))}
    </nav>
  );
}

function PlaceList({ label, places }: { label: string; places: readonly string[] }) {
  return (
    <div className="mt-6">
      <h3 className="font-serif text-lg font-semibold mb-3">{label}</h3>
      <ul className="flex flex-wrap gap-2">
        {places.map((place) => (
          <li key={place} className="border border-[#12304C]/15 bg-white px-3 py-1.5 text-sm text-[#12304C]">
            {place}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function CityPageLinks() {
  return (
    <section className="bg-[#F4ECE1] text-[#12304C] py-16">
      <div className="max-w-3xl mx-auto px-5 md:px-10">
        <h2 className="font-serif text-2xl font-bold">City pages</h2>
        <CityLinks />
      </div>
    </section>
  );
}

export function ServingPlaces({ variant }: { variant: "mount-pleasant" | "charleston" }) {
  const copy: ServingCopy = variant === "mount-pleasant" ? mountPleasantServing : charlestonServing;
  return (
    <section className="bg-[#F4ECE1] text-[#12304C] py-16 md:py-20" aria-labelledby={`${variant}-serving`}>
      <div className="max-w-3xl mx-auto px-5 md:px-10">
        <p className="text-[11px] font-semibold tracking-[0.24em] uppercase mb-4 text-[#12304C]/50">Serving</p>
        <h2 id={`${variant}-serving`} className="font-serif text-3xl md:text-4xl font-bold mb-4 leading-tight">
          {copy.heading}
        </h2>
        <p className="leading-relaxed text-[#12304C]/80">{copy.intro}</p>
        <PlaceList label="Mount Pleasant" places={mountPleasantNeighborhoods} />
        <PlaceList label="Around Charleston" places={charlestonAreaPlaces} />
        <CityLinks />
      </div>
    </section>
  );
}
