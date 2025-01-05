import Context from "./Context"
import { Main } from "./modules/Main";

export function Provider() {
    return (
        <Context>
            <Main />
        </Context>
    )
}