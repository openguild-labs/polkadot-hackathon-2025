const CURRENT_YEAR = new Date().getFullYear();

export function Footer() {
  return (
    <footer className=" pb-5 p-5 md:pt-10 backdrop-blur-lg border-t-[1px] border-[#60799e] text-white">
      <div className="container flex flex-col mx-auto">
        <div
          color="blue-gray"
          className="text-center mt-1 font-normal !text-white"
        >
          &copy; {CURRENT_YEAR} Made with Solidithi Squad
        </div>
      </div>
    </footer>
  );
}

export default Footer;
