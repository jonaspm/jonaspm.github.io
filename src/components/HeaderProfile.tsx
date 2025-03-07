import "../styles/HeaderProfile.css";
import { getImage } from "astro:assets";
import Box from "./Box";
import profileImg from "@/assets/images/profile.png";

const profileImage = await getImage({src: profileImg, format: 'avif'});

function HeaderProfile() {
  return (
    <Box className="header-profile backdrop-blur-none! p-5 bg-secondary/0!">
      <Box className="aspect-square rounded-full! max-w-xs self-center profile-container">
        <div style={{backgroundImage: `url('${profileImage.src}')`}} className="profile aspect-square w-full rounded-full" />
      </Box>
    </Box>
  );
}

export default HeaderProfile;
