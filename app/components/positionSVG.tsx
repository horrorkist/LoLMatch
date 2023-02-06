export const AllSVG = () => (
  <svg
    className="w-6 h-6 position-icon fill-white"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    aria-label="포지션 전체"
  >
    <path d="M16.2928076,17.0307921 C16.6549683,17.6584306 16.4399705,18.4608135 15.8125108,18.8232841 C15.1844161,19.1872046 14.3817451,18.9719172 14.0194579,18.3440595 L11.8751153,14.6269842 L9.73077279,18.3440595 C9.36848556,18.9719172 8.56581451,19.1872046 7.93795682,18.8249174 C7.31026014,18.4608135 7.09526232,17.6584306 7.45742309,17.0307921 L9.60202464,13.3132678 L5.31251922,13.3132678 C4.58763487,13.3132678 4,12.7256329 4,12.0007486 C4,11.2743674 4.58763487,10.6867325 5.31251922,10.6867325 L9.60202464,10.6867325 L7.45742309,6.96920825 C7.09526232,6.34156972 7.31026014,5.53918682 7.93771981,5.17671625 C8.56581451,4.8127957 9.36848556,5.0280831 9.73077279,5.65594079 L11.8751153,9.37301611 L14.0194579,5.65594079 C14.3817451,5.0280831 15.1844161,4.8127957 15.8122738,5.17508293 C16.4399705,5.53918682 16.6549683,6.34156972 16.2928076,6.96920825 L14.148206,10.6867325 L18.4377114,10.6867325 C19.1625958,10.6867325 19.7502307,11.2743674 19.7502307,11.9992518 C19.7502307,12.7256329 19.1625958,13.3132678 18.4377114,13.3132678 L14.148206,13.3132678 L16.2928076,17.0307921 Z"></path>
  </svg>
);

export const TopSVG = () => (
  <svg
    className="w-6 h-6 position-icon"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    aria-label="탑"
  >
    <path
      className="fill-white"
      d="M16.172 5H5v11.172l-3 3V2h17.172l-3 3z"
    ></path>
    <path d="M22 22H4.828l3-3H19V7.828l3-3V22zM15 9H9v6h6V9z"></path>
  </svg>
);

export const JungleSVG = () => (
  <svg
    className="w-6 h-6 position-icon"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    aria-label="정글"
  >
    <path
      className="fill-white"
      d="M5.094 0c9.247 11.173 8.508 20.655 6.983 24-3.853-4.623-6.261-6.368-6.983-6.662C4.708 10.788 2.204 7.652 1 6.903c4.752 1.734 6.903 5.512 7.385 7.184C9.09 8.532 6.485 2.381 5.094 0zM15.569 18.22v2.57l3.451-3.452c0-5.651 2.622-9.311 3.933-10.435-4.816 2.312-6.93 8.508-7.384 11.318zM15.569 12.04l-.803 2.248C14.509 12.49 13.482 10.38 13 9.552 14.605 5.763 17.522 1.605 18.78 0c-2.505 5.137-3.185 10.167-3.211 12.04z"
    ></path>
  </svg>
);

export const MidSVG = () => (
  <svg
    className="w-6 h-6 position-icon"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    aria-label="미드"
  >
    <path
      className="fill-white"
      d="M22 2h-2.906L2 19.094V22h3.063L22 5.062V2z"
    ></path>
    <path d="M5 13.478l-3 3V2h14.478l-3 3H5v8.478zM19 10.819l3-3V22H7.82l3-3H19v-8.181z"></path>
  </svg>
);

export const ADCSVG = () => (
  <svg
    className="w-6 h-6 position-icon"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    aria-label="원딜"
  >
    <path
      className="fill-white"
      d="M7.828 19H19V7.828l3-3V22H4.828l3-3z"
    ></path>
    <path d="M2 2h17.172l-3 3H5v11.172l-3 3V2zm7 13h6V9H9v6z"></path>
  </svg>
);

export const SupportSVG = () => (
  <svg
    className="w-6 h-6 position-icon"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    aria-label="서포터"
  >
    <path
      className="fill-white"
      d="M13.991 8.327l2.248-2.036H24c-2.553 2.327-4.69 2.86-5.44 2.836h-1.45l2.03 2.91-3.553 1.527-1.596-5.237zM14.644 19.745L12.758 9.127l-.798.946V22l2.684-2.255zM10.009 8.327L7.76 6.291H0c2.553 2.327 4.69 2.86 5.44 2.836h1.45l-2.03 2.91 3.553 1.527 1.596-5.237zM9.277 19.745l1.886-10.618.797.946V22l-2.683-2.255zM9.048 2L8.25 3.382 11.876 7.6l3.627-4.218L14.56 2H9.048z"
    ></path>
  </svg>
);

export function getPositionSVG(position: number) {
  switch (position) {
    case 0:
      return <AllSVG />;
    case 1:
      return <TopSVG />;
    case 2:
      return <JungleSVG />;
    case 3:
      return <MidSVG />;
    case 4:
      return <ADCSVG />;
    case 5:
      return <SupportSVG />;
    default:
      return null;
  }
}
