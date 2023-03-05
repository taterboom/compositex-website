import React from "react"
import { DocsThemeConfig } from "nextra-theme-docs"
import Image from "next/image"

const config: DocsThemeConfig = {
  logo: <Image src="/images/compositex-web-logo.png" alt="logo" width={130} height={16} />,
  project: {
    link: "https://github.com/taterboom/compositex-website",
  },
  docsRepositoryBase: "https://github.com/taterboom/compositex-website/tree/main",
  footer: {
    component: null,
  },
  useNextSeoProps() {
    return {
      titleTemplate: "%s – CompositeX",
    }
  },
}

export default config
