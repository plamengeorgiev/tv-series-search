const APP_NAME = 'TV series search'

interface PageTitleProps {
  /** What the page shows. Leave it out for the app's home page. */
  title?: string
}

/** Sets the browser tab title while mounted. React 19 hoists <title> into <head>. */
export function PageTitle({ title }: PageTitleProps) {
  // React wants a single string child here, so the parts are joined up front.
  return <title>{title ? `${title} · ${APP_NAME}` : APP_NAME}</title>
}
