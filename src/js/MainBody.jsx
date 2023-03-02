class MainBody extends React.Component {

    constructor(props) {
        super(props)
    }

    render() {
        return (
            <div className="box body flex flex-column">
                <h1>About me</h1>
                <div className="">
                    I am passionate about technology, especially software, I love discovering new things, innovative tools and methods. I've been a scout since I was a kid, I like to be helpful, spend quality time with my family, play saxophone, fish and play video games. I enjoy playing sports and going camping.
                    I like to be a leader and work in a team, I am sociable, patient and like to make new friends.
                </div>
                <h1>Expertise</h1>
                <div className="flex flex-column align-center">
                    <span>5+ years of experience working with multinational clients, improving the digital experience of business and individuals.</span>
                    <h2>Technologies</h2>
                    <ul className="flex flex-row list">
                        <li>HTML</li>
                        <li>JavaScript</li>
                        <li>CSS</li>
                        <li>React</li>
                        <li>NodeJS</li>
                        <li>Express</li>
                        <li>MySQL</li>
                        <li>Git</li>
                        <li>Scrum</li>
                        <li>Agile</li>
                        <li>ServiceNOW</li>
                        <li>MongoDB</li>
                        <li>Angular.JS</li>
                    </ul>
                </div>
            </div>
        )
    }
}