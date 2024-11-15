import Part from "./Part"

const Content = ({ parts }) => (
    parts.map( _ => <Part key={ _.id } part={ _ } />)
)

export default Content