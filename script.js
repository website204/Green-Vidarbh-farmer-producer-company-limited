/* =========================================================
   GREEN VIDARBHA FARMER PRODUCER COMPANY LIMITED
   Main JavaScript
========================================================= */

"use strict";


/* =========================================================
   HELPER FUNCTIONS
========================================================= */

const $ = (selector, parent = document) =>
  parent.querySelector(selector);

const $$ = (selector, parent = document) =>
  [...parent.querySelectorAll(selector)];


/* =========================================================
   DOM READY
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

  /* -------------------------------------------------------
     INITIAL SETTINGS
  ------------------------------------------------------- */

  const languageSelect = $("#languageSelect");

  // English is ALWAYS the default language.
  // We intentionally do not use localStorage for language.
  if (languageSelect) {
    languageSelect.value = "en";
  }

  document.documentElement.lang = "en";


  /* -------------------------------------------------------
     WELCOME SCREEN
  ------------------------------------------------------- */

  const welcomeScreen = $("#welcomeScreen");

  if (welcomeScreen) {

    setTimeout(() => {
      welcomeScreen.classList.add("hide");

      setTimeout(() => {
        welcomeScreen.style.display = "none";
      }, 700);

    }, 1500);

  }


  /* -------------------------------------------------------
     CURRENT YEAR
  ------------------------------------------------------- */

  const yearElement = $("#year");

  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }


  /* -------------------------------------------------------
     MOBILE NAVIGATION
  ------------------------------------------------------- */

  const menuToggle = $("#menuToggle");
  const navLinks = $("#navLinks");

  if (menuToggle && navLinks) {

    menuToggle.addEventListener("click", () => {

      const isOpen =
        navLinks.classList.toggle("open");

      menuToggle.classList.toggle("active", isOpen);

      menuToggle.setAttribute(
        "aria-expanded",
        String(isOpen)
      );

    });


    // Close mobile menu when a navigation link is clicked

    $$(".nav-links a", navLinks).forEach(link => {

      link.addEventListener("click", () => {

        navLinks.classList.remove("open");
        menuToggle.classList.remove("active");

        menuToggle.setAttribute(
          "aria-expanded",
          "false"
        );

      });

    });

  }


  /* =======================================================
     DARK / LIGHT MODE
  ======================================================= */

  const themeToggle = $("#themeToggle");

  if (themeToggle) {

    const savedTheme =
      localStorage.getItem("greenVidarbhaTheme");

    if (savedTheme === "dark") {

      document.body.classList.add("dark-mode");

      themeToggle.textContent = "☀";

    }


    themeToggle.addEventListener("click", () => {

      const isDark =
        document.body.classList.toggle("dark-mode");

      localStorage.setItem(
        "greenVidarbhaTheme",
        isDark ? "dark" : "light"
      );

      themeToggle.textContent =
        isDark ? "☀" : "☾";

    });

  }


  /* =======================================================
     SCROLL REVEAL
  ======================================================= */

  const revealElements = $$(".reveal");

  if ("IntersectionObserver" in window) {

    const revealObserver =
      new IntersectionObserver(
        (entries, observer) => {

          entries.forEach(entry => {

            if (entry.isIntersecting) {

              entry.target.classList.add("visible");

              observer.unobserve(entry.target);

            }

          });

        },
        {
          threshold: 0.12
        }
      );


    revealElements.forEach(element => {

      revealObserver.observe(element);

    });

  } else {

    revealElements.forEach(element => {

      element.classList.add("visible");

    });

  }


  /* =======================================================
     PRODUCT FILTER
  ======================================================= */

  const filterButtons =
    $$(".filter-btn");

  const productCards =
    $$(".product-card");


  filterButtons.forEach(button => {

    button.addEventListener("click", () => {

      filterButtons.forEach(btn => {

        btn.classList.remove("active");

      });

      button.classList.add("active");


      const filter =
        button.dataset.filter;


      productCards.forEach(card => {

        const category =
          card.dataset.category;


        if (
          filter === "all" ||
          category === filter
        ) {

          card.style.display = "";

          requestAnimationFrame(() => {
            card.classList.remove("filter-hidden");
          });

        } else {

          card.classList.add("filter-hidden");

          setTimeout(() => {

            if (
              card.classList.contains("filter-hidden")
            ) {
              card.style.display = "none";
            }

          }, 250);

        }

      });

    });

  });


  /* =======================================================
     GALLERY MODAL
  ======================================================= */

  const galleryModal =
    $("#galleryModal");

  const modalImage =
    $("#modalImage");

  const modalCaption =
    $("#modalCaption");


  $$(".gallery-item").forEach(item => {

    item.addEventListener("click", () => {

      if (!galleryModal || !modalImage) {
        return;
      }


      const image =
        item.dataset.image;

      const caption =
        item.dataset.caption || "";


      modalImage.src = image;

      modalImage.alt =
        getTranslatedGalleryCaption(
          item.dataset.i18nCaption,
          caption
        );

      if (modalCaption) {
        modalCaption.textContent =
          getTranslatedGalleryCaption(
            item.dataset.i18nCaption,
            caption
          );
      }


      openModal(galleryModal);

    });

  });


  /* =======================================================
     POP MODAL
  ======================================================= */

  const popModal =
    $("#popModal");

  const popImage =
    $("#popImage");

  const popFallback =
    $("#popFallback");


  $$(".pop-btn").forEach(button => {

    button.addEventListener("click", () => {

      if (!popModal) {
        return;
      }


      const imagePath =
        button.dataset.pop;


      if (popImage) {

        popImage.src = imagePath;

        popImage.style.display = "block";

        popImage.onerror = () => {

          popImage.style.display = "none";

          if (popFallback) {
            popFallback.style.display = "block";
          }

        };

        popImage.onload = () => {

          popImage.style.display = "block";

          if (popFallback) {
            popFallback.style.display = "none";
          }

        };

      }


      openModal(popModal);

    });

  });


  /* =======================================================
     MODAL CLOSE BUTTONS
  ======================================================= */

  $$("[data-close]").forEach(button => {

    button.addEventListener("click", () => {

      const modalId =
        button.dataset.close;

      const modal =
        document.getElementById(modalId);

      if (modal) {
        closeModal(modal);
      }

    });

  });


  /* Close modal by clicking outside */

  $$(".modal").forEach(modal => {

    modal.addEventListener("click", event => {

      if (event.target === modal) {

        closeModal(modal);

      }

    });

  });


  /* Close modal with Escape */

  document.addEventListener("keydown", event => {

    if (event.key === "Escape") {

      $$(".modal").forEach(modal => {

        if (
          modal.classList.contains("open")
        ) {
          closeModal(modal);
        }

      });

    }

  });


  /* =======================================================
     WHATSAPP CONTACT FORM
  ======================================================= */

  const contactForm =
    $("#contactForm");


  if (contactForm) {

    contactForm.addEventListener(
      "submit",
      event => {

        event.preventDefault();


        const name =
          $("#contactName")?.value.trim() || "";

        const phone =
          $("#contactPhone")?.value.trim() || "";

        const message =
          $("#contactMessage")?.value.trim() || "";


        if (!name || !phone || !message) {

          showToast(
            getCurrentLanguage() === "mr"
              ? "कृपया सर्व माहिती भरा."
              : "Please fill in all fields."
          );

          return;

        }


        /* Basic phone validation */

        const cleanPhone =
          phone.replace(/\D/g, "");


        if (cleanPhone.length < 10) {

          showToast(
            getCurrentLanguage() === "mr"
              ? "कृपया योग्य दूरध्वनी क्रमांक द्या."
              : "Please enter a valid phone number."
          );

          return;

        }


        const language =
          getCurrentLanguage();


        const intro =
          language === "mr"
            ? "नमस्कार Green Vidarbha टीम,"
            : "Hello Green Vidarbha Team,";


        const nameLabel =
          language === "mr"
            ? "नाव"
            : "Name";


        const phoneLabel =
          language === "mr"
            ? "दूरध्वनी क्रमांक"
            : "Phone";


        const messageLabel =
          language === "mr"
            ? "संदेश"
            : "Message";


        const whatsappMessage =
`${intro}

${nameLabel}: ${name}
${phoneLabel}: ${phone}

${messageLabel}:
${message}`;


        const whatsappURL =
          `https://wa.me/918698518212?text=${encodeURIComponent(
            whatsappMessage
          )}`;


        window.open(
          whatsappURL,
          "_blank",
          "noopener,noreferrer"
        );


        contactForm.reset();


        showToast(
          language === "mr"
            ? "व्हॉट्सॲप उघडत आहे..."
            : "Opening WhatsApp..."
        );

      }
    );

  }


  /* =======================================================
     LANGUAGE SWITCHER
  ======================================================= */

  setupLanguageSwitcher();


  /* =======================================================
     SMOOTH SCROLLING
  ======================================================= */

  $$('a[href^="#"]').forEach(link => {

    link.addEventListener("click", event => {

      const targetId =
        link.getAttribute("href");


      if (
        !targetId ||
        targetId === "#"
      ) {
        return;
      }


      const target =
        document.querySelector(targetId);


      if (!target) {
        return;
      }


      event.preventDefault();


      const header =
        $(".site-header");


      const headerHeight =
        header
          ? header.offsetHeight
          : 0;


      const targetPosition =
        target.getBoundingClientRect().top +
        window.scrollY -
        headerHeight;


      window.scrollTo({
        top: targetPosition,
        behavior: "smooth"
      });

    });

  });


  /* =======================================================
     IMAGE ERROR HANDLING
  ======================================================= */

  $$("img").forEach(image => {

    image.addEventListener("error", () => {

      image.classList.add("image-error");

    });

  });


  /* =======================================================
     CURRENT SECTION NAVIGATION
  ======================================================= */

  const sections =
    $$("main section[id]");

  const navItems =
    $$(".nav-links a[href^='#']");


  if (
    sections.length &&
    navItems.length &&
    "IntersectionObserver" in window
  ) {

    const sectionObserver =
      new IntersectionObserver(
        entries => {

          entries.forEach(entry => {

            if (!entry.isIntersecting) {
              return;
            }


            const id =
              entry.target.id;


            navItems.forEach(link => {

              link.classList.toggle(
                "current",
                link.getAttribute("href") ===
                `#${id}`
              );

            });

          });

        },
        {
          rootMargin: "-35% 0px -55% 0px",
          threshold: 0
        }
      );


    sections.forEach(section => {

      sectionObserver.observe(section);

    });

  }


  /* =======================================================
     MODAL BODY SCROLL LOCK
  ======================================================= */

  document.addEventListener(
    "modalStateChange",
    event => {

      const anyModalOpen =
        $$(".modal.open").length > 0;

      document.body.classList.toggle(
        "modal-open",
        anyModalOpen
      );

    }
  );


  console.log(
    "Green Vidarbha website loaded successfully."
  );

});


/* =========================================================
   MODAL FUNCTIONS
========================================================= */

function openModal(modal) {

  if (!modal) {
    return;
  }


  modal.classList.add("open");

  modal.setAttribute(
    "aria-hidden",
    "false"
  );


  document.dispatchEvent(
    new Event("modalStateChange")
  );

}


function closeModal(modal) {

  if (!modal) {
    return;
  }


  modal.classList.remove("open");

  modal.setAttribute(
    "aria-hidden",
    "true"
  );


  document.dispatchEvent(
    new Event("modalStateChange")
  );

}


/* =========================================================
   TOAST
========================================================= */

function showToast(message) {

  const toast =
    document.querySelector("#toast");


  if (!toast) {
    return;
  }


  toast.textContent = message;

  toast.classList.add("show");


  clearTimeout(
    window.greenVidarbhaToastTimer
  );


  window.greenVidarbhaToastTimer =
    setTimeout(() => {

      toast.classList.remove("show");

    }, 3000);

}


/* =========================================================
   LANGUAGE SYSTEM
========================================================= */

const translations = {


  /* =======================================================
     ENGLISH
  ======================================================= */

  en: {

    /* Welcome */

    welcomeTo:
      "WELCOME TO",

    welcomeSub:
      "Quality Seeds • Prosperous Farmers • Sustainable Tomorrow",


    /* Header */

    languageLabel:
      "Language",

    logoAlt:
      "Green Vidarbha logo",

    homeLabel:
      "Green Vidarbha home",

    openNavigation:
      "Open navigation",

    toggleTheme:
      "Toggle theme",

    toggleDarkMode:
      "Toggle dark mode",

    brandTagline:
      "Quality Seeds • Prosperous Farmers • Sustainable Tomorrow",


    /* Navigation */

    navHome:
      "Home",

    navAbout:
      "About Us",

    navProducts:
      "Products",

    navTeam:
      "Our Team",

    navGallery:
      "Gallery",

    navDocuments:
      "Documents",

    navContact:
      "Contact Us",


    /* Hero */

    heroEyebrow:
      "BETTER SEEDS | STRONGER FARMS | BRIGHTER FUTURES",

    heroTitleMain:
      "Quality Seeds for",

    heroTitleHighlight:
      "a Healthier Tomorrow",

    heroText:
      "Green Vidarbha Farmer Producer Company Limited is committed to providing quality seeds and supporting farmers with reliable agricultural solutions.",

    exploreProducts:
      "Explore Products",

    contactUs:
      "Contact Us",


    /* Value strip */

    valueQuality:
      "Quality Seeds",

    valueQualitySmall:
      "For better yield potential",

    valueFarmer:
      "Farmer Focused",

    valueFarmerSmall:
      "Supporting our farming community",

    valueSustainable:
      "Sustainable Agriculture",

    valueSustainableSmall:
      "For future generations",

    valuePartner:
      "Trusted Partner",

    valuePartnerSmall:
      "Committed to every step",


    /* About */

    aboutKicker:
      "ABOUT US",

    aboutTitleMain:
      "Growing with farmers,",

    aboutTitleHighlight:
      "growing with Vidarbha.",

    aboutParagraph1:
      "Green Vidarbha Farmer Producer Company Limited was established on 25 May 2022 with a focus on supporting farmers through quality agricultural inputs and a farmer-centered approach.",

    aboutParagraph2:
      "Based in Buldhana district, Maharashtra, the company works toward a stronger farming ecosystem by connecting quality seed choices with the needs of local farmers.",

    meetTeam:
      "Meet our team →",

    factEstablished:
      "Established",

    factLocation:
      "Location",

    factLocationValue:
      "Buldhana, Maharashtra",

    factLeadership:
      "Leadership",

    factLeadershipValue:
      "4 Directors + 1 Additional",

    factContact:
      "Contact",

    aboutQuote:
      "“Better seeds. Stronger farms. Brighter futures.”",


    /* Products */

    productsKicker:
      "OUR PRODUCTS",

    productsTitleMain:
      "Seed varieties for",

    productsTitleHighlight:
      "better possibilities.",

    productsIntro:
      "Explore our selected crop varieties. Product cards are ready for your POP images and detailed documents.",

    allCrops:
      "All Crops",

    soybean:
      "Soybean",

    gram:
      "Gram",

    soybeanVariety:
      "Soybean variety",

    gramVariety:
      "Gram variety",

    pdfPop:
      "PDF / POP",

    addPop:
      "Add your POP image here",

    viewPop:
      "View POP →",


    /* Product alt text */

    maus725Alt:
      "MAUS 725 POP",

    phuleDurvaAlt:
      "Phule Durva POP",

    rvsm35Alt:
      "RVSM 2011-35 POP",

    js335Alt:
      "JS-335 POP",

    js9305Alt:
      "JS-9305 POP",

    kds726Alt:
      "KDS-726 POP",

    jaki9218Alt:
      "JAKI-9218 POP",


    /* Team */

    teamKicker:
      "OUR TEAM",

    teamTitleMain:
      "People behind the",

    teamTitleHighlight:
      "purpose.",

    teamIntro:
      "Leadership committed to building a stronger farmer-focused organization.",

    director:
      "Director",

    additionalDirector:
      "Additional Director",


    /* Gallery */

    galleryKicker:
      "GALLERY",

    galleryTitleMain:
      "Moments from our",

    galleryTitleHighlight:
      "journey.",

    galleryIntro:
      "Add your own agricultural, farmer, field and company photographs in the images folder.",

    galleryCaption1:
      "Green Vidarbha",

    galleryCaption2:
      "Agriculture & Farmers",

    galleryCaption3:
      "Quality Seeds",

    galleryCaption4:
      "Our Fields",

    galleryAlt1:
      "Gallery image 1",

    galleryAlt2:
      "Gallery image 2",

    galleryAlt3:
      "Gallery image 3",

    galleryAlt4:
      "Gallery image 4",


    /* Documents */

    documentsKicker:
      "DOCUMENTS",

    documentsTitleMain:
      "Company",

    documentsTitleHighlight:
      "documents.",

    documentsIntro:
      "Place your PDF files inside the documents folder and update the filenames below.",

    companyLicense:
      "Company License",

    officialDocument:
      "Official document",

    fpcRegistration:
      "FPC Registration",

    registrationDocument:
      "Registration document",

    otherDocument:
      "Other Document",

    companyDocument:
      "Company document",


    /* Contact */

    contactKicker:
      "CONTACT US",

    contactTitleMain:
      "Let’s grow",

    contactTitleHighlight:
      "together.",

    contactIntro:
      "We are here to connect with farmers, partners and people interested in our agricultural journey.",

    phone:
      "Phone",

    whatsapp:
      "WhatsApp",

    chatWithUs:
      "Chat with us",

    email:
      "Email",

    address:
      "Address",

    sendEnquiry:
      "Send an enquiry",

    name:
      "Name",

    yourName:
      "Your name",

    yourPhone:
      "Your phone number",

    message:
      "Message",

    howCanWeHelp:
      "How can we help?",

    sendOnWhatsApp:
      "Send on WhatsApp",

    whatsappFormNote:
      "Your message will open in WhatsApp with the details filled in.",


    /* Footer */

    footerCompanyType:
      "Farmer Producer Company Limited",

    allRightsReserved:
      "All rights reserved.",

    backToTop:
      "Back to top ↑",


    /* Modals */

    close:
      "Close",

    popLabel:
      "POINT OF PRODUCT / POP",

    productPopAlt:
      "Product POP",

    addCorrespondingPop:
      "Add the corresponding POP image to the",

    folder:
      "folder.",

    call:
      "Call"

  },


  /* =======================================================
     MARATHI
  ======================================================= */

  mr: {

    /* Welcome */

    welcomeTo:
      "आपले स्वागत आहे",

    welcomeSub:
      "दर्जेदार बियाणे • समृद्ध शेतकरी • शाश्वत भविष्य",


    /* Header */

    languageLabel:
      "भाषा",

    logoAlt:
      "ग्रीन विदर्भ लोगो",

    homeLabel:
      "ग्रीन विदर्भ मुख्यपृष्ठ",

    openNavigation:
      "नेव्हिगेशन उघडा",

    toggleTheme:
      "थीम बदला",

    toggleDarkMode:
      "डार्क मोड बदला",

    brandTagline:
      "दर्जेदार बियाणे • समृद्ध शेतकरी • शाश्वत भविष्य",


    /* Navigation */

    navHome:
      "मुख्यपृष्ठ",

    navAbout:
      "आमच्याबद्दल",

    navProducts:
      "उत्पादने",

    navTeam:
      "आमची टीम",

    navGallery:
      "छायाचित्र संग्रह",

    navDocuments:
      "कागदपत्रे",

    navContact:
      "संपर्क करा",


    /* Hero */

    heroEyebrow:
      "उत्तम बियाणे | मजबूत शेती | उज्ज्वल भविष्य",

    heroTitleMain:
      "निरोगी उद्यासाठी",

    heroTitleHighlight:
      "दर्जेदार बियाणे",

    heroText:
      "ग्रीन विदर्भ फार्मर प्रोड्यूसर कंपनी लिमिटेड दर्जेदार बियाणे उपलब्ध करून देण्यासाठी आणि शेतकऱ्यांना विश्वासार्ह कृषी उपाय देण्यासाठी कार्यरत आहे.",

    exploreProducts:
      "उत्पादने पहा",

    contactUs:
      "संपर्क करा",


    /* Value strip */

    valueQuality:
      "दर्जेदार बियाणे",

    valueQualitySmall:
      "चांगल्या उत्पादनासाठी",

    valueFarmer:
      "शेतकरी केंद्रित",

    valueFarmerSmall:
      "शेतकरी बांधवांना सहकार्य",

    valueSustainable:
      "शाश्वत शेती",

    valueSustainableSmall:
      "पुढील पिढ्यांसाठी",

    valuePartner:
      "विश्वासू भागीदार",

    valuePartnerSmall:
      "प्रत्येक टप्प्यावर कटिबद्ध",


    /* About */

    aboutKicker:
      "आमच्याबद्दल",

    aboutTitleMain:
      "शेतकऱ्यांसोबत प्रगती,",

    aboutTitleHighlight:
      "विदर्भासोबत विकास.",

    aboutParagraph1:
      "ग्रीन विदर्भ फार्मर प्रोड्यूसर कंपनी लिमिटेडची स्थापना २५ मे २०२२ रोजी झाली. दर्जेदार कृषी निविष्ठा आणि शेतकरी केंद्रित दृष्टिकोनातून शेतकऱ्यांना सहकार्य करणे हा कंपनीचा मुख्य उद्देश आहे.",

    aboutParagraph2:
      "बुलढाणा जिल्हा, महाराष्ट्र येथे स्थित ही कंपनी स्थानिक शेतकऱ्यांच्या गरजांनुसार दर्जेदार बियाण्यांची निवड उपलब्ध करून देत मजबूत कृषी व्यवस्था निर्माण करण्यासाठी कार्यरत आहे.",

    meetTeam:
      "आमच्या टीमची माहिती →",

    factEstablished:
      "स्थापना",

    factLocation:
      "ठिकाण",

    factLocationValue:
      "बुलढाणा, महाराष्ट्र",

    factLeadership:
      "नेतृत्व",

    factLeadershipValue:
      "४ संचालक + १ अतिरिक्त",

    factContact:
      "संपर्क",

    aboutQuote:
      "“उत्तम बियाणे. मजबूत शेती. उज्ज्वल भविष्य.”",


    /* Products */

    productsKicker:
      "आमची उत्पादने",

    productsTitleMain:
      "बियाण्यांच्या जाती",

    productsTitleHighlight:
      "चांगल्या उत्पादनासाठी.",

    productsIntro:
      "आमच्या निवडक पिकांच्या बियाण्यांच्या जाती पहा. उत्पादन कार्डमध्ये तुमचे पीओपी चित्र आणि सविस्तर कागदपत्रे जोडता येतील.",

    allCrops:
      "सर्व पिके",

    soybean:
      "सोयाबीन",

    gram:
      "हरभरा",

    soybeanVariety:
      "सोयाबीनची जात",

    gramVariety:
      "हरभऱ्याची जात",

    pdfPop:
      "पीडीएफ / पीओपी",

    addPop:
      "तुमचे पीओपी चित्र येथे जोडा",

    viewPop:
      "पीओपी पहा →",


    /* Product alt text */

    maus725Alt:
      "MAUS 725 पीओपी",

    phuleDurvaAlt:
      "फुले दुर्वा पीओपी",

    rvsm35Alt:
      "RVSM 2011-35 पीओपी",

    js335Alt:
      "JS-335 पीओपी",

    js9305Alt:
      "JS-9305 पीओपी",

    kds726Alt:
      "KDS-726 पीओपी",

    jaki9218Alt:
      "JAKI-9218 पीओपी",


    /* Team */

    teamKicker:
      "आमची टीम",

    teamTitleMain:
      "या कार्यामागील",

    teamTitleHighlight:
      "आमची टीम.",

    teamIntro:
      "शेतकरी केंद्रित मजबूत संस्था उभारण्यासाठी कटिबद्ध नेतृत्व.",

    director:
      "संचालक",

    additionalDirector:
      "अतिरिक्त संचालक",


    /* Gallery */

    galleryKicker:
      "छायाचित्र संग्रह",

    galleryTitleMain:
      "आमच्या प्रवासातील",

    galleryTitleHighlight:
      "क्षण.",

    galleryIntro:
      "images फोल्डरमध्ये शेती, शेतकरी, शेत आणि कंपनीची छायाचित्रे जोडा.",

    galleryCaption1:
      "ग्रीन विदर्भ",

    galleryCaption2:
      "शेती आणि शेतकरी",

    galleryCaption3:
      "दर्जेदार बियाणे",

    galleryCaption4:
      "आमची शेती",

    galleryAlt1:
      "छायाचित्र १",

    galleryAlt2:
      "छायाचित्र २",

    galleryAlt3:
      "छायाचित्र ३",

    galleryAlt4:
      "छायाचित्र ४",


    /* Documents */

    documentsKicker:
      "कागदपत्रे",

    documentsTitleMain:
      "कंपनीची",

    documentsTitleHighlight:
      "कागदपत्रे.",

    documentsIntro:
      "तुमच्या पीडीएफ फाइल्स documents फोल्डरमध्ये ठेवा आणि खालील फाइलची नावे अपडेट करा.",

    companyLicense:
      "कंपनी परवाना",

    officialDocument:
      "अधिकृत कागदपत्र",

    fpcRegistration:
      "एफपीसी नोंदणी",

    registrationDocument:
      "नोंदणी कागदपत्र",

    otherDocument:
      "इतर कागदपत्र",

    companyDocument:
      "कंपनीचे कागदपत्र",


    /* Contact */

    contactKicker:
      "संपर्क करा",

    contactTitleMain:
      "चला, करूया",

    contactTitleHighlight:
      "एकत्र प्रगती.",

    contactIntro:
      "शेतकरी, भागीदार आणि आमच्या कृषी प्रवासात स्वारस्य असलेल्या सर्वांशी जोडण्यासाठी आम्ही येथे आहोत.",

    phone:
      "दूरध्वनी",

    whatsapp:
      "व्हॉट्सॲप",

    chatWithUs:
      "आमच्याशी संवाद साधा",

    email:
      "ई-मेल",

    address:
      "पत्ता",

    sendEnquiry:
      "चौकशी पाठवा",

    name:
      "नाव",

    yourName:
      "तुमचे नाव",

    yourPhone:
      "तुमचा दूरध्वनी क्रमांक",

    message:
      "संदेश",

    howCanWeHelp:
      "आम्ही तुमची कशी मदत करू शकतो?",

    sendOnWhatsApp:
      "व्हॉट्सॲपवर पाठवा",

    whatsappFormNote:
      "तुमचा संदेश भरलेल्या माहितीसह व्हॉट्सॲपमध्ये उघडेल.",


    /* Footer */

    footerCompanyType:
      "शेतकरी उत्पादक कंपनी लिमिटेड",

    allRightsReserved:
      "सर्व हक्क राखीव.",

    backToTop:
      "वर जा ↑",


    /* Modals */

    close:
      "बंद करा",

    popLabel:
      "उत्पादनाची माहिती / पीओपी",

    productPopAlt:
      "उत्पादनाची पीओपी माहिती",

    addCorrespondingPop:
      "संबंधित पीओपी चित्र",

    folder:
      "फोल्डरमध्ये जोडा.",

    call:
      "कॉल करा"

  }

};


/* =========================================================
   LANGUAGE SWITCHER SETUP
========================================================= */

function setupLanguageSwitcher() {

  const languageSelect =
    document.querySelector("#languageSelect");


  if (!languageSelect) {
    return;
  }


  /*
     Always start in English.
     We intentionally do not remember the selected language.
  */

  languageSelect.value = "en";

  applyLanguage("en");


  languageSelect.addEventListener(
    "change",
    event => {

      const selectedLanguage =
        event.target.value === "mr"
          ? "mr"
          : "en";


      applyLanguage(
        selectedLanguage
      );

    }
  );

}


/* =========================================================
   APPLY LANGUAGE
========================================================= */

function applyLanguage(language) {

  const lang =
    translations[language]
      ? language
      : "en";


  const dictionary =
    translations[lang];


  document.documentElement.lang =
    lang === "mr"
      ? "mr"
      : "en";


  /* -------------------------------------------------------
     NORMAL TEXT
  ------------------------------------------------------- */

  $$("[data-i18n]").forEach(element => {

    const key =
      element.dataset.i18n;


    if (
      Object.prototype.hasOwnProperty.call(
        dictionary,
        key
      )
    ) {

      element.textContent =
        dictionary[key];

    }

  });


  /* -------------------------------------------------------
     ATTRIBUTES
     
     Example:
     data-i18n-attr="placeholder:yourName"
     
     Multiple:
     data-i18n-attr="title:toggleTheme,aria-label:toggleDarkMode"
  ------------------------------------------------------- */

  $$("[data-i18n-attr]").forEach(element => {

    const instructions =
      element.dataset.i18nAttr;


    if (!instructions) {
      return;
    }


    instructions
      .split(",")
      .forEach(instruction => {

        const parts =
          instruction.split(":");


        if (parts.length < 2) {
          return;
        }


        const attribute =
          parts[0].trim();

        const key =
          parts.slice(1).join(":").trim();


        if (
          Object.prototype.hasOwnProperty.call(
            dictionary,
            key
          )
        ) {

          element.setAttribute(
            attribute,
            dictionary[key]
          );

        }

      });

  });


  /* -------------------------------------------------------
     GALLERY DATA CAPTIONS
  ------------------------------------------------------- */

  $$("[data-i18n-caption]").forEach(element => {

    const key =
      element.dataset.i18nCaption;


    if (
      Object.prototype.hasOwnProperty.call(
        dictionary,
        key
      )
    ) {

      element.dataset.caption =
        dictionary[key];

    }

  });


  /* -------------------------------------------------------
     UPDATE GALLERY MODAL IF IT IS OPEN
  ------------------------------------------------------- */

  const galleryModal =
    document.querySelector("#galleryModal");


  if (
    galleryModal &&
    galleryModal.classList.contains("open")
  ) {

    const currentCaption =
      document.querySelector("#modalCaption");


    if (currentCaption) {

      const galleryItems =
        $$(".gallery-item");


      const matchingItem =
        galleryItems.find(item =>
          item.dataset.image ===
          document.querySelector("#modalImage")?.src
        );


      if (matchingItem) {

        const key =
          matchingItem.dataset.i18nCaption;


        if (
          key &&
          Object.prototype.hasOwnProperty.call(
            dictionary,
            key
          )
        ) {

          currentCaption.textContent =
            dictionary[key];

        }

      }

    }

  }


  /* -------------------------------------------------------
     SAVE CURRENT LANGUAGE IN MEMORY ONLY
     
     This is NOT localStorage.
     Refreshing the page will return to English.
  ------------------------------------------------------- */

  window.greenVidarbhaLanguage =
    lang;

}


/* =========================================================
   GET CURRENT LANGUAGE
========================================================= */

function getCurrentLanguage() {

  return (
    window.greenVidarbhaLanguage ||
    "en"
  );

}


/* =========================================================
   GALLERY CAPTION HELPER
========================================================= */

function getTranslatedGalleryCaption(
  key,
  fallback
) {

  const language =
    getCurrentLanguage();


  const dictionary =
    translations[language] ||
    translations.en;


  if (
    key &&
    Object.prototype.hasOwnProperty.call(
      dictionary,
      key
    )
  ) {

    return dictionary[key];

  }


  return fallback || "";

}


/* =========================================================
   PAGE VISIBILITY / TAB TITLE
========================================================= */

document.addEventListener(
  "visibilitychange",
  () => {

    if (document.hidden) {

      document.title =
        "Green Vidarbha";

    } else {

      document.title =
        "Green Vidarbha Farmer Producer Company Limited";

    }

  }
);