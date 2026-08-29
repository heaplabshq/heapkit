import { useDocumentMeta } from '../lib/useDocumentMeta'

export function Privacy() {
  useDocumentMeta(
    'Privacy Policy | heapkit',
    'How heapkit handles data: nothing you enter into the tools is ever sent to a server.',
  )

  return (
    <div className="article-body flex max-w-3xl flex-col gap-6 text-left">
      <h1 className="text-2xl font-semibold tracking-tight text-ink-strong">Privacy Policy</h1>

      <div className="flex flex-col gap-6 text-[15px] text-ink">
        <section className="flex flex-col gap-2">
          <h2 className="text-base font-semibold text-ink-strong">What the tools do with your data</h2>
          <p>
            Every tool on heapkit runs entirely in your browser. Text you paste into a
            formatter, decoder, hash generator, or any other tool is processed locally on your
            device and is never uploaded to, or stored on, any server. Closing or refreshing the
            tab discards it completely.
          </p>
        </section>

        <section className="flex flex-col gap-2">
          <h2 className="text-base font-semibold text-ink-strong">Analytics</h2>
          <p>
            We use Cloudflare Web Analytics to understand overall traffic — which pages get
            visited and roughly how much traffic the site gets. It sets no cookies, uses no
            client-side state, and does not fingerprint you or track you across other sites.
            The data is aggregated and does not identify you individually.
          </p>
        </section>

        <section className="flex flex-col gap-2">
          <h2 className="text-base font-semibold text-ink-strong">Advertising</h2>
          <p>
            heapkit may show ads served by Google AdSense to help cover hosting costs and keep
            every tool free. Google and its advertising partners may use cookies to serve ads
            based on your prior visits to this or other sites. You can opt out of personalized
            advertising, or see which companies have enabled personalization, at Google's{' '}
            <a
              href="https://adssettings.google.com/"
              target="_blank"
              rel="noreferrer"
              className="underline transition hover:text-ink-strong"
            >
              Ads Settings
            </a>
            .
          </p>
        </section>

        <section className="flex flex-col gap-2">
          <h2 className="text-base font-semibold text-ink-strong">Contact</h2>
          <p>
            Questions about this policy? Open an issue on{' '}
            <a
              href="https://github.com/heaplabshq/heapkit"
              target="_blank"
              rel="noreferrer"
              className="underline transition hover:text-ink-strong"
            >
              GitHub
            </a>
            .
          </p>
        </section>
      </div>
    </div>
  )
}
