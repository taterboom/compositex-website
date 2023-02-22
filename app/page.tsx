import Image from "next/image"
import { Demo } from "./Demo"

export default function Home() {
  return (
    <>
      <header>
        <nav>
          <Image src="" alt="logo" width={237} height={29} />
          <ul>
            <li>
              <a href=""></a>
            </li>
          </ul>
          <button className="btn btn-primary">Download</button>
        </nav>
      </header>
      <main className="">
        <div className="h-screen"></div>
        <Demo></Demo>
      </main>
    </>
  )
}
