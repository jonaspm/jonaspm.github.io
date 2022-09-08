class Header extends React.Component {
    
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <div className="box header">
                <HeaderResume />
                <HeaderProfile/>
            </div>
        )
    }
}