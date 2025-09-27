import { PhoneIcon } from "@heroicons/react/16/solid";
import { FaFacebook, FaInstagram } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";
import { GrYoutube } from "react-icons/gr";
import { RiTelegram2Fill } from "react-icons/ri";
import { SiTelegram } from "react-icons/si";

export default function Footer() {
  return (
    <div className="bg-base-300">
      <footer className="footer sm:footer-horizontal text-base-content py-10 max-w-6xl mx-auto flex flex-wrap justify-between">
        <nav>
          <h6 className="footer-title">Navigatsiya</h6>
          <a className="link link-hover">Bosh sahifa</a>
          <a className="link link-hover">Izohlar</a>
          <a className="link link-hover">Admin panel</a>
          <a className="link link-hover">Haqida</a>
        </nav>

        <nav>
          <h6 className="footer-title">Bog'lanish</h6>
          <a className="link link-hover flex items-center gap-1">
            <RiTelegram2Fill className="w-4 h-4" /> Chatga yozish
          </a>
          <a className="link link-hover flex items-center gap-1" href="tel:+998901234567">
            <PhoneIcon className="w-4 h-4" />
            (90) 1234567
          </a>
        </nav>

        <div>
          <a className="link link-hover flex gap-1 mb-4" href="https://maps.app.goo.gl/rgwaKGch5jPKVe286">
            <FaLocationDot className="mt-1" /> Farg'ona vil, Rishton tumani, Lorem MFY <br /> 1-son Politexnikum
          </a>
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1784.0998839823174!2d71.27823339017144!3d40.34943418876901!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x38bbab1df919f7f7%3A0x6cf85197ab5f9fa2!2sRishton.%201-sonli%20Kasb%20hunar%20kolleji!5e0!3m2!1suz!2s!4v1764845406582!5m2!1suz!2s"
            width="280"
            className="rounded-lg"
            height="190"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>

        <nav>
          <h6 className="footer-title">Ijtimoiy tarmoqlar</h6>
          <div className="grid grid-flow-col gap-2">
            <a href="#" className="bg-white p-1">
              <SiTelegram className="w-5 h-5" />
            </a>
            <a href="#" className="bg-white p-1">
              <FaInstagram className="w-5 h-5" />
            </a>
            <a href="#" className="bg-white p-1">
              <GrYoutube className="w-5 h-5" />
            </a>
          </div>
        </nav>
      </footer>
    </div>
  );
}
