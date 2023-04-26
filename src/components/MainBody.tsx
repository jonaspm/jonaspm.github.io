
import '../styles/MainBody.scss'
import Box from './Box'
import '../styles/MainBody.scss'

function MainBody() {

    const technologies = [
        'HTML',
        'JavaScript',
        'CSS',
        'React',
        'NodeJS',
        'Express',
        'MySQL',
        'Git',
        'Scrum',
        'ServiceNOW',
        'MongoDB',
        'Angular.JS',
        'Next.js'
    ]

    const aboutText = 'Software Engineer whose passion for technology and web development drives him to constantly learn and use the latest tools and trends in the industry. Has strong leadership, self-learning, problem-solving and perfectionism skills, as well as a positive, motivating and integrative attitude. He enjoys working in a team and sharing my knowledge and experiences with other professionals. In addition to technology, he has interests in music, sports, family, friends, movies, tv series and video games. Feel free to contact him if it is your desire to know more about his projects.'
    const backgroundText = 'With over 5 years of work experience enhancing the digital experience of people through innovative & cutting-edge technology solutions. Has collaborated with various clients and delivered cloud-based technology projects, including web, mobile and desktop applications.'

    return (
        <div className='mainBody max-w-7xl'>
            <Box className='body flex flex-col mt-6 items-center shadow-lg'>
                <h2 className='text-xl font-bold'>About me</h2>
                <div className="text-justify m-4">
                    {aboutText}
                </div>
            </Box>
            <Box className='body flex flex-col items-center shadow-lg'>
                <h2 className='text-xl font-bold'>Background</h2>
                <div className="flex flex-col align-center m-4 text-justify">
                    {backgroundText}
                </div>
            </Box>
            <Box className='body flex flex-col mb-6 items-center shadow-lg'>
                <h2 className='text-xl font-bold'>Technologies</h2>
                <div className='m-4'>
                    <ul className="flex flex-row list items-center justify-center gap-8 flex-wrap">
                        {
                            technologies.map((technology, index) => {
                                return (
                                    <li key={index} className="flex flex-col align-center">{technology}</li>
                                )
                            })
                        }
                    </ul>
                </div>
            </Box>
        </div>
    )
}

export default MainBody