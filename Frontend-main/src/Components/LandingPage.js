import React, { useEffect } from "react";
import { Container, Typography, Grid, Divider } from "@mui/material";
import expenses from "../img/expenses.png";
import LandingNavBar from "./LandingNavBar";
import DonationBox from "./DonationBox";
import axios from "axios";
import { useRecoilState } from "recoil";
import { currentUserAtom } from "../App";
import BookingCalendar from "./BookingCalendar";
import TodaysProceeding from "./TodaysProceeding";
import TodaysProceedingAdmin from "./TodaysProceedingAdmin";
import Copyright from "./Copyright";
import LandingNavBarMobile from "./LandingNavBarMobile";
import useBreakpoints from "../Context/useBreakPoints";
import qr from "../img/upiqr.png";

export default function LandingPage() {
  const { isSm } = useBreakpoints();

  const [currentUser, setCurrentUser] = useRecoilState(currentUserAtom);

  useEffect(() => {
    if (currentUser?.auth_token) {
      const options = {
        method: "GET",
        url: "https://api.kiruthirupathi.org/user/me",
        headers: { Authorization: currentUser.auth_token },
      };

      axios
        .request(options)
        .then((response) => {
          const updatedUser = {
            ...currentUser,
            data: response.data,
          };
          setCurrentUser(updatedUser);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, []);

  const bannerStyles = {
    color: "white",
    marginBottom: "1rem",
    fontWeight: "bold",
    backgroundImage:
      "linear-gradient(to right, rgb(38 179 251), rgb(249 178 0))",
    width: "100%",
  };
  const textStyles = {
    color: "rgb(38 179 251)",
    marginBottom: "1rem",
    fontWeight: "bold",
  };
  const centerStyles = {
    color: "rgb(38 179 251)",
    marginBottom: "1rem",
    fontWeight: "bold",
    textAlign: "center",
  };

  const secondaryTextStyles = {
    color: "#000000",
    lineHeight: "1.6",
  };

  const containerStyles = {
    height: "100%",
    backgroundColor: "#fff",
  };

  return (
    <div
      style={{
        overflowX: "hidden",
      }}
    >
      {isSm ? <LandingNavBar /> : <LandingNavBarMobile />}

      <div style={containerStyles}>
        <div
          style={{
            backgroundImage:
              "linear-gradient(to right, rgb(38 179 251), rgb(249 178 0))",
            width: `100%`,
            paddingBottom: "50px",
            paddingTop: "50px",
          }}
        >
          {isSm && (
            <>
              <Typography
                variant="h4"
                align="center"
                style={bannerStyles}
                gutterBottom
              >
                The restoration work of the temple is in progress. Donate
                generously for this noble cause.
              </Typography>
              <Typography
                variant="h4"
                align="center"
                style={bannerStyles}
                paragraph
              >
                ದೇವಾಸ್ಥಾನದ ಜೀರ್ಣೋದ್ಧಾರದ ಕಾಮಗಾರಿ ಪ್ರಗತಿಯಲ್ಲಿದೆ . ಉದಾರವಾಗಿ ಧನಸಹಾಯ
                ಮಾಡಿ ಸಹಕರಿಸಿರಿ.
              </Typography>
            </>
          )}
          <DonationBox />
        </div>
        <div>
          <BookingCalendar showViewList={false}/>
        </div>
        {currentUser?.data?.roles?.isAdmin ? (
          <TodaysProceedingAdmin />
        ) : (
          <TodaysProceeding />
        )}

        <Container sx={{ mt: 4 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={11}>
              <Typography
                variant={"h6"}
                style={{ textAlign: "center" }}
                gutterBottom
              >
                Name : Shri Lakshmi Venkataramana Devastana Jeernodhara
                Samithi,Durga <br />
                A/C : Checking account # : 120002732041 IFSC : CNRB0000609
              </Typography>
            </Grid>
            <Grid item xs={12} sm={1} style={{ textAlign: "center" }}>
              <img
                src={qr}
                style={{
                  width: "100px",
                  height: "auto",
                }}
                alt="QR Code"
              />
            </Grid>
          </Grid>

          <Grid container spacing={4}>
            <Grid item xs={12}>
              <Typography variant="h5" style={textStyles} gutterBottom>
                Myth of Place
              </Typography>
              <Typography variant="body1" style={secondaryTextStyles} paragraph>
                The founder, Narayana Bhat Marathe, was an ardent devotee of
                Lord Venkataramana. He used to frequently travel on foot from
                Durga village, Karkala taluk, to Tirupati. His unwavering
                devotion and spiritual connection to Lord Venkataramana inspired
                him to establish a Venkataramana temple in the western ghats
                tropical region, realizing his dream in the peaceful atmosphere
                of Durga village. The original idol of this deity is about 2
                feet tall and resembles the Tirumala Venkataramana idol, and
                hence this sacred site is called Kiru (Mini in Kannada)
                Tirupati.
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h5" style={textStyles} gutterBottom>
                ಸ್ಥಳ ಪುರಾಣ
              </Typography>
              <Typography variant="body1" style={secondaryTextStyles} paragraph>
                ಸ್ಥಾಪಕರಾದ ನಾರಾಯಣ ಭಟ್ ಮರಾಠೇ ಯವರು ವೆಂಕಟರಮಣನ ಮಹಾ ಭಕ್ತರಾಗಿದ್ದರು .
                ಅವರು ಕಾಲ್ನಡಿಗೆಯಲ್ಲಿ ದುರ್ಗ ಗ್ರಾಮ , ಕಾರ್ಕಳ ತಾಲೂಕಿನಿಂದ ತಿರುಪತಿಗೆ
                ದರ್ಶನ ಮಾಡಲು ಆಗಾಗ್ಯೆ ಪ್ರಯಾಣ ಮಾಡುತಿದ್ದರು. ಅವರಿಗೆ ಮಲೆನಾಡಿನಲ್ಲಿ
                ವೆಂಕಟರಮಣ ದೇವಾಲಯ ಸ್ಥಾಪಿಸುವ ಆಲೋಚನೆ ಬಂದು, ಇಲ್ಲಿ ದುರ್ಗಾ ಗ್ರಾಮದ
                ಪ್ರಶಾಂತ ವಾತಾವರಣದಲ್ಲಿ ಅವರ ಕನಸನ್ನು ನನಸು ಮಾಡಿದರು ಎಂದು ಪ್ರತೀತಿ ಇದೆ.
                ಈ ದೇವರ ಮೂಲ ವಿಗ್ರಹವು ಸುಮಾರು 2 ಅಡಿ ಎತ್ತರವಿದ್ದು , ತಿರುಮಲ ವೆಂಕಟರಮಣ
                ವಿಗ್ರಹವನ್ನು ಹೋಲುತ್ತದೆ. ಈ ಕಾರಣಗಳಿಂದ ಇಲ್ಲಿಯ ಕ್ಷೇತ್ರ ಕಿರು ತಿರುಪತಿ
                ಎಂದು ಕರೆಯಲ್ಪಡುತ್ತದೆ .
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="h5" style={textStyles} gutterBottom>
                About Temple
              </Typography>
              <Typography
                variant="body1"
                style={secondaryTextStyles}
                gutterBottom
              >
                Known as Parashuraama Srishti, this tropical paradise is the
                divine creation of the seventh incarnation of Lord Maha Vishnu.
                Nestled in the serene village of Durga in the Karkala taluk of
                the Udupi district, amidst the enchanting Western Ghats, this
                region is a tranquil haven rich in natural beauty. In 1864, Shri
                Narayana Bhat Marathe established a magnificent temple in
                Phundaje, which has since been a beacon of grace and
                magnificence, drawing devoted followers from across Udupi and
                Mangaluru districts, including Durga, Melebettu, Maala,
                Phandije, and Mundaje. It is believed that the consecration i.e
                Prana Prathista of Sri Lakshmi Venkataramana Temple and the
                re-consecration of Sri Venkataramana of Karkala had been
                performed on same day. On most otherwise, the idol of Lord
                Venkataramana is movable (Chara), whereas this idol is immovable
                (Stira) like Lord Venkataramana at Thirupathi, and hence also
                sometime referred as Kiru (short) Thirupathi Laxmi
                Venkataramana. The founder had registered title of all 300+
                acres of fertile land in Durga, Melabettu, Mala, Phandije and
                Mundaje to the name of presiding deity. The descendants of the
                founder were in the vicinity of the temple, administered it,
                worked as care takers and custodians. Since this temple is in
                its own property, it does belong to all the atheists. The
                fertile land in these villages and towns, provided substantial
                income for its daily operations. This abundance was celebrated
                through Trikaala Puja, grand annual festivals accompanied by
                melodious musical performances, and the noble tradition of Anna
                Daana. The chariot which was built earlier for the Sri Deva
                Utsavam has been donated to the Karkala Sri Ananta Shayana
                temple for some reason. However, the passage of land reform laws
                led to the transfer of land ownership to lessees, leaving the
                temple with a mere 26 cents of land under its name. This
                dramatic reduction in income severely impacted the temple's
                activities and maintenance schedule. While significant repairs
                were undertaken in 1994-95, including the installation of the
                Kalash (pinnacle) of Sri Devala on May 14, 1995, the temple now
                stands in dire need of renovation, as two decades have taken
                their toll. Recognizing the temple's historic significance and
                potential to serve as a spiritual powerhouse, the descendants of
                the founder, along with devoted Okkalu and Bhakta Bhajaka
                Vrinda, embarked on a mission to restore its former glory.
                Following a comprehensive Ashtamangala assessment in 2019, all
                required propitiatory rituals have been meticulously performed
                by 2023 to pave the way for restoration. An impressive sum of Rs
                10 lakhs has been collected and dedicated to this noble cause. A
                dedicated rehabilitation and Brahmakalasha committee has been
                formed, which engaged Vaastu experts to design blueprints for
                the reconstruction of the sanctum sanctorum, Daiva’s shrine,
                Theertha pond, and Annagriha (dining hall and kitchen), as well
                as the construction of a connecting road to the temple. The
                estimated cost for these endeavors is approximately Rs 2 crore
                60 lakhs. The committee has already completed the construction
                of the connecting road at a cost of Rs 9 lakhs. Now, with
                humility and a heartfelt appeal, the restoration committee
                earnestly requests generous contributions from the kind-hearted
                Bhajaka devotees to support the temple's reconstruction and the
                grand Brahmakalasha ritual for the installation of the presiding
                deity. The temple belongs to all theists including the
                descendants of the founder, former lessees, general public.
                Donations in the form of funds, materials, or timber are
                wholeheartedly welcomed. May the divine grace of Sri Lakshmi
                Venkataramana Temple shower blessings upon all who contribute to
                this sacred endeavor.
              </Typography>
              <Typography variant="body1" style={secondaryTextStyles} paragraph>
                ಭಗವಾನ್ ಮಹಾವಿಷ್ಣುವಿನ ಏಳನೇಯ ಅವತಾರವಾದ ಪರಶುರಾಮ ಸೃಷ್ಟಿಎಂದೇ ಖ್ಯಾತವಾದ,
                ದೇವಾಲಯಗಳಿಂದ ಪುನೀತವಾದ ಮಲೆನಾಡಿನ ಈ ಪ್ರದೇಶ ಕಾರ್ಕಳ ತಾಲೂಕಿನ ದುರ್ಗ
                ಗ್ರಾಮದಲ್ಲಿದ್ದು ನೈಸರ್ಗಿಕ ಸಿರಿ ಸಂಪತ್ತಿನಿಂದ ಕೂಡಿದ ಶಾಂತ
                ಪ್ರದೇಶವಾಗಿದೆ. ಪುಂಡಾಜೆ ಎಂಬಲ್ಲಿ 1864 ರಲ್ಲಿ ಶ್ರೀ ನಾರಾಯಣ ಭಟ್ ಮರಾಠೇ
                ಎಂಬವರಿಂದ ಸ್ಥಾಪಿಸಲ್ಪಟ್ಟ ಈ ದೇವಾಲಯವು ತನ್ನ ಮಹಿಮಾತಿಶಯಗಳಿಂದ ತನ್ನ ಆರಾಧಕ
                ಭಕ್ತರನ್ನು ಅನುಗ್ರಹಿಸುತ್ತಾ ಪ್ರಸಿದ್ದಿ ಪಡೆದಿದೆ. ಶ್ರೀ ಲಕ್ಷ್ಮಿ
                ವೆಂಕಟರಮಣ ದೇವರ ಪ್ರತಿಷ್ಠಾಪನೆಯು ಹಾಗು ಕಾರ್ಕಳ ಶ್ರೀ ವೆಂಕಟರಮಣ ದೇವರ
                ಪುನರ್ ಪ್ರತಿಷ್ಠಾಪನೆಯು ಒಂದೇ ದಿನ ಅವಧೂತ ಅಪ್ಪಾ ಶಾಸ್ತ್ರೀ ದಾಮ್ಲೆ ಯವರು
                ನೆರವೇರಿಸಿದ್ದರೆಂದು ಪ್ರತೀತಿ ಇದೆ. ಬೇರೆ ಬಹುತೇಕ ಕಡೆ ಶ್ರೀ ವೆಂಕಟರಮಣ
                ದೇವರ ವಿಗ್ರಹವು ಚರವಾಗಿದ್ದು, ಇಲ್ಲಿ ಬಹಳ ಅಪರೂಪವಾಗಿ ಸ್ಥಿರವಾದ
                ಶಿಲಾಮೂರ್ತಿಯು ತುಂಬಾ ವಿಶೇಷ ಪ್ರಾಧಾನ್ಯತೆ ಪಡೆದು , ಕಿರು ತಿರುಪತಿ ಎಂದು
                ಪ್ರಸಿದ್ಧಿ ಪಡೆದಿದೆ. ಸ್ಥಾಪಕರು ದುರ್ಗ, ಮೆಲೆಬೆಟ್ಟು , ಮಾಳ , ಫಂಡಿಜೆ ,
                ಮುಂಡಾಜೆಗಳಲ್ಲಿ ಇದ್ದ ಎಲ್ಲಾ ಸುಮಾರು 300 ಎಕ್ರೆ ಆಸ್ತಿಗಳನ್ನು ಶ್ರೀ ದೇವರ
                ಹೆಸರಿಗೆ ನೋಂದಾಯಿಸಿದ್ದರು. ಸ್ಥಾಪಕರ ವಂಶಸ್ಥರು ದೇವಸ್ತಾನದ ಪರಿಸರದಲ್ಲಿ
                ಇದ್ದು ಆಢಳಿತದ ಹೊಣೆಯನ್ನು ನಿರ್ವಹಿಸುತ್ತಿದ್ದರು. ಸಂಸ್ಥಾಪಕರ
                ವಂಶಸ್ಥರಾದ್ದರಿಂದ ದೇವಳದ ಆಢಳಿತ ಮರಾಠೇ ವಂಶಸ್ಥರಲ್ಲಿ ಹಿರಿಯ ವ್ಯಕ್ತಿಗೆ
                ಪಾರಂಪರ್ಯವಾಗಿ ಬಂದಿದ್ದು , ದೇವಳದ ಸುಪರ್ದಿಕೆ ಅಥವಾ ಕೇರ್ ಟೇಕರ್
                ಆಗಿರುತ್ತಾರೆ. ಈ ದೇವಳವು ತನ್ನದೇ ಆಸ್ತಿಯಲ್ಲಿ ಇರುವುದರಿಂದ, ಇದು ಯಾವುದೇ
                ಒಂದು ಕುಟುಂಬದ ಕುಲ ದೇವರು ಅಥವಾ ಮನೆ ದೇವರು ಅಲ್ಲವಾಗಿದ್ದು , ಎಲ್ಲಾ
                ಆಸ್ತಿಕ ಬಂಧುಗಳಿಗೆ ಸೇರಿದೆ. ಶ್ರೀ ದೇವರ ಆಸ್ತಿಗಳಿಂದ ಬಂದ ಆದಾಯದಿಂದ
                ದೇವಾಲಯದ ನಿತ್ಯದ ಆಗುಹೋಗುಗಳಿಗೆ ಸಾಕಷ್ಟು ಆದಾಯ ಬರುತ್ತಿತು . ಹಾಗಾಗಿ
                ದೇವಸ್ಥಾನದಲ್ಲಿ ತ್ರಿಕಾಲ ಪೂಜೆ , ವಾದ್ಯ ಸಮೇತ ಉತ್ಸವ , ಅನ್ನ
                ಸಂತರ್ಪಣೆಗಳಿಂದ ವೈಭವೋಪೇತವಾಗಿ ನಡೆಯುತ್ತಿದ್ದವು. ಈ ಹಿಂದೆ ಶ್ರೀ ದೇವರ
                ಉತ್ಸವಕ್ಕೆ ನಿರ್ಮಿಸಲಾಗಿದ್ದ ರಥವನ್ನು ಕಾರಣಾಂತರದಿಂದ ಕಾರ್ಕಳ ಶ್ರೀ ಅನಂತ
                ಶಯನ ದೇವಸ್ಥಾನಕ್ಕೆ ದಾನ ಮಾಡಲಾಗಿದೆ. ಕಾಲಾನಂತರದಲ್ಲಿ ಬಂದ ಭೂಸುಧಾರಣೆ
                ಕಾನೂನಿನಿಂದಾಗಿ ಜಮೀನುಗಳು ಒಕ್ಕಲುಗಳ ಅಧೀನವಾದವು . ಈಗ ದೇವಸ್ಥಾನದ ಅಧೀನ
                ಕೇವಲ 26 ಸೆಂಟ್ಸ್ ಜಾಗ ಉಳಿದುಕೊಂಡಿದೆ. ಒಕ್ಕಲುಗಳಿಂದ ಬರುತ್ತಿದ್ದ ಆದಾಯ
                ಕುಂಠಿತವಾಗಿ ದೇವಸ್ಥಾನದ ಆಗುಹೋಗುಗಳು , ದುರಸ್ತಿ ಕಾರ್ಯ ಕಾಲಕಾಲಕ್ಕೆ
                ನಡೆಯದೇ ಜೀರ್ಣಾವಸ್ಥೆ ಹೊಂದಿದೆ . 1994-95 ರಲ್ಲಿ ಹೇಗೋ ಬಹು ಪ್ರಯತ್ನದಿಂದ
                ದುರಸ್ತಿ ಕಾಮಗಾರಿ ನಡೆದು 1995 ಮೇ 14 ರಂದು ಶ್ರೀ ದೇವಳದ ಕಲಶ
                ಪ್ರತಿಷ್ಠಾಪನೆಗೊಂಡಿತ್ತು. ಇದಾಗಿ ಹತ್ತಿಪ್ಪತು ವರ್ಷಗಳೇ ಸಂದುದರಿಂದ
                ಪ್ರಸ್ತುತ ದೇಗುಲವು ಜೀರ್ಣಾವಸ್ಥೆಗೆ ಬಂದು ತುರ್ತಾಗಿ ನವೀಕರಣ
                ಅಪೇಕ್ಷಿಸುತ್ತದೆ. ಮಹಾ ವೈಭವದಿಂದ ಮೆರೆದ ಈ ದೈವ ಸನ್ನಿಧಿಯು ಶಕ್ತಿ
                ಕೇಂದ್ರವಾಗಿ ಬೆಳೆಯಬೇಕೆಂಬ ಆಶಯದಿಂದ ಸಂಬಂಧಪಟ್ಟ ವಂಶಸ್ಥರು , ಮಾಜಿ
                ಒಕ್ಕಲುಗಳು ಮತ್ತು ಭಕ್ತ ಭಜಕ ವೃಂದದವರು ಯೋಚಿಸಿ ಈ ಬಗ್ಗೆ
                ಕಾರ್ಯೋನ್ಮುಖರಾದರು . 2019 ರಲ್ಲಿ ಈ ಬಗ್ಗೆ ಅಷ್ಟಮಂಗಲ ಪ್ರಶ್ನಾವಳಿ ನಡೆಸಿ,
                ಜೀರ್ಣೋಧಾರಕ್ಕೆ ಬೇಕಾದ ಪ್ರಾಯಶ್ಚಿತ್ತ ಮಾರ್ಗಸೂಚಿಗಳನ್ನು ಪಡೆದು ಅದರಂತೆ
                ಎಲ್ಲಾ ಪ್ರಾಯಶ್ಚಿತ್ತ ಕರ್ಮಗಳನ್ನು ಹಂತ ಹಂತವಾಗಿ 2023 ರೊಳಗೆ
                ನೆರವೇರಿಸಲಾಗಿದೆ . ಇದರ ವೆಚ್ಚಕ್ಕೆ ರೂಪಾಯಿ 10 ಲಕ್ಷ ನಿಧಿಯನ್ನು ಭಕ್ತರಿಂದ
                ಸಂಗ್ರಹಿಸಿ ವಿನಿಯೋಗಿಸಲಾಗಿದೆ. ದೇವಸ್ಥಾನದ ಸ್ಥಾಪಕ ವಂಶಸ್ಥರು, ಒಕ್ಕಲು,
                ಭಜಕ ಭಕ್ತರು ಸೇರಿ ಬ್ರಹ್ಮಕಲಶ ಸಮಿತಿ ರಚಿಸಿರುವರು. ಕಾರ್ಯೋನ್ಮುಖರಾದ
                ಸಮಿತಿಯವರು ವಾಸ್ತು ತಜ್ಞರನ್ನು ಸಂಪರ್ಕಿಸಿ , ಗರ್ಭಗುಡಿ, ಅಂಬಲಗಳು ,
                ಪರಿವಾರ ದೈವಗಳ ಗುಡಿ, ತೀರ್ಥದ ಕೆರೆ ನಿರ್ಮಾಣ , ಭೋಜನ ಶಾಲೆ ಮತ್ತು
                ದೇವಸ್ಥಾನದ ಸಂಪರ್ಕ ರಸ್ತೆ ನಿರ್ಮಾಣಕ್ಕಿ ಬೇಕಾದ ನೀಲಿ ನಕ್ಷೆಗಳನ್ನು
                ಪಡೆಯಲಾಗಿದೆ. ಇದರಂತೆ ಪ್ರಕೃತ ಅಂದಾಜು ವೆಚ್ಚ ರೂಪಾಯಿ 2 ಕೋಟಿ 70 ಲಕ್ಷ
                ಬರಬಹುದೆಂದು ಅಂದಾಜಿಸಲಾಗಿದೆ . ಜೀರ್ಣೋದ್ಧಾರ ಸಮಿತಿಯವರು ವಿಳಂಬ ಮಾಡದೆ
                ಅಂದಾಜು 9 ಲಕ್ಷ ವೆಚ್ಚದಲ್ಲಿ ಸಂಪರ್ಕ ರಸ್ತೆಯನ್ನು ಪೂರ್ಣಗೊಳಿಸಿದ್ದಾರೆ.
                ಮುಂದೆ ಜೀರ್ಣೋದ್ಧಾರ ಕಾರ್ಯಗಳಿಗೆ, ಬ್ರಹ್ಮಕಲಶದ ಖರ್ಚು ವೆಚ್ಚಗಳಿಗೆ ಸಹೃದಯ
                ಭಜಕ ಭಕ್ತರನ್ನು ಭಿನ್ನವಿಸುವುದೆಂದು ಜೀರ್ಣೋದ್ಧಾರ ಸಮಿತಿಯವರು
                ನಿಶ್ಚಯಿಸಿರುತ್ತಾರೆ. ಈ ದೇವಾಲಯವು ಈಗಿನ ಪ್ರಸ್ತುತ ಕಾಲದಲ್ಲಿ ವಂಶಸ್ಥರು,
                ಎಲ್ಲಾ ಮಾಜಿ ಒಕ್ಕಲುಗಳು, ಊರ-ಪರಊರ ಎಲ್ಲಾ ಆಸ್ತಿಕ ಬಂಧುಗಳಿಗೆ ಸೇರಿದೆ. ಆ
                ಪ್ರಯುಕ್ತ ಉದಾರ ದಾನಿಗಳು ಕೊಡುವ ಧನ, ವಸ್ತುಗಳು,ಮರ ಇತ್ಯಾದಿ ಯಾವ
                ರೂಪದಿಂದಲು ಕೊಡುವ ಸಹಾಯವನ್ನು ಸ್ವೀಕರಿಸುವುದಾಗಿಯೂ ಪ್ರಾರ್ಥನೆ ಮಾಡಿ ಎಲ್ಲ
                ಭಗವತ್ ಭಕ್ತರು ಈ ಬೃಹತ್ ಕಾರ್ಯಕ್ಕೆ ಸಹಕರಿಸಬೇಕೆಂದು ಮತ್ತೊಮ್ಮೆ
                ವಿನಂತಿಸುತ್ತೇವೆ. ಶ್ರೀ ಲಕ್ಷ್ಮಿ ವೆಂಕಟರಮಣನ ಕೃಪೆ ಎಲ್ಲರ ಮೇಲೆ ಇರಲಿ.
              </Typography>
              <img
                src={expenses}
                style={{ width: "100%", height: "auto" }}
                alt="Expenses"
              />
            </Grid>
          </Grid>
        </Container>
        <center>
          <Copyright
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              minHeight: "100vh",
              padding: "20px",
              boxSizing: "border-box",
            }}
          />
        </center>
      </div>
    </div>
  );
}
