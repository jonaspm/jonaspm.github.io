class MainApp extends React.Component {

    constructor(props) {
        super(props)
        this.state = {}
    }

    render() {
        return (
            <div className="mainApp">
                <Header />
                <MainBody></MainBody>
                <Footer />
            </div>
        )
    }
    
}