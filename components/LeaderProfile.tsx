import Image from "next/image";
import type { LeaderProfile as Profile } from "@/lib/content";

/**
 * One named leadership profile on /about.
 *
 * Three grid children with explicit placement, for two reasons.
 *
 * `self-start` on the photo keeps it square: grid children stretch by default,
 * which would pull a 1:1 headshot to the height of a 400-word bio and let
 * object-cover crop it to roughly 1:2 — a hard zoom into the subject's face.
 *
 * The explicit rows put the name above the photo when the grid collapses to
 * one column. In source order the photo comes second, so a phone reads
 * name → photo → credentials → bio instead of meeting a stranger's photograph
 * and a credential list before their name.
 */
export default function LeaderProfile({ profile }: { profile: Profile }) {
  return (
    <article className="mx-auto mt-14 max-w-5xl rounded-2xl border border-border bg-white p-8 shadow-soft md:p-10 lg:p-12">
      <div className="grid gap-y-8 md:grid-cols-[minmax(0,19rem)_1fr] md:gap-x-12">
        <div className="md:col-start-2 md:row-start-1">
          <h3 className="text-2xl md:text-3xl">{profile.name}</h3>
          <p className="mt-2.5 text-xs font-semibold uppercase tracking-[0.16em] text-gold-dark">
            {profile.title}
          </p>
        </div>

        {/* Credentials sit under the photo rather than beside the name: the
            bio runs several hundred words, so a photo-only column would leave
            a tall empty gutter next to it. */}
        <div className="mx-auto w-full max-w-[19rem] self-start md:col-start-1 md:row-span-2 md:row-start-1 md:mx-0 md:max-w-none">
          {/*
            The border is not decoration. These portraits come from different
            studios — one on a lavender-grey backdrop, one cut out on pure
            white — and the white one would otherwise bleed into the white card
            and read as a floating head.
          */}
          <Image
            src={profile.image}
            alt={profile.name ?? profile.title}
            width={profile.imageSize}
            height={profile.imageSize}
            // Square source into a square box, so object-cover crops nothing.
            sizes="304px"
            className="aspect-square w-full rounded-2xl border border-border object-cover shadow-soft"
          />

          <span className="rule-gold mt-7" aria-hidden="true" />

          <ul className="mt-5 space-y-3">
            {profile.credentials.map((item) => (
              <li key={item} className="flex gap-3 text-sm leading-snug text-ink-muted">
                <span
                  className="mt-[0.4rem] h-1.5 w-1.5 shrink-0 rounded-full bg-gold"
                  aria-hidden="true"
                />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="min-w-0 md:col-start-2 md:row-start-2">
          <span className="rule-gold" aria-hidden="true" />

          <div className="mt-6 space-y-5 text-sm leading-relaxed text-ink-muted md:text-base">
            {profile.bio.map((para) => (
              <p key={para.slice(0, 40)}>{para}</p>
            ))}
          </div>

          {/*
            Rendered as a statement about the person, not a quotation. The
            client described the approach in the third person and we are not
            putting invented words inside quote marks beside a real person's
            photograph.
          */}
          {profile.statement && (
            <p className="mt-7 border-l-2 border-gold bg-gold/[0.06] py-4 pl-5 pr-4 text-sm leading-relaxed text-navy md:text-base">
              {profile.statement}
            </p>
          )}

          {profile.personal && (
            <p className="mt-7 text-sm leading-relaxed text-ink-muted">
              {profile.personal}
            </p>
          )}
        </div>
      </div>
    </article>
  );
}
