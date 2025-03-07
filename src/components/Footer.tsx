import type { ReactElement } from "react";
import "../styles/Footer.scss";
import Box from "./Box";
import AstroIcon from "./icons/AstroIcon";
import GitHubIcon from "./icons/GitHubIcon";
import HeartIcon from "./icons/HeartIcon";
import ReactIcon from "./icons/ReactIcon";
import SASSIcon from "./icons/SASSIcon";
import TailwindCSSIcon from "./icons/TailwindCSS";
import TypeScriptIcon from "./icons/TypeScriptIcon";

function Footer() {
  const props = {
    innerClass:
      "fill-primary hover:fill-primary/60  transition duration-500 ease-in-out hover:scale-125 w-8 h-8",
  };

  const socialNetworks = [
    {
      name: "Astro",
      url: "https://astro.build/",
      icon: <AstroIcon {...props} />,
    },
    {
      name: "React",
      url: "https://react.dev/",
      icon: <ReactIcon {...props} />,
    },
    {
      name: "TailwindCSS",
      url: "https://tailwindcss.com/",
      icon: <TailwindCSSIcon {...props} />,
    },
    {
      name: "TypeScript",
      url: "https://typescriptlang.org/",
      icon: <TypeScriptIcon {...props} />,
    },
    {
      name: "SASS",
      url: "https://sass-lang.com/",
      icon: <SASSIcon {...props} />,
    },
    {
      name: "GitHub",
      url: "https://github.com/",
      icon: <GitHubIcon {...props} />,
    },
  ];

  return (
    <Box className="flex flex-col items-center footer rounded-none! hover:bg-secondary/60 transition-all duration-700 p-2">
      <div>
        <h2 className="text-lg text-center">
          Made with ❤ from Chihuahua using:
        </h2>
      </div>
      <div className="flex flex-row justify-center items-center flex-wrap gap-8 m-4 px-2 pt-2">
        {socialNetworks.map((socialNetwork, index) => {
          return (
            <a
              key={index}
              href={socialNetwork.url}
              target="_blank"
              aria-label={socialNetwork.name}
              rel="noreferrer"
              className="flex flex-column align-center"
            >
              {socialNetwork.icon || socialNetwork.name}
            </a>
          );
        })}
      </div>
    </Box>
  );
}

export default Footer;
