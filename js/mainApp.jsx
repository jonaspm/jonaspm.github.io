class MainApp extends React.Component {

    constructor(props) {
        super(props)
        this.state = {}
    }

    render() {
        return (
            <div className="mainApp">
                <NavBar></NavBar>
                <MainBody></MainBody>
            </div>
        )
    }
    
}