import '../styles/Footer.scss'
import Box from './Box'

function Footer() {

    const socialNetworks = [
        {
            name: 'Astro',
            url: 'https://astro.build/'
        },
        {
            name: 'React',
            url: 'https://react.dev/'
        },
        {
            name: 'TailwindCSS',
            url: 'https://tailwindcss.com/'
        },
        {
            name: 'TypeScript',
            url: 'https://typescriptlang.org/'
        },
        {
            name: 'SASS',
            url: 'https://sass-lang.com/'
        },
        {
            name: 'GitHub',
            url: 'https://github.com/'
        }
    ]

    return (
        <Box className="flex flex-col items-center footer rounded-none">
            <div>
                <h2 className='text-lg'>Made with ❤ from Chihuahua using:</h2>
            </div>
            <div className="flex flex-row justify-center items-center flex-wrap gap-8 m-4 social-networks">
                {
                    socialNetworks.map((socialNetwork, index) => {
                        return (
                            <a key={index} href={socialNetwork.url} target="_blank" rel="noreferrer" className="flex flex-column align-center transition duration-500 hover:scale-125 hover:text-gray-300 ease-in-out">
                                {socialNetwork.name}
                            </a>
                        )
                    })
                }
            </div>

        </Box>
    )
}

export default Footer