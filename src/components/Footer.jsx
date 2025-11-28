import { useContext, useState } from "react";
import { axiosInstance } from "../lib/axiosInstanace";
import Swal from "sweetalert2";
import { IndexContext } from "../context";
import { Link } from "react-router-dom";

const Footer = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const { siteSettings } = useContext(IndexContext);

  return (
    <>
      {/* Ultra-Minimal Footer */}
      <footer
        className="container-minimal"
        style={{
          paddingTop: "var(--space-2xl)",
          paddingBottom: "var(--space-xl)",
          borderTop: "1px solid var(--color-border)",
          marginTop: "var(--space-2xl)",
        }}
      >
        {/* Footer Grid - Ultra Minimal */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12 max-[640px]:gap-8">
          {/* Company Info */}
          <div>
            <Link to={"/"}>
              <img src="/logo.png" alt="logo" className="w-28 mb-6" />
            </Link>
            <p
              className="text-small bangla leading-relaxed mb-6"
              style={{
                color: "var(--color-text-secondary)",
                fontFamily: "Hind Siliguri, sans-serif",
              }}
            >
              {siteSettings?.siteDescription ||
                "বাংলাদেশের বিশ্বস্ত অনলাইন শপ। প্রিমিয়াম পণ্য এবং দ্রুত ডেলিভারি।"}
            </p>
            <ul className="flex space-x-4">
              {siteSettings?.socialMedia?.facebook && (
                <li>
                  <a
                    href={siteSettings?.socialMedia?.facebook}
                    target="_blank"
                    className="transition-colors"
                    style={{ color: "var(--color-text-muted)" }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-5 h-5 hover:opacity-70"
                      viewBox="0 0 49.652 49.652"
                      fill="currentColor"
                    >
                      <path d="M24.826 0C11.137 0 0 11.137 0 24.826c0 13.688 11.137 24.826 24.826 24.826 13.688 0 24.826-11.138 24.826-24.826C49.652 11.137 38.516 0 24.826 0zM31 25.7h-4.039v14.396h-5.985V25.7h-2.845v-5.088h2.845v-3.291c0-2.357 1.12-6.04 6.04-6.04l4.435.017v4.939h-3.219c-.524 0-1.269.262-1.269 1.386v2.99h4.56z" />
                    </svg>
                  </a>
                </li>
              )}
              {siteSettings?.socialMedia?.twitter && (
                <li>
                  <a
                    href={siteSettings?.socialMedia?.twitter}
                    target="_blank"
                    className="text-gray-400 hover:textColor transition-colors"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      x="0px"
                      y="0px"
                      className="w-6 h-6"
                      viewBox="0 0 50 50"
                    >
                      <path d="M 11 4 C 7.134 4 4 7.134 4 11 L 4 39 C 4 42.866 7.134 46 11 46 L 39 46 C 42.866 46 46 42.866 46 39 L 46 11 C 46 7.134 42.866 4 39 4 L 11 4 z M 13.085938 13 L 21.023438 13 L 26.660156 21.009766 L 33.5 13 L 36 13 L 27.789062 22.613281 L 37.914062 37 L 29.978516 37 L 23.4375 27.707031 L 15.5 37 L 13 37 L 22.308594 26.103516 L 13.085938 13 z M 16.914062 15 L 31.021484 35 L 34.085938 35 L 19.978516 15 L 16.914062 15 z"></path>
                    </svg>
                  </a>
                </li>
              )}
              {siteSettings?.socialMedia?.instagram && (
                <li>
                  <a
                    href={siteSettings?.socialMedia?.instagram}
                    target="_blank"
                    className="text-gray-400 hover:textColor transition-colors text-2xl "
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      x="0px"
                      y="0px"
                      className="w-6 h-6"
                      viewBox="0 0 48 48"
                    >
                      <radialGradient
                        id="yOrnnhliCrdS2gy~4tD8ma_Xy10Jcu1L2Su_gr1"
                        cx="19.38"
                        cy="42.035"
                        r="44.899"
                        gradientUnits="userSpaceOnUse"
                      >
                        <stop offset="0" stopColor="#fd5"></stop>
                        <stop offset=".328" stopColor="#ff543f"></stop>
                        <stop offset=".348" stopColor="#fc5245"></stop>
                        <stop offset=".504" stopColor="#e64771"></stop>
                        <stop offset=".643" stopColor="#d53e91"></stop>
                        <stop offset=".761" stopColor="#cc39a4"></stop>
                        <stop offset=".841" stopColor="#c837ab"></stop>
                      </radialGradient>
                      <path
                        fill="url(#yOrnnhliCrdS2gy~4tD8ma_Xy10Jcu1L2Su_gr1)"
                        d="M34.017,41.99l-20,0.019c-4.4,0.004-8.003-3.592-8.008-7.992l-0.019-20	c-0.004-4.4,3.592-8.003,7.992-8.008l20-0.019c4.4-0.004,8.003,3.592,8.008,7.992l0.019,20	C42.014,38.383,38.417,41.986,34.017,41.99z"
                      ></path>
                      <radialGradient
                        id="yOrnnhliCrdS2gy~4tD8mb_Xy10Jcu1L2Su_gr2"
                        cx="11.786"
                        cy="5.54"
                        r="29.813"
                        gradientTransform="matrix(1 0 0 .6663 0 1.849)"
                        gradientUnits="userSpaceOnUse"
                      >
                        <stop offset="0" stopColor="#4168c9"></stop>
                        <stop
                          offset=".999"
                          stopColor="#4168c9"
                          stopOpacity="0"
                        ></stop>
                      </radialGradient>
                      <path
                        fill="url(#yOrnnhliCrdS2gy~4tD8mb_Xy10Jcu1L2Su_gr2)"
                        d="M34.017,41.99l-20,0.019c-4.4,0.004-8.003-3.592-8.008-7.992l-0.019-20	c-0.004-4.4,3.592-8.003,7.992-8.008l20-0.019c4.4-0.004,8.003,3.592,8.008,7.992l0.019,20	C42.014,38.383,38.417,41.986,34.017,41.99z"
                      ></path>
                      <path
                        fill="#fff"
                        d="M24,31c-3.859,0-7-3.14-7-7s3.141-7,7-7s7,3.14,7,7S27.859,31,24,31z M24,19c-2.757,0-5,2.243-5,5	s2.243,5,5,5s5-2.243,5-5S26.757,19,24,19z"
                      ></path>
                      <circle cx="31.5" cy="16.5" r="1.5" fill="#fff"></circle>
                      <path
                        fill="#fff"
                        d="M30,37H18c-3.859,0-7-3.14-7-7V18c0-3.86,3.141-7,7-7h12c3.859,0,7,3.14,7,7v12	C37,33.86,33.859,37,30,37z M18,13c-2.757,0-5,2.243-5,5v12c0,2.757,2.243,5,5,5h12c2.757,0,5-2.243,5-5V18c0-2.757-2.243-5-5-5H18z"
                      ></path>
                    </svg>
                  </a>
                </li>
              )}

              {siteSettings?.socialMedia?.youtube && (
                <li>
                  <a href={siteSettings?.socialMedia?.youtube} target="_blank">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      x="0px"
                      y="0px"
                      className="w-6 h-6"
                      viewBox="0 0 48 48"
                    >
                      <linearGradient
                        id="~ZEDpqmbqU5aeVFMXpznxa_cs0F7pb81QnM_gr1"
                        x1=".439"
                        x2="44.632"
                        y1="-.097"
                        y2="45.101"
                        gradientUnits="userSpaceOnUse"
                      >
                        <stop offset="0" stopColor="#f52537"></stop>
                        <stop offset=".293" stopColor="#f32536"></stop>
                        <stop offset=".465" stopColor="#ea2434"></stop>
                        <stop offset=".605" stopColor="#dc2231"></stop>
                        <stop offset=".729" stopColor="#c8202c"></stop>
                        <stop offset=".841" stopColor="#ae1e25"></stop>
                        <stop offset=".944" stopColor="#8f1a1d"></stop>
                        <stop offset="1" stopColor="#7a1818"></stop>
                      </linearGradient>
                      <path
                        fill="url(#~ZEDpqmbqU5aeVFMXpznxa_cs0F7pb81QnM_gr1)"
                        d="M40,42H8c-1.105,0-2-0.895-2-2V8c0-1.105,0.895-2,2-2h32c1.105,0,2,0.895,2,2v32 C42,41.105,41.105,42,40,42z"
                      ></path>
                      <path
                        fill="#fff"
                        d="M14.878,8h1.788l1.227,4.596L19.029,8h1.805l-2.067,6.834v4.664h-1.777v-4.664L14.878,8z M23.064,10.946c-1.389,0-2.31,0.919-2.31,2.278v4.158c0,1.495,0.781,2.273,2.31,2.273c1.269,0,2.267-0.848,2.267-2.273v-4.158 C25.331,11.897,24.341,10.946,23.064,10.946z M23.723,17.311c0,0.462-0.236,0.802-0.66,0.802c-0.436,0-0.688-0.356-0.688-0.802 v-3.947c0-0.464,0.214-0.808,0.657-0.808c0.484,0,0.691,0.334,0.691,0.808C23.723,13.364,23.723,17.311,23.723,17.311z M29.594,11.017v6.438c-0.192,0.241-0.621,0.636-0.927,0.636c-0.336,0-0.42-0.231-0.42-0.571v-6.503H26.67v7.089 c0,0.838,0.256,1.515,1.101,1.515c0.477,0,1.14-0.248,1.822-1.059v0.936h1.577v-8.48H29.594z M32.329,28.221 c-0.556,0-0.672,0.391-0.672,0.947v0.818h1.327v-0.819C32.986,28.621,32.87,28.221,32.329,28.221z M26.49,28.271 c-0.104,0.053-0.207,0.135-0.31,0.246v5.034c0.123,0.132,0.241,0.226,0.356,0.284c0.245,0.124,0.602,0.133,0.768-0.083 c0.087-0.114,0.13-0.299,0.13-0.557v-4.17c0-0.273-0.053-0.479-0.16-0.621C27.092,28.164,26.754,28.138,26.49,28.271z M32.483,21.821c-3.233-0.22-13.738-0.22-16.966,0c-3.493,0.238-3.906,2.349-3.932,7.904c0.026,5.546,0.435,7.666,3.932,7.904 c3.228,0.22,13.733,0.22,16.966,0c3.493-0.238,3.906-2.35,3.932-7.904C36.389,24.18,35.98,22.06,32.483,21.821z M17.183,35.087 h-1.692v-9.361h-1.75v-1.589h5.192v1.589h-1.75v9.361H17.183z M23.199,35.087h-1.502v-0.891c-0.277,0.329-0.565,0.58-0.864,0.751 c-0.809,0.464-1.921,0.453-1.921-1.186V27.01h1.501v6.192c0,0.325,0.078,0.544,0.4,0.544c0.293,0,0.7-0.376,0.883-0.605V27.01 h1.502v8.077L23.199,35.087z M28.981,33.414c0,0.999-0.374,1.777-1.373,1.777c-0.55,0-1.008-0.201-1.426-0.724v0.621h-1.516v-10.95 h1.516v3.526c0.339-0.413,0.799-0.755,1.336-0.755c1.1,0,1.465,0.93,1.465,2.025v4.48H28.981z M34.531,31.239h-2.873v1.525 c0,0.606,0.052,1.13,0.655,1.13c0.634,0,0.672-0.427,0.672-1.13v-0.561h1.546v0.607c0,1.556-0.668,2.499-2.251,2.499 c-1.434,0-2.168-1.045-2.168-2.499v-3.626c0-1.402,0.926-2.376,2.281-2.376c1.441,0,2.137,0.916,2.137,2.376v2.056L34.531,31.239z"
                      ></path>
                      <path
                        d="M23.998,21.656c3.434,0,6.868,0.055,8.485,0.165c3.497,0.238,3.906,2.359,3.932,7.904 c-0.026,5.554-0.438,7.666-3.932,7.904c-1.616,0.11-5.051,0.165-8.485,0.165c-3.434,0-6.867-0.055-8.481-0.165 c-3.497-0.238-3.906-2.359-3.932-7.904c0.026-5.556,0.438-7.666,3.932-7.904C17.131,21.711,20.564,21.656,23.998,21.656 M23.998,21.156c-3.749,0-7.011,0.064-8.515,0.166c-4.157,0.284-4.373,3.226-4.398,8.401c0.024,5.18,0.241,8.122,4.398,8.406 c1.504,0.102,4.766,0.166,8.515,0.166s7.013-0.064,8.519-0.166c4.157-0.284,4.374-3.226,4.398-8.401 c-0.024-5.18-0.241-8.122-4.398-8.406C31.011,21.22,27.747,21.156,23.998,21.156L23.998,21.156z"
                        opacity=".07"
                      ></path>
                      <path
                        fill="#1b1464"
                        d="M20.834,8l-2.067,6.834v4.664h-1.777v-4.664L14.878,8h1.788l1.227,4.596L19.029,8H20.834 M23.064,10.946c1.277,0,2.267,0.951,2.267,2.278v4.158c0,1.425-0.998,2.273-2.267,2.273c-1.529,0-2.31-0.778-2.31-2.273v-4.158 C20.754,11.865,21.675,10.946,23.064,10.946 M23.063,18.113c0.425,0,0.66-0.34,0.66-0.802v-3.947c0-0.474-0.207-0.808-0.691-0.808 c-0.443,0-0.657,0.344-0.657,0.808v3.947C22.375,17.757,22.627,18.113,23.063,18.113 M31.171,11.017v8.48h-1.577v-0.936 c-0.683,0.811-1.346,1.059-1.822,1.059c-0.845,0-1.101-0.677-1.101-1.515v-7.089h1.577v6.503c0,0.34,0.083,0.571,0.42,0.571 c0.307,0,0.735-0.395,0.927-0.636v-6.438H31.171 M21.508,7.5h-0.674h-1.805h-0.391l-0.094,0.38l-0.67,2.708l-0.725-2.717 L17.05,7.5h-0.384h-1.788H14.2l0.2,0.648l2.091,6.762v4.589v0.5h0.5h1.777h0.5v-0.5v-4.59l2.046-6.763L21.508,7.5L21.508,7.5z M23.064,10.446c-1.655,0-2.81,1.142-2.81,2.778v4.158c0,1.788,0.998,2.773,2.81,2.773c1.629,0,2.767-1.14,2.767-2.773v-4.158 C25.831,11.64,24.641,10.446,23.064,10.446L23.064,10.446z M23.063,17.613c-0.163,0-0.188-0.189-0.188-0.302v-3.947 c0-0.308,0.106-0.308,0.157-0.308c0.103,0,0.191,0,0.191,0.308v3.947C23.223,17.511,23.169,17.613,23.063,17.613L23.063,17.613z M31.671,10.517h-0.5h-1.577h-0.5v0.5v6.249c-0.117,0.12-0.25,0.227-0.347,0.283c0-0.009,0-0.019,0-0.03v-6.503v-0.5h-0.5H26.67 h-0.5v0.5v7.089c0,1.818,1.12,2.015,1.601,2.015c0.289,0,0.768-0.071,1.322-0.435v0.312h0.5h1.577h0.5v-0.5v-8.48V10.517 L31.671,10.517z"
                        opacity=".05"
                      ></path>
                      <g opacity=".05">
                        <path d="M32.551,20.823c-1.517-0.103-4.794-0.167-8.553-0.167c-3.759,0-7.035,0.064-8.549,0.167 c-4.824,0.329-4.841,4.11-4.864,8.897c0.023,4.795,0.04,8.578,4.864,8.907c1.514,0.103,4.79,0.167,8.549,0.167 s7.036-0.064,8.553-0.167c4.824-0.329,4.841-4.11,4.864-8.897C37.392,24.936,37.374,21.152,32.551,20.823z M32.517,38.129 c-1.506,0.102-4.77,0.166-8.519,0.166c-3.749,0-7.011-0.064-8.515-0.166c-4.157-0.283-4.373-3.225-4.398-8.406 c0.024-5.175,0.241-8.117,4.398-8.401c1.504-0.102,4.766-0.166,8.515-0.166s7.013,0.064,8.519,0.166 c4.157,0.283,4.373,3.225,4.398,8.406C36.89,34.903,36.674,37.845,32.517,38.129z"></path>
                        <path d="M13.922,8.295l2.068,6.69v4.513v0.5v0.5h0.5h0.5h1.777h0.5h0.5v-0.5v-0.5v-1.943c0.071,1.94,1.286,3.099,3.297,3.099 c1.212,0,2.205-0.568,2.767-1.471c0.335,1.034,1.156,1.436,1.94,1.436c0.213,0,0.496-0.03,0.823-0.138v0.015h0.5h0.5h1.577h0.5 h0.5v-0.5v-0.5v-8.48v-0.5v-0.5h-0.5h-0.5h-1.577h-0.347h-0.5h-0.5H26.67h-0.5h-0.5v0.5v0.5v0.204 c-0.586-0.78-1.512-1.275-2.606-1.275c-0.749,0-1.413,0.215-1.95,0.585l0.678-2.241l0.195-0.645L22.181,7h-0.674h-0.674h-1.805 h-0.391h-0.391l-0.094,0.38l-0.094,0.38l-0.203,0.821l-0.224-0.838l-0.099-0.371L17.434,7h-0.384h-0.384h-1.788H14.2h-0.678 l0.2,0.648L13.922,8.295z M26.17,11.017v-0.5h0.5h1.577h0.5v0.5v6.503c0,0.011,0,0.021,0,0.03c0.097-0.057,0.23-0.163,0.347-0.283 v-6.25v-0.5h0.5h1.577h0.5v0.5v8.48v0.5h-0.5h-1.577h-0.5v-0.312c-0.555,0.364-1.034,0.435-1.323,0.435 c-0.481,0-1.601-0.196-1.601-2.015V11.017z M23.064,10.446c1.577,0,2.767,1.194,2.767,2.778v4.158 c0,1.633-1.138,2.773-2.767,2.773c-1.812,0-2.81-0.985-2.81-2.773v-4.158C20.254,11.588,21.409,10.446,23.064,10.446z M14.878,7.5 h1.788h0.384l0.099,0.371l0.725,2.717l0.67-2.708l0.094-0.38h0.391h1.805h0.674l-0.195,0.645l-2.046,6.763v4.59v0.5h-0.5h-1.777 h-0.5v-0.5V14.91L14.4,8.148L14.2,7.5H14.878z"></path>
                      </g>
                      <g>
                        <linearGradient
                          id="~ZEDpqmbqU5aeVFMXpznxb_cs0F7pb81QnM_gr2"
                          x1=".439"
                          x2="44.632"
                          y1="-.097"
                          y2="45.101"
                          gradientUnits="userSpaceOnUse"
                        >
                          <stop offset="0" stopColor="#f52537"></stop>
                          <stop offset=".293" stopColor="#f32536"></stop>
                          <stop offset=".465" stopColor="#ea2434"></stop>
                          <stop offset=".605" stopColor="#dc2231"></stop>
                          <stop offset=".729" stopColor="#c8202c"></stop>
                          <stop offset=".841" stopColor="#ae1e25"></stop>
                          <stop offset=".944" stopColor="#8f1a1d"></stop>
                          <stop offset="1" stopColor="#7a1818"></stop>
                        </linearGradient>
                        <path
                          fill="url(#~ZEDpqmbqU5aeVFMXpznxb_cs0F7pb81QnM_gr2)"
                          d="M40,42H8c-1.105,0-2-0.895-2-2V8c0-1.105,0.895-2,2-2h32c1.105,0,2,0.895,2,2v32 C42,41.105,41.105,42,40,42z"
                        ></path>
                        <path
                          fill="#fff"
                          d="M14.878,8h1.788l1.227,4.596L19.029,8h1.805l-2.067,6.834v4.664h-1.777v-4.664L14.878,8z M23.064,10.946c-1.389,0-2.31,0.919-2.31,2.278v4.158c0,1.495,0.781,2.273,2.31,2.273c1.269,0,2.267-0.848,2.267-2.273v-4.158 C25.331,11.897,24.341,10.946,23.064,10.946z M23.723,17.311c0,0.462-0.236,0.802-0.66,0.802c-0.436,0-0.688-0.356-0.688-0.802 v-3.947c0-0.464,0.214-0.808,0.657-0.808c0.484,0,0.691,0.334,0.691,0.808C23.723,13.364,23.723,17.311,23.723,17.311z M29.594,11.017v6.438c-0.192,0.241-0.621,0.636-0.927,0.636c-0.336,0-0.42-0.231-0.42-0.571v-6.503H26.67v7.089 c0,0.838,0.256,1.515,1.101,1.515c0.477,0,1.14-0.248,1.822-1.059v0.936h1.577v-8.48H29.594z M32.329,28.221 c-0.556,0-0.672,0.391-0.672,0.947v0.818h1.327v-0.819C32.986,28.621,32.87,28.221,32.329,28.221z M26.49,28.271 c-0.104,0.053-0.207,0.135-0.31,0.246v5.034c0.123,0.132,0.241,0.226,0.356,0.284c0.245,0.124,0.602,0.133,0.768-0.083 c0.087-0.114,0.13-0.299,0.13-0.557v-4.17c0-0.273-0.053-0.479-0.16-0.621C27.092,28.164,26.754,28.138,26.49,28.271z M32.483,21.821c-3.233-0.22-13.738-0.22-16.966,0c-3.493,0.238-3.906,2.349-3.932,7.904c0.026,5.546,0.435,7.666,3.932,7.904 c3.228,0.22,13.733,0.22,16.966,0c3.493-0.238,3.906-2.35,3.932-7.904C36.389,24.18,35.98,22.06,32.483,21.821z M17.183,35.087 h-1.692v-9.361h-1.75v-1.589h5.192v1.589h-1.75v9.361H17.183z M23.199,35.087h-1.502v-0.891c-0.277,0.329-0.565,0.58-0.864,0.751 c-0.809,0.464-1.921,0.453-1.921-1.186V27.01h1.501v6.192c0,0.325,0.078,0.544,0.4,0.544c0.293,0,0.7-0.376,0.883-0.605V27.01 h1.502v8.077L23.199,35.087z M28.981,33.414c0,0.999-0.374,1.777-1.373,1.777c-0.55,0-1.008-0.201-1.426-0.724v0.621h-1.516v-10.95 h1.516v3.526c0.339-0.413,0.799-0.755,1.336-0.755c1.1,0,1.465,0.93,1.465,2.025v4.48H28.981z M34.531,31.239h-2.873v1.525 c0,0.606,0.052,1.13,0.655,1.13c0.634,0,0.672-0.427,0.672-1.13v-0.561h1.546v0.607c0,1.556-0.668,2.499-2.251,2.499 c-1.434,0-2.168-1.045-2.168-2.499v-3.626c0-1.402,0.926-2.376,2.281-2.376c1.441,0,2.137,0.916,2.137,2.376v2.056L34.531,31.239z"
                        ></path>
                        <path
                          d="M23.998,21.656c3.434,0,6.868,0.055,8.485,0.165c3.497,0.238,3.906,2.359,3.932,7.904 c-0.026,5.554-0.438,7.666-3.932,7.904c-1.616,0.11-5.051,0.165-8.485,0.165c-3.434,0-6.867-0.055-8.481-0.165 c-3.497-0.238-3.906-2.359-3.932-7.904c0.026-5.556,0.438-7.666,3.932-7.904C17.131,21.711,20.564,21.656,23.998,21.656 M23.998,21.156c-3.749,0-7.011,0.064-8.515,0.166c-4.157,0.284-4.373,3.226-4.398,8.401c0.024,5.18,0.241,8.122,4.398,8.406 c1.504,0.102,4.766,0.166,8.515,0.166s7.013-0.064,8.519-0.166c4.157-0.284,4.374-3.226,4.398-8.401 c-0.024-5.18-0.241-8.122-4.398-8.406C31.011,21.22,27.747,21.156,23.998,21.156L23.998,21.156z"
                          opacity=".07"
                        ></path>
                        <path
                          fill="#1b1464"
                          d="M20.834,8l-2.067,6.834v4.664h-1.777v-4.664L14.878,8h1.788l1.227,4.596L19.029,8H20.834 M23.064,10.946c1.277,0,2.267,0.951,2.267,2.278v4.158c0,1.425-0.998,2.273-2.267,2.273c-1.529,0-2.31-0.778-2.31-2.273v-4.158 C20.754,11.865,21.675,10.946,23.064,10.946 M23.063,18.113c0.425,0,0.66-0.34,0.66-0.802v-3.947c0-0.474-0.207-0.808-0.691-0.808 c-0.443,0-0.657,0.344-0.657,0.808v3.947C22.375,17.757,22.627,18.113,23.063,18.113 M31.171,11.017v8.48h-1.577v-0.936 c-0.683,0.811-1.346,1.059-1.822,1.059c-0.845,0-1.101-0.677-1.101-1.515v-7.089h1.577v6.503c0,0.34,0.083,0.571,0.42,0.571 c0.307,0,0.735-0.395,0.927-0.636v-6.438H31.171 M21.508,7.5h-0.674h-1.805h-0.391l-0.094,0.38l-0.67,2.708l-0.725-2.717 L17.05,7.5h-0.384h-1.788H14.2l0.2,0.648l2.091,6.762v4.589v0.5h0.5h1.777h0.5v-0.5v-4.59l2.046-6.763L21.508,7.5L21.508,7.5z M23.064,10.446c-1.655,0-2.81,1.142-2.81,2.778v4.158c0,1.788,0.998,2.773,2.81,2.773c1.629,0,2.767-1.14,2.767-2.773v-4.158 C25.831,11.64,24.641,10.446,23.064,10.446L23.064,10.446z M23.063,17.613c-0.163,0-0.188-0.189-0.188-0.302v-3.947 c0-0.308,0.106-0.308,0.157-0.308c0.103,0,0.191,0,0.191,0.308v3.947C23.223,17.511,23.169,17.613,23.063,17.613L23.063,17.613z M31.671,10.517h-0.5h-1.577h-0.5v0.5v6.249c-0.117,0.12-0.25,0.227-0.347,0.283c0-0.009,0-0.019,0-0.03v-6.503v-0.5h-0.5H26.67 h-0.5v0.5v7.089c0,1.818,1.12,2.015,1.601,2.015c0.289,0,0.768-0.071,1.322-0.435v0.312h0.5h1.577h0.5v-0.5v-8.48V10.517 L31.671,10.517z"
                          opacity=".05"
                        ></path>
                        <g opacity=".05">
                          <path d="M32.551,20.823c-1.517-0.103-4.794-0.167-8.553-0.167c-3.759,0-7.035,0.064-8.549,0.167 c-4.824,0.329-4.841,4.11-4.864,8.897c0.023,4.795,0.04,8.578,4.864,8.907c1.514,0.103,4.79,0.167,8.549,0.167 s7.036-0.064,8.553-0.167c4.824-0.329,4.841-4.11,4.864-8.897C37.392,24.936,37.374,21.152,32.551,20.823z M32.517,38.129 c-1.506,0.102-4.77,0.166-8.519,0.166c-3.749,0-7.011-0.064-8.515-0.166c-4.157-0.283-4.373-3.225-4.398-8.406 c0.024-5.175,0.241-8.117,4.398-8.401c1.504-0.102,4.766-0.166,8.515-0.166s7.013,0.064,8.519,0.166 c4.157,0.283,4.373,3.225,4.398,8.406C36.89,34.903,36.674,37.845,32.517,38.129z"></path>
                          <path d="M13.922,8.295l2.068,6.69v4.513v0.5v0.5h0.5h0.5h1.777h0.5h0.5v-0.5v-0.5v-1.943c0.071,1.94,1.286,3.099,3.297,3.099 c1.212,0,2.205-0.568,2.767-1.471c0.335,1.034,1.156,1.436,1.94,1.436c0.213,0,0.496-0.03,0.823-0.138v0.015h0.5h0.5h1.577h0.5 h0.5v-0.5v-0.5v-8.48v-0.5v-0.5h-0.5h-0.5h-1.577h-0.347h-0.5h-0.5H26.67h-0.5h-0.5v0.5v0.5v0.204 c-0.586-0.78-1.512-1.275-2.606-1.275c-0.749,0-1.413,0.215-1.95,0.585l0.678-2.241l0.195-0.645L22.181,7h-0.674h-0.674h-1.805 h-0.391h-0.391l-0.094,0.38l-0.094,0.38l-0.203,0.821l-0.224-0.838l-0.099-0.371L17.434,7h-0.384h-0.384h-1.788H14.2h-0.678 l0.2,0.648L13.922,8.295z M26.17,11.017v-0.5h0.5h1.577h0.5v0.5v6.503c0,0.011,0,0.021,0,0.03c0.097-0.057,0.23-0.163,0.347-0.283 v-6.25v-0.5h0.5h1.577h0.5v0.5v8.48v0.5h-0.5h-1.577h-0.5v-0.312c-0.555,0.364-1.034,0.435-1.323,0.435 c-0.481,0-1.601-0.196-1.601-2.015V11.017z M23.064,10.446c1.577,0,2.767,1.194,2.767,2.778v4.158 c0,1.633-1.138,2.773-2.767,2.773c-1.812,0-2.81-0.985-2.81-2.773v-4.158C20.254,11.588,21.409,10.446,23.064,10.446z M14.878,7.5 h1.788h0.384l0.099,0.371l0.725,2.717l0.67-2.708l0.094-0.38h0.391h1.805h0.674l-0.195,0.645l-2.046,6.763v4.59v0.5h-0.5h-1.777 h-0.5v-0.5V14.91L14.4,8.148L14.2,7.5H14.878z"></path>
                        </g>
                      </g>
                    </svg>
                  </a>
                </li>
              )}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4
              className="heading-3 bangla mb-6"
              style={{
                color: "var(--color-text-primary)",
                fontFamily: "Hind Siliguri, sans-serif",
              }}
            >
              দ্রুত লিঙ্ক
            </h4>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/"
                  className="text-small transition-colors bangla-text"
                  style={{
                    color: "var(--color-text-secondary)",
                    fontFamily: "Hind Siliguri, sans-serif",
                  }}
                >
                  হোম
                </Link>
              </li>
              <li>
                <Link
                  to="/product-category"
                  className="text-small transition-colors bangla-text"
                  style={{
                    color: "var(--color-text-secondary)",
                    fontFamily: "Hind Siliguri, sans-serif",
                  }}
                >
                  শপ
                </Link>
              </li>
              <li>
                <Link
                  to="/product-category"
                  className="text-small transition-colors bangla-text"
                  style={{
                    color: "var(--color-text-secondary)",
                    fontFamily: "Hind Siliguri, sans-serif",
                  }}
                >
                  ক্যাটাগরি
                </Link>
              </li>
              <li>
                <Link
                  to="/product-category"
                  className="text-small transition-colors bangla-text"
                  style={{
                    color: "var(--color-text-secondary)",
                    fontFamily: "Hind Siliguri, sans-serif",
                  }}
                >
                  অফার
                </Link>
              </li>
              <li>
                <Link
                  to="/product-category"
                  className="text-small transition-colors bangla-text"
                  style={{
                    color: "var(--color-text-secondary)",
                    fontFamily: "Hind Siliguri, sans-serif",
                  }}
                >
                  নতুন আগমন
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4
              className="heading-3 bangla mb-6"
              style={{
                color: "var(--color-text-primary)",
                fontFamily: "Hind Siliguri, sans-serif",
              }}
            >
              গ্রাহক সেবা
            </h4>
            <ul className="space-y-3">
              <li>
                <Link
                  to={"/contact-us"}
                  className="text-small transition-colors bangla-text"
                  style={{
                    color: "var(--color-text-secondary)",
                    fontFamily: "Hind Siliguri, sans-serif",
                  }}
                >
                  যোগাযোগ
                </Link>
              </li>
              <li>
                <Link
                  to="/faq"
                  className="text-small transition-colors bangla-text"
                  style={{
                    color: "var(--color-text-secondary)",
                    fontFamily: "Hind Siliguri, sans-serif",
                  }}
                >
                  সাধারণ প্রশ্ন
                </Link>
              </li>
              <li>
                <Link
                  to="/delivery-policy"
                  className="text-small transition-colors bangla-text"
                  style={{
                    color: "var(--color-text-secondary)",
                    fontFamily: "Hind Siliguri, sans-serif",
                  }}
                >
                  ডেলিভারি নীতি
                </Link>
              </li>
              <li>
                <Link
                  to="/return-policy"
                  className="text-small transition-colors bangla-text"
                  style={{
                    color: "var(--color-text-secondary)",
                    fontFamily: "Hind Siliguri, sans-serif",
                  }}
                >
                  রিটার্ন পলিসি
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4
              className="heading-3 bangla mb-6"
              style={{
                color: "var(--color-text-primary)",
                fontFamily: "Hind Siliguri, sans-serif",
              }}
            >
              যোগাযোগের তথ্য
            </h4>
            <ul className="space-y-3">
              <li
                className="text-small"
                style={{ color: "var(--color-text-secondary)" }}
              >
                <span
                  className="bangla-text"
                  style={{ fontFamily: "Hind Siliguri, sans-serif" }}
                >
                  ফোন:
                </span>{" "}
                {siteSettings?.contactInfo?.phone || "+880 1234-567890"}
              </li>
              <li
                className="text-small"
                style={{ color: "var(--color-text-secondary)" }}
              >
                <span
                  className="bangla-text"
                  style={{ fontFamily: "Hind Siliguri, sans-serif" }}
                >
                  ইমেইল:
                </span>{" "}
                {siteSettings?.contactInfo?.email || "info@buynestonline.com"}
              </li>
              <li
                className="text-small bangla-text"
                style={{
                  color: "var(--color-text-secondary)",
                  fontFamily: "Hind Siliguri, sans-serif",
                }}
              >
                {siteSettings?.contactInfo?.address || "ঢাকা, বাংলাদেশ"}
              </li>
            </ul>
          </div>
        </div>

        {/* Footer Bottom - Ultra Minimal */}
        <div
          className="flex flex-col md:flex-row items-center justify-between gap-4 pt-8"
          style={{ borderTop: "1px solid var(--color-border)" }}
        >
          <p
            className="text-small bangla-text text-center md:text-left"
            style={{
              color: "var(--color-text-muted)",
              fontFamily: "Hind Siliguri, sans-serif",
            }}
          >
            © ২০২৫ {siteSettings?.siteName || "বাইনেস্ট"}। সর্বস্বত্ব সংরক্ষিত।
          </p>
          <div className="flex items-center gap-3">
            <span
              className="text-small bangla-text"
              style={{
                color: "var(--color-text-muted)",
                fontFamily: "Hind Siliguri, sans-serif",
              }}
            >
              পেমেন্ট পদ্ধতি:
            </span>
            <div className="flex items-center gap-2">
              {/* bKash Badge */}
              <div
                className="px-3 py-1 rounded-md font-bold text-xs"
                style={{
                  backgroundColor: "#E2136E",
                  color: "white",
                  border: "1px solid #E2136E",
                }}
              >
                bKash
              </div>
              {/* Nagad Badge */}
              <div
                className="px-3 py-1 rounded-md font-bold text-xs"
                style={{
                  backgroundColor: "#F7941D",
                  color: "white",
                  border: "1px solid #F7941D",
                }}
              >
                Nagad
              </div>
              {/* COD Badge */}
              <div
                className="px-3 py-1 rounded-md font-bold text-xs"
                style={{
                  backgroundColor: "#016737",
                  color: "white",
                  border: "1px solid #016737",
                }}
              >
                COD
              </div>
            </div>
          </div>
        </div>

        {/* Spacer for mobile bottom navbar */}
        <div className="h-16 min-[640px]:hidden" />
      </footer>
    </>
  );
};

export default Footer;
