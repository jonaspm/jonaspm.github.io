class Footer extends React.Component {
    
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <div className="box flex footer">
                <div>
                    <h1>Find me in</h1>
                </div>
                <div className="flex social-networks">
                    <a className='flex flex-column align-center' href="https://facebook.com/jperusm">
                        <span>Facebook</span>
                    </a>
                    <a href="https://twitter.com/jperusm">Twitter</a>
                    <a href="https://instagram.com/jperusm">Instagram</a>
                    <a href="https://tikTok.com/@jonaspm">TikTok</a>
                    <a href="https://linkedin.com/in/jonaspm">LinkedIn</a>
                    <a href="mailto:jonaspm_99@outlook.com">Email</a>
                </div>
            </div>
        )
    }
}