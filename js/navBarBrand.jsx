class NavBarBrand extends React.Component {
    
    constructor(props) {
        super(props)
        this.state = {

        }
    }

    handleClickMenu = (e) => {
        e.preventDefault();
        this.props?.burgerMenuClicked?.()
    }

    render() {
        return (
            <div className="navbar-brand">
                <a href="/" className="navbar-item">
                    <img src="https://bulma.io/images/bulma-logo.png" width="112" height="28"/>
                </a>
                <a role="button" className="navbar-burger" aria-label="menu" aria-expanded="false" data-target="navbarMenu" onClick={this.handleClickMenu}>
                    <span aria-hidden="true"></span>
                    <span aria-hidden="true"></span>
                    <span aria-hidden="true"></span>
                </a>
            </div>
        )
    }
}