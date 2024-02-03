import { Link } from "react-router-dom"
import usePersist from "../hooks/usePersist"
import useTitle from "../hooks/useTitle"
const Public = () => {
    useTitle("Welcome")
    const [persist] = usePersist()
    const content = (
        <section className="public">
            <header>
                <h1>Welcome to <span className="nowrap">Ark Repairs!</span></h1>
            </header>
            <main className="public__main">
                <p>Located in Beautiful Downtown City, Ark Repairs  provides a trained staff ready to meet your tech repair needs.</p>
                <address className="public__addr">
                    Ark Repairs<br />
                    555 Foo Drive<br />
                    Foo City, CA 12345<br />
                    <a href="tel:+15555555555">(555) 555-5555</a>
                </address>
                <br />
                <p>Owner: Ark the big brain</p>
            </main>
            <footer>
                {persist?<Link to='/dash'>Sign in</Link>:<Link to='/login'>Employee Login</Link>}
            </footer>
        </section>
    )
    return content
}

export default Public