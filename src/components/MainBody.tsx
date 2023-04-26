
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

    return (
        <div className='mainBody max-w-7xl'>
            <Box className='body flex flex-col mt-6 items-center shadow-lg'>
                <h2 className='text-xl font-bold'>About me</h2>
                <div className="text-justify m-4">
                    I am passionate about technology and web development, always looking to learn and use the latest tools and trends in the industry. With more than 5 years of work experience working with various clients and technological cloud-based projects, from websites to mobile and desktop applications. I consider myself a leader, a self-taught, a perfectionist and a problem solver, with a positive, motivating and inclusive attitude. I like to work in a team and share my knowledge and experiences with other professionals. Besides technology, my hobbies are music, sports, family, friends, movies, series and video games. If you want to know more about me or my projects, do not hesitate to contact me.
                </div>
            </Box>
            <Box className='body flex flex-col items-center shadow-lg'>
                <h2 className='text-xl font-bold'>Background</h2>
                <div className="flex flex-col align-center m-4">
                    <span>
                        5+ years of expertise working with small and multinational clients, creating and improving the digital experience of businesses and individuals.
                    </span>
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