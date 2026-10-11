import { NeverInIt } from '@/components/ui/Badges'
import { Todo } from '@/components/ui/Todo'
import { FROSTINGS, type Product } from '@/data/menu'
import { FACTS, SITE, whatsappLink } from '@/data/site'

/**
 * Ingredient transparency: what is never in it, the frosting choice and
 * storage, from the owner's stated facts only. Per-item ingredient lists are
 * an owner TODO; nothing is guessed.
 */
export function IngredientCard({ product }: { product: Product }) {
  if (!product.isFood) {
    return (
      <section aria-labelledby="care-title" className="bg-linen/70 p-6 ring-1 ring-hairline sm:p-8">
        <h2 id="care-title" className="label">
          Good to know
        </h2>
        <p className="mt-3 text-[0.9375rem]">
          Made for the celebration portrait. {FACTS.customisation} Ask us about sizes on{' '}
          <a href={whatsappLink(`Hello ${SITE.name}! A question about the ${product.name}.`)} className="font-semibold text-oxblood underline underline-offset-4">
            WhatsApp
          </a>
          .
        </p>
      </section>
    )
  }
  return (
    <section aria-labelledby="transparency-title" className="bg-linen/70 p-6 ring-1 ring-hairline sm:p-8">
      <h2 id="transparency-title" className="font-display text-2xl text-oxblood">
        What&rsquo;s in it, and what never is
      </h2>
      <NeverInIt className="mt-5" />
      <dl className="mt-6 space-y-5 text-[0.9375rem]">
        {product.frosted ? (
          <div>
            <dt className="label">Frosting</dt>
            <dd className="mt-1">
              {FROSTINGS[0].name} as standard. For pets with allergies: {FROSTINGS[1].name.toLowerCase()}.
            </dd>
          </div>
        ) : null}
        <div>
          <dt className="label">Ingredients</dt>
          <dd className="mt-1">
            {PROMISE_LINE}{' '}
            <Todo fallback={<span>Ask us for the full ingredient list on WhatsApp.</span>} inline>
              full ingredient list for {product.name}
            </Todo>
          </dd>
        </div>
        <div>
          <dt className="label">Storage</dt>
          <dd className="mt-1">
            {product.baked ? (
              FACTS.storage
            ) : (
              <Todo fallback={<span>Ask us how best to store it.</span>} inline>
                storage notes for {product.name}
              </Todo>
            )}
          </dd>
        </div>
        <div>
          <dt className="label">Allergies</dt>
          <dd className="mt-1">{FACTS.allergies}</dd>
        </div>
      </dl>
    </section>
  )
}

const PROMISE_LINE = 'Made with natural ingredients.'
