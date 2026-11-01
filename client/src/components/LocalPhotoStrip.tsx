import { localPhotoAlts } from "@/photos/local/alts";

/**
 * Homepage photo strip. Renders nothing until real photos are added to
 * client/src/photos/local and given alt text in alts.ts. See README.md there.
 */
const localPhotoModules = import.meta.glob("../photos/local/*.{jpg,jpeg,png,webp,avif}", {
  eager: true,
  import: "default",
}) as Record<string, string>;

export function LocalPhotoStrip() {
  const photos = Object.entries(localPhotoModules)
    .map(([path, src]) => {
      const file = path.split("/").pop() ?? "";
      const alt = localPhotoAlts[file]?.trim();
      if (!file || !alt) return null;
      return { file, src, alt };
    })
    .filter((photo): photo is { file: string; src: string; alt: string } => photo !== null);

  if (photos.length === 0) return null;

  return (
    <section className="photo-strip" aria-label="Mount Pleasant and Charleston">
      <div className="wrap">
        <span className="eyebrow">Around here</span>
        <h2>Places I actually work.</h2>
        <ul>
          {photos.map((photo) => (
            <li key={photo.file}>
              <figure>
                <img src={photo.src} alt={photo.alt} />
                <figcaption>{photo.alt}</figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
