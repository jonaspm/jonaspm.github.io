class NavBar extends React.Component {
    
    constructor(props) {
        super(props)
        this.state = {
            showMenu: false
        }
        this.listeners = []
    }

    burgerMenuClicked = () => {
        this.setState({
            showMenu: !this.state.showMenu
        }, () => {
            this.fireListeners(this.state.showMenu)
        })
    }

    fireListeners = (value) => {
        for (let listener in this.listeners)
        {
            listener?.(value)
        }
    }

    addListener = (f) => this.listeners.push(f)

    render() {
        return (
            <nav className="navbar jpm-navbar" role="navigation" aria-label="main navigation">
                <NavBarBrand burgerMenuClicked={this.burgerMenuClicked}></NavBarBrand>
                <NavBarMenu showMenu={this.state.showMenu} addListener={this.addListener}></NavBarMenu>
            </nav>
        )
    }
}