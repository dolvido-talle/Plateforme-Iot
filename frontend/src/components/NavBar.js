import ConnectWithoutContactIcon from "@mui/icons-material/ConnectWithoutContact";

function NavBar() {
  return (
    <div className="flex justify-start items-center p-4">
      <h1 className="text-xl font-serif cursor-pointer  text-blue-600 hover:text-blue-400">
        Plateforme-Iot
      </h1>
      <ConnectWithoutContactIcon className="ml-2 cursor-pointer text-blue-600 hover:text-blue-400 relative top-[-2px]" />
    </div>
  );
}

export default NavBar;
